import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPlayerSchema, insertPlayerStatsSchema, insertScoreSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { updatePlayerStatsFromSocialMedia } from "./scraper";
import { 
  fetchPlayersFromMajorLeagues, 
  updatePlayerInfluenceScores,
  calculatePlayerScores,
  testApiConnection
} from "./api/football";
import {
  getSetting,
  updateSetting,
  getAllSettings,
  FOOTBALL_API_KEY
} from "./api/settings";
import { importAllPlayers } from "./data/import-players";
import { startAutomaticUpdates, stopAutomaticUpdates, updateAllPlayersData } from "./data/auto-updater";

// Helper function to calculate influence scores
const calculateScores = (stats: any) => {
  // Calculate social score (0-100) based on total followers and engagement
  const totalFollowers = 
    (stats.instagramFollowers || 0) + 
    (stats.facebookFollowers || 0) + 
    (stats.twitterFollowers || 0);
  
  // Logarithmic scale for followers (since top players have hundreds of millions)
  // Log10(100M) is about 8, so we'll use that as a reference
  const socialScore = Math.min(
    100, 
    Math.round((Math.log10(totalFollowers + 1) / 8) * 80 + stats.fanEngagement * 20)
  );
  
  // Calculate performance score based on goals, assists, and cards
  // Higher goals and assists increase score, cards decrease it
  const performanceScore = Math.min(
    100,
    Math.round(
      ((stats.goals * 5) + (stats.assists * 3) - (stats.yellowCards * 1) - (stats.redCards * 3)) / 2
    )
  );
  
  // Engagement score is direct from input (0-100)
  const engagementScore = stats.fanEngagement;
  
  // Overall influence score is weighted average
  const totalScore = Math.round(
    (socialScore * 0.4) + (performanceScore * 0.4) + (engagementScore * 0.2)
  );
  
  return {
    totalScore,
    socialScore,
    performanceScore,
    engagementScore
  };
};

// Route handler function to validate request authentication
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Route handler function to validate admin privileges
const requireAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API endpoints
  // Players endpoints
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to get players" });
    }
  });
  
  app.get("/api/player-count", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players.length);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player count" });
    }
  });
  
  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player" });
    }
  });
  
  app.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(playerData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create player" });
    }
  });
  
  app.put("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const playerData = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(id, playerData);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update player" });
    }
  });
  
  app.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const success = await storage.deletePlayer(id);
      if (!success) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete player" });
    }
  });
  
  // Player Stats endpoints
  app.get("/api/players/:id/stats", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const stats = await storage.getPlayerStats(playerId);
      if (!stats) {
        return res.status(404).json({ message: "Player stats not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player stats" });
    }
  });
  
  app.post("/api/players/:id/stats", requireAdmin, async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      // Check if player exists
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Parse and validate stats data
      const statsData = insertPlayerStatsSchema.parse({ ...req.body, playerId });
      
      // Check if stats already exist for this player
      const existingStats = await storage.getPlayerStats(playerId);
      let stats;
      
      if (existingStats) {
        // Update existing stats
        stats = await storage.updatePlayerStats(existingStats.id, statsData);
      } else {
        // Create new stats
        stats = await storage.createPlayerStats(statsData);
      }
      
      // Calculate scores based on the stats
      const scores = calculateScores(stats);
      
      // Create or update the score record
      await storage.createScore({
        playerId,
        ...scores
      });
      
      res.status(201).json(stats);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create player stats" });
    }
  });
  
  // Scores endpoints
  app.get("/api/players/:id/scores", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const scores = await storage.getScores(playerId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player scores" });
    }
  });
  
  app.get("/api/players/:id/scores/latest", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const score = await storage.getLatestScore(playerId);
      if (!score) {
        return res.status(404).json({ message: "Player score not found" });
      }
      
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player score" });
    }
  });
  
  app.post("/api/players/:id/scores", requireAdmin, async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      // Check if player exists
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Parse and validate score data
      const scoreData = insertScoreSchema.parse({ ...req.body, playerId });
      const score = await storage.createScore(scoreData);
      
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create player score" });
    }
  });
  
  // Rankings endpoints
  app.get("/api/rankings", async (req, res) => {
    try {
      // Get query parameters for filtering
      const { limit = "100", sortBy = "totalScore" } = req.query;
      
      // Get all players with their stats and scores
      const players = await storage.getPlayersWithStatsAndScores();
      
      // Sort based on the sortBy parameter
      if (sortBy === "socialScore") {
        players.sort((a, b) => b.score.socialScore - a.score.socialScore);
      } else if (sortBy === "performanceScore") {
        players.sort((a, b) => b.score.performanceScore - a.score.performanceScore);
      } else if (sortBy === "engagementScore") {
        players.sort((a, b) => b.score.engagementScore - a.score.engagementScore);
      } else {
        // Default sort by totalScore
        players.sort((a, b) => b.score.totalScore - a.score.totalScore);
      }
      
      // Apply limit
      const limitNum = parseInt(limit as string);
      const limitedPlayers = isNaN(limitNum) ? players : players.slice(0, limitNum);
      
      res.json(limitedPlayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rankings" });
    }
  });
  
  // Top players by category endpoints
  app.get("/api/top-players/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = "5" } = req.query;
      
      // Validate category
      if (!["social", "performance", "engagement"].includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      // Get top players for the specified category
      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum <= 0) {
        return res.status(400).json({ message: "Invalid limit" });
      }
      
      const topPlayers = await storage.getTopPlayersByCategory(
        category as 'social' | 'performance' | 'engagement', 
        limitNum
      );
      
      res.json(topPlayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top players" });
    }
  });
  
  // Get a single player with stats and scores
  app.get("/api/player-details/:id", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      const playerWithDetails = await storage.getPlayerWithStatsAndScores(playerId);
      if (!playerWithDetails) {
        return res.status(404).json({ message: "Player not found or missing details" });
      }
      
      res.json(playerWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player details" });
    }
  });
  
  // Social media scraping endpoint
  app.post("/api/players/:id/scrape-social-media", requireAdmin, updatePlayerStatsFromSocialMedia);
  
  // Football API integration endpoints
  
  // Test Football API connection
  app.get("/api/test-football-api", requireAdmin, testApiConnection);
  
  // Import players from major leagues
  app.post("/api/import-players", requireAdmin, async (req, res) => {
    try {
      const { limit = 10 } = req.body;
      
      // Validate limit
      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum <= 0 || limitNum > 50) {
        return res.status(400).json({ 
          message: "Invalid limit. Please provide a number between 1 and 50" 
        });
      }
      
      // Start the import process
      console.log(`Starting import of ${limitNum} players from major leagues...`);
      
      // Run import in the background
      fetchPlayersFromMajorLeagues(limitNum)
        .then(() => console.log('Player import completed successfully'))
        .catch(err => console.error('Player import failed:', err));
      
      res.status(202).json({ 
        message: `Started importing up to ${limitNum} players from major leagues.` +
                 ` This process runs in the background and may take several minutes.` 
      });
    } catch (error) {
      console.error('Error in import-players endpoint:', error);
      res.status(500).json({ message: "Failed to start player import process" });
    }
  });
  
  // Update scores for all players
  app.post("/api/update-all-scores", requireAdmin, async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      
      // Start updating scores in the background
      const updatePromise = Promise.all(
        players.map(player => 
          updatePlayerInfluenceScores(player.id)
            .catch(err => console.error(`Failed to update scores for player ${player.id}:`, err))
        )
      );
      
      updatePromise
        .then(() => console.log('All player scores updated successfully'))
        .catch(err => console.error('Error updating player scores:', err));
      
      res.status(202).json({ 
        message: `Started updating scores for ${players.length} players. This process runs in the background.` 
      });
    } catch (error) {
      console.error('Error in update-all-scores endpoint:', error);
      res.status(500).json({ message: "Failed to start score update process" });
    }
  });
  
  // Update scores for a specific player
  app.post("/api/players/:id/update-scores", requireAdmin, async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ message: "Invalid player ID" });
      }
      
      // Check if player exists
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Update the player's scores
      await updatePlayerInfluenceScores(playerId);
      
      res.json({ message: `Scores updated for player ${player.name}` });
    } catch (error) {
      console.error(`Error updating scores for player ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update player scores" });
    }
  });
  
  // Settings API endpoints
  app.get("/api/settings/:key", requireAdmin, getSetting);
  app.put("/api/settings/:key", requireAdmin, updateSetting);
  app.get("/api/settings", requireAdmin, getAllSettings);
  
  // Local player database endpoints
  
  // Import players from local database
  app.post("/api/import-local-players", requireAdmin, async (req, res) => {
    try {
      console.log('Starting import from local player database...');
      
      // Run import in the background
      importAllPlayers()
        .then(result => console.log(`Successfully imported ${result.imported} new players from local database`))
        .catch(err => console.error('Error importing players from local database:', err));
      
      res.status(202).json({ 
        message: `Started importing players from local database. This process runs in the background and may take several minutes.`
      });
    } catch (error) {
      console.error('Error in import-local-players endpoint:', error);
      res.status(500).json({ message: "Failed to start player import process" });
    }
  });
  
  // Start automatic player updates
  app.post("/api/auto-updates/start", requireAdmin, async (req, res) => {
    try {
      // Get interval from request or use default (60 minutes)
      const { interval = 60 } = req.body;
      
      // Validate interval
      const intervalNum = parseInt(interval as string);
      if (isNaN(intervalNum) || intervalNum < 15) {
        return res.status(400).json({ 
          message: "Invalid interval. Please provide a number >= 15 (minutes)" 
        });
      }
      
      // Start automatic updates
      startAutomaticUpdates(intervalNum);
      
      res.json({ 
        message: `Started automatic player updates with interval of ${intervalNum} minutes.` 
      });
    } catch (error) {
      console.error('Error starting automatic updates:', error);
      res.status(500).json({ message: "Failed to start automatic updates" });
    }
  });
  
  // Stop automatic player updates
  app.post("/api/auto-updates/stop", requireAdmin, async (req, res) => {
    try {
      stopAutomaticUpdates();
      
      res.json({ 
        message: "Stopped automatic player updates." 
      });
    } catch (error) {
      console.error('Error stopping automatic updates:', error);
      res.status(500).json({ message: "Failed to stop automatic updates" });
    }
  });
  
  // Manually run a complete update now
  app.post("/api/auto-updates/run-now", requireAdmin, async (req, res) => {
    try {
      console.log('Starting manual update of all players...');
      
      // Run update in the background
      updateAllPlayersData()
        .then(result => console.log(`Manual update completed: ${result.updated}/${result.total} players updated`))
        .catch(err => console.error('Error in manual update:', err));
      
      res.status(202).json({ 
        message: `Started manual update of all players. This process runs in the background and may take several minutes.`
      });
    } catch (error) {
      console.error('Error in run-now endpoint:', error);
      res.status(500).json({ message: "Failed to start manual update" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
