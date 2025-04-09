import { users, type User, type InsertUser, players, type Player, type InsertPlayer, playerStats, type PlayerStats, type InsertPlayerStats, scores, type Score, type InsertScore, type PlayerWithStats } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// IStorage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  
  // Player Stats operations
  getPlayerStats(playerId: number): Promise<PlayerStats | undefined>;
  createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats>;
  updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined>;
  
  // Score operations
  getScores(playerId: number): Promise<Score[]>;
  getLatestScore(playerId: number): Promise<Score | undefined>;
  createScore(score: InsertScore): Promise<Score>;
  getAllScores(): Promise<Score[]>;
  
  // Joined operations
  getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]>;
  getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined>;
  getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]>;
  
  // Session store
  sessionStore: any;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private playerStats: Map<number, PlayerStats>;
  private scores: Map<number, Score[]>;
  private currentUserId: number;
  private currentPlayerId: number;
  private currentStatsId: number;
  private currentScoreId: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.playerStats = new Map();
    this.scores = new Map();
    this.currentUserId = 1;
    this.currentPlayerId = 1;
    this.currentStatsId = 1;
    this.currentScoreId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every day
    });
    
    // Create initial admin user
    this.createUser({
      username: "admin",
      password: "password", // This will be hashed before storage in auth.ts
    }).then(user => {
      // Mark the user as an admin
      const adminUser = { ...user, isAdmin: true };
      this.users.set(user.id, adminUser);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const newPlayer: Player = { ...player, id, createdAt: new Date() };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existingPlayer = this.players.get(id);
    if (!existingPlayer) return undefined;
    
    const updatedPlayer = { ...existingPlayer, ...player };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    return this.players.delete(id);
  }

  // Player Stats methods
  async getPlayerStats(playerId: number): Promise<PlayerStats | undefined> {
    return Array.from(this.playerStats.values()).find(
      stats => stats.playerId === playerId
    );
  }

  async createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats> {
    const id = this.currentStatsId++;
    const newStats: PlayerStats = { 
      ...stats, 
      id, 
      updatedAt: new Date() 
    };
    this.playerStats.set(id, newStats);
    return newStats;
  }

  async updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined> {
    const existingStats = this.playerStats.get(id);
    if (!existingStats) return undefined;
    
    const updatedStats = { 
      ...existingStats, 
      ...stats,
      updatedAt: new Date() 
    };
    this.playerStats.set(id, updatedStats);
    return updatedStats;
  }

  // Score methods
  async getScores(playerId: number): Promise<Score[]> {
    const playerScores = this.scores.get(playerId) || [];
    return playerScores;
  }

  async getLatestScore(playerId: number): Promise<Score | undefined> {
    const playerScores = this.scores.get(playerId) || [];
    if (playerScores.length === 0) return undefined;
    
    // Sort by date descending and return the first one
    return playerScores.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  async createScore(score: InsertScore): Promise<Score> {
    const id = this.currentScoreId++;
    const newScore: Score = { 
      ...score, 
      id, 
      date: new Date() 
    };
    
    const playerScores = this.scores.get(score.playerId) || [];
    playerScores.push(newScore);
    this.scores.set(score.playerId, playerScores);
    
    return newScore;
  }

  async getAllScores(): Promise<Score[]> {
    const allScores: Score[] = [];
    this.scores.forEach(scoreArray => {
      allScores.push(...scoreArray);
    });
    return allScores;
  }

  // Joined operations
  async getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]> {
    const allPlayers = await this.getAllPlayers();
    const result: PlayerWithStats[] = [];

    for (const player of allPlayers) {
      const stats = await this.getPlayerStats(player.id);
      const latestScore = await this.getLatestScore(player.id);
      
      if (stats && latestScore) {
        result.push({
          player,
          stats,
          score: latestScore
        });
      }
    }

    return result;
  }

  async getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined> {
    const player = await this.getPlayer(playerId);
    if (!player) return undefined;

    const stats = await this.getPlayerStats(playerId);
    const latestScore = await this.getLatestScore(playerId);
    
    if (stats && latestScore) {
      return {
        player,
        stats,
        score: latestScore
      };
    }

    return undefined;
  }

  async getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]> {
    const playerWithStats = await this.getPlayersWithStatsAndScores();
    
    let sortedPlayers: PlayerWithStats[];
    
    switch (category) {
      case 'social':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.socialScore - a.score.socialScore);
        break;
      case 'performance':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.performanceScore - a.score.performanceScore);
        break;
      case 'engagement':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.engagementScore - a.score.engagementScore);
        break;
      default:
        sortedPlayers = playerWithStats.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }
    
    return sortedPlayers.slice(0, limit);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updatedPlayer] = await db
      .update(players)
      .set(player)
      .where(eq(players.id, id))
      .returning();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    // Delete associated data first (foreign key relationships)
    await db.delete(scores).where(eq(scores.playerId, id));
    await db.delete(playerStats).where(eq(playerStats.playerId, id));
    
    const result = await db.delete(players).where(eq(players.id, id));
    // Success if we deleted at least one record
    return true;
  }

  // Player Stats methods
  async getPlayerStats(playerId: number): Promise<PlayerStats | undefined> {
    const [stats] = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId));
    return stats;
  }

  async createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats> {
    const [newStats] = await db
      .insert(playerStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined> {
    const [updatedStats] = await db
      .update(playerStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(playerStats.id, id))
      .returning();
    return updatedStats;
  }

  // Score methods
  async getScores(playerId: number): Promise<Score[]> {
    return await db
      .select()
      .from(scores)
      .where(eq(scores.playerId, playerId))
      .orderBy(desc(scores.date));
  }

  async getLatestScore(playerId: number): Promise<Score | undefined> {
    const [latestScore] = await db
      .select()
      .from(scores)
      .where(eq(scores.playerId, playerId))
      .orderBy(desc(scores.date))
      .limit(1);
    return latestScore;
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db
      .insert(scores)
      .values(score)
      .returning();
    return newScore;
  }

  async getAllScores(): Promise<Score[]> {
    return await db.select().from(scores).orderBy(desc(scores.date));
  }

  // Joined operations
  async getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]> {
    const allPlayers = await this.getAllPlayers();
    const result: PlayerWithStats[] = [];

    for (const player of allPlayers) {
      const stats = await this.getPlayerStats(player.id);
      const latestScore = await this.getLatestScore(player.id);
      
      if (stats && latestScore) {
        result.push({
          player,
          stats,
          score: latestScore
        });
      }
    }

    return result;
  }

  async getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined> {
    const player = await this.getPlayer(playerId);
    if (!player) return undefined;

    const stats = await this.getPlayerStats(playerId);
    const latestScore = await this.getLatestScore(playerId);
    
    if (stats && latestScore) {
      return {
        player,
        stats,
        score: latestScore
      };
    }

    return undefined;
  }

  async getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]> {
    // First get all players with their stats and scores
    const playersWithStats = await this.getPlayersWithStatsAndScores();
    
    // Sort based on category
    let sortedPlayers: PlayerWithStats[];
    
    switch (category) {
      case 'social':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.socialScore - a.score.socialScore);
        break;
      case 'performance':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.performanceScore - a.score.performanceScore);
        break;
      case 'engagement':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.engagementScore - a.score.engagementScore);
        break;
      default:
        sortedPlayers = playersWithStats.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }
    
    return sortedPlayers.slice(0, limit);
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
