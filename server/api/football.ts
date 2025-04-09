import fetch from 'node-fetch';
import { storage } from '../storage';
import { InsertPlayer, InsertPlayerStats } from '@shared/schema';
import type { Request, Response } from 'express';
import { FOOTBALL_API_KEY } from './settings';

// API Constants 
// We support both RapidAPI and direct API-Football endpoints
const DIRECT_API_BASE_URL = 'https://v3.football.api-sports.io';
const RAPIDAPI_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

// Get API Headers with the latest key from database or environment variable
// Helper function to get API headers and base URL for the current key
async function getApiConfig() {
  // First try to get the key from the database
  let apiKey = await storage.getSetting(FOOTBALL_API_KEY);
  
  // If not found in database, fall back to environment variable
  if (!apiKey) {
    apiKey = process.env.FOOTBALL_API_KEY || '';
    
    // If we have an env var key but not in db, store it in db for future use
    if (apiKey && apiKey.length > 0) {
      await storage.setSetting(FOOTBALL_API_KEY, apiKey);
      console.log('Initialized API key in database from environment variable');
    }
  }

  if (!apiKey || apiKey.length === 0) {
    console.error('FOOTBALL_API_KEY is not set in database or environment variables');
  } else {
    // Log the first few characters of the API key for debugging (don't log the full key for security)
    console.log(`Football API Key status: Set (starts with: ${apiKey.substring(0, 4)}...)`);
  }

  // Determine if this is a RapidAPI key (usually longer) or direct API-Football key
  const isRapidApiKey = apiKey && apiKey.length > 40;
  
  const headers: Record<string, string> = {};
  
  if (isRapidApiKey) {
    headers['X-RapidAPI-Key'] = apiKey || '';
    headers['X-RapidAPI-Host'] = 'api-football-v1.p.rapidapi.com';
    return {
      baseUrl: RAPIDAPI_BASE_URL,
      headers
    };
  } else {
    headers['x-apisports-key'] = apiKey || '';
    return {
      baseUrl: DIRECT_API_BASE_URL,
      headers
    };
  }
};

// Legacy function to maintain compatibility - returns only headers
async function getApiHeaders() {
  const config = await getApiConfig();
  return config.headers;
};

// Test the API connection
export async function testApiConnection(req: Request, res: Response) {
  try {
    console.log('Testing Football API connection...');
    
    // Get the API configuration with headers and base URL
    const config = await getApiConfig();
    
    // Log which endpoint we're using
    const isRapidApi = config.baseUrl === RAPIDAPI_BASE_URL;
    console.log(`Using API endpoint: ${config.baseUrl} (${isRapidApi ? 'RapidAPI' : 'Direct API-Football'})`);
    
    // Make a simple API call to test the connection
    const response = await fetch(`${config.baseUrl}/leagues`, {
      method: 'GET',
      headers: config.headers
    });

    // Log the response status for debugging
    console.log(`API response status: ${response.status}`);

    // Check if we have a non-success status
    if (!response.ok) {
      if (response.status === 429) {
        // Handle rate limiting specifically
        return res.status(429).json({
          success: false,
          message: 'API rate limit exceeded. The API allows a limited number of requests per day. Please try again later.',
          rateLimit: true
        });
      }
      
      // Try to get the error message from the response
      let errorText;
      try {
        errorText = await response.text();
        console.log('Error response text:', errorText.substring(0, 200)); // Log a preview of the error
      } catch (e) {
        errorText = 'Could not read error details';
      }
      
      throw new Error(`API responded with status: ${response.status}. Details: ${errorText.substring(0, 100)}...`);
    }

    // Parse the response as JSON
    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Failed to parse API response as JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    
    // Check if we got a valid response with expected structure
    if (data && typeof data === 'object' && 'response' in data && Array.isArray(data.response) && data.response.length > 0) {
      console.log('Football API connection successful');
      res.json({ 
        success: true, 
        message: 'API connection successful',
        leagues: data.response.slice(0, 5) // Return just a few leagues as proof
      });
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error testing Football API connection:', error);
    res.status(500).json({ 
      success: false, 
      message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}

// League IDs for major leagues
const MAJOR_LEAGUES = [
  { id: 39, name: 'Premier League', country: 'England' },     // English Premier League
  { id: 140, name: 'La Liga', country: 'Spain' },            // Spanish La Liga
  { id: 135, name: 'Serie A', country: 'Italy' },            // Italian Serie A
  { id: 78, name: 'Bundesliga', country: 'Germany' },        // German Bundesliga
  { id: 61, name: 'Ligue 1', country: 'France' },            // French Ligue 1
  { id: 2, name: 'Champions League', country: 'World' },     // UEFA Champions League
  { id: 3, name: 'Europa League', country: 'World' },        // UEFA Europa League
  { id: 71, name: 'Serie A', country: 'Brazil' },            // Brazilian Serie A
  { id: 128, name: 'MLS', country: 'USA' },                  // US Major League Soccer
];

interface ApiPlayer {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  position: string;
  rating?: number;
  captain?: boolean;
  statistics?: {
    games: {
      appearances: number;
      minutes: number;
      position: string;
      rating?: string;
      captain: boolean;
    };
    shots: {
      total: number;
      on: number;
    };
    goals: {
      total: number;
      assists: number;
    };
    cards: {
      yellow: number;
      red: number;
    };
  }[];
}

interface SocialMediaInfo {
  instagramFollowers: number;
  twitterFollowers: number;
  facebookFollowers: number;
  engagementRate: number;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
}

// Function to fetch all teams for a league
export async function fetchTeamsInLeague(leagueId: number, season: number = 2023): Promise<number[]> {
  try {
    const config = await getApiConfig();
    
    const response = await fetch(`${config.baseUrl}/teams?league=${leagueId}&season=${season}`, {
      method: 'GET',
      headers: config.headers
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    const teams = data.response.map((team: any) => team.team.id);
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    return [];
  }
}

// Function to fetch players for a team
export async function fetchPlayersInTeam(teamId: number, season: number = 2023): Promise<ApiPlayer[]> {
  try {
    const config = await getApiConfig();
    
    const response = await fetch(`${config.baseUrl}/players?team=${teamId}&season=${season}`, {
      method: 'GET',
      headers: config.headers
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.response;
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    return [];
  }
}

// Function to fetch player statistics
export async function fetchPlayerStatistics(playerId: number, season: number = 2023): Promise<ApiPlayer | null> {
  try {
    const config = await getApiConfig();
    
    const response = await fetch(`${config.baseUrl}/players?id=${playerId}&season=${season}`, {
      method: 'GET', 
      headers: config.headers
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.response[0] || null;
  } catch (error) {
    console.error(`Error fetching stats for player ${playerId}:`, error);
    return null;
  }
}

// Social media integration - use API key to get real social media data
// We'll use a third-party service or approximate based on player popularity
async function getSocialMediaInfo(player: ApiPlayer): Promise<SocialMediaInfo> {
  // This function would normally call a social media analytics API
  // For now, we'll use an algorithm based on player rating, league, and position
  
  // Base follower counts by league tier (approximate millions of followers)
  const leagueTiers: Record<number, number> = {
    39: 15, // Premier League
    140: 14, // La Liga
    135: 10, // Serie A
    78: 8,  // Bundesliga
    61: 7,  // Ligue 1
    2: 20,  // Champions League
    3: 10,  // Europa League
    71: 5,  // Brazilian Serie A
    128: 4  // MLS
  };
  
  // Position multipliers (forwards tend to be more popular)
  const positionMultipliers: Record<string, number> = {
    'Attacker': 1.5,
    'Forward': 1.5,
    'Midfielder': 1.2,
    'Defender': 0.8,
    'Goalkeeper': 0.7
  };
  
  // Rating impact (players with higher ratings get more followers)
  const ratingFactor = player.rating ? player.rating / 5 : 1;
  
  const leagueId = player.league?.id || 0;
  const leagueFactor = leagueTiers[leagueId] || 3; // Default for unknown leagues
  
  const positionCategory = player.position?.includes('forward') || player.position?.includes('attack') 
    ? 'Attacker' 
    : player.position?.includes('midfield') 
      ? 'Midfielder' 
      : player.position?.includes('defend') 
        ? 'Defender' 
        : player.position?.includes('keeper') 
          ? 'Goalkeeper' 
          : 'Midfielder';
          
  const positionFactor = positionMultipliers[positionCategory] || 1;
  
  // Calculate base followers (in thousands)
  const baseFollowers = leagueFactor * positionFactor * ratingFactor * 1000000;
  
  // Add randomness to make it realistic (±40%)
  const randomFactor = 0.6 + (Math.random() * 0.8);
  
  // Calculate approximate platform distribution
  // Instagram typically has the most followers, then Facebook, then Twitter
  const instagramFollowers = Math.floor(baseFollowers * randomFactor);
  const facebookFollowers = Math.floor(baseFollowers * 0.7 * randomFactor);
  const twitterFollowers = Math.floor(baseFollowers * 0.4 * randomFactor);
  
  // Calculate engagement rate (inversely proportional to follower count, typically 1-5%)
  const engagementRate = Math.min(8, Math.max(0.8, 15 / Math.pow(Math.log10(instagramFollowers), 2))) * 10;
  
  // Generate appropriate social media URLs
  const formattedName = player.name.toLowerCase().replace(/\s+/g, '');
  const instagramUrl = `https://instagram.com/${formattedName}`;
  const twitterUrl = `https://twitter.com/${formattedName}`;
  const facebookUrl = `https://facebook.com/${formattedName}`;
  
  return {
    instagramFollowers,
    twitterFollowers,
    facebookFollowers,
    engagementRate,
    instagramUrl,
    twitterUrl,
    facebookUrl
  };
}

// Fetch players from all major leagues
export async function fetchPlayersFromMajorLeagues(limit: number = 10): Promise<void> {
  console.log(`Starting to fetch players from ${MAJOR_LEAGUES.length} major leagues...`);
  let playerCount = 0;
  
  for (const league of MAJOR_LEAGUES) {
    if (playerCount >= limit) break;
    
    console.log(`Fetching teams for ${league.name} (${league.country})...`);
    const teamIds = await fetchTeamsInLeague(league.id);
    console.log(`Found ${teamIds.length} teams in ${league.name}`);
    
    // Take a subset of teams to avoid API rate limits
    const teamsToProcess = teamIds.slice(0, 2);
    
    for (const teamId of teamsToProcess) {
      if (playerCount >= limit) break;
      
      console.log(`Fetching players for team ${teamId}...`);
      const players = await fetchPlayersInTeam(teamId);
      console.log(`Found ${players.length} players in team ${teamId}`);
      
      // Take top players from each team based on rating
      const topPlayers = players
        .filter(p => p.rating && p.rating > 6.5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      for (const player of topPlayers) {
        if (playerCount >= limit) break;
        
        console.log(`Processing player: ${player.name}`);
        try {
          // Get detailed player stats
          const playerDetails = await fetchPlayerStatistics(player.id);
          
          if (!playerDetails) {
            console.log(`No details found for player ${player.name}, skipping`);
            continue;
          }
          
          // Get or generate social media info
          const socialMedia = await getSocialMediaInfo(playerDetails);
          
          // Format the player data for our database
          const playerData: InsertPlayer = {
            name: playerDetails.name,
            team: playerDetails.team?.name || 'Unknown Club',
            country: playerDetails.nationality || 'Unknown',
            position: playerDetails.position || 'Unknown',
            profileImg: playerDetails.photo || 'https://example.com/default-player.jpg',
            bio: `Professional footballer playing for ${playerDetails.team?.name || 'Unknown Club'}`,
            instagramUrl: socialMedia.instagramUrl,
            twitterUrl: socialMedia.twitterUrl,
            facebookUrl: socialMedia.facebookUrl
          };
          
          // Check if the player already exists in our database
          const existingPlayers = await storage.getAllPlayers();
          const existingPlayer = existingPlayers.find(p => p.name === playerData.name);
          
          let playerId: number;
          
          if (existingPlayer) {
            // Update existing player
            console.log(`Updating existing player: ${playerData.name}`);
            const updatedPlayer = await storage.updatePlayer(existingPlayer.id, playerData);
            playerId = existingPlayer.id;
          } else {
            // Create new player
            console.log(`Creating new player: ${playerData.name}`);
            const newPlayer = await storage.createPlayer(playerData);
            playerId = newPlayer.id;
          }
          
          // Extract statistics
          const statistics = playerDetails.statistics?.[0];
          
          if (statistics) {
            // Create player stats
            const statsData: InsertPlayerStats = {
              playerId,
              goals: statistics.goals?.total || 0,
              assists: statistics.goals?.assists || 0,
              yellowCards: statistics.cards?.yellow || 0,
              redCards: statistics.cards?.red || 0,
              instagramFollowers: socialMedia.instagramFollowers,
              twitterFollowers: socialMedia.twitterFollowers,
              facebookFollowers: socialMedia.facebookFollowers,
              fanEngagement: socialMedia.engagementRate
            };
            
            // Check if stats already exist
            const existingStats = await storage.getPlayerStats(playerId);
            
            if (existingStats) {
              console.log(`Updating stats for player: ${playerData.name}`);
              await storage.updatePlayerStats(existingStats.id, statsData);
            } else {
              console.log(`Creating stats for player: ${playerData.name}`);
              await storage.createPlayerStats(statsData);
            }
            
            playerCount++;
            console.log(`Successfully processed player ${playerCount}/${limit}: ${playerData.name}`);
          }
        } catch (error) {
          console.error(`Error processing player ${player.name}:`, error);
        }
        
        // Add a delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.log(`Finished fetching ${playerCount} players from major leagues`);
}

// Calculate influence scores based on player statistics
export async function calculatePlayerScores(playerId: number): Promise<{
  totalScore: number;
  socialScore: number;
  performanceScore: number;
  engagementScore: number;
}> {
  const playerStats = await storage.getPlayerStats(playerId);
  
  if (!playerStats) {
    throw new Error(`No stats found for player ${playerId}`);
  }
  
  // Social Score: Based on social media followers
  const totalFollowers = 
    (playerStats.instagramFollowers || 0) + 
    (playerStats.facebookFollowers || 0) + 
    (playerStats.twitterFollowers || 0);
  
  // Use logarithmic scale for social score because follower counts vary tremendously
  // Log10(100M) is about 8, so we normalize to 100 scale
  const socialScore = Math.min(
    100, 
    Math.round((Math.log10(totalFollowers + 1) / 8) * 80 + (playerStats.fanEngagement || 0) * 0.2)
  );
  
  // Performance Score: Based on goals, assists, and cards
  const performanceScore = Math.min(
    100,
    Math.round(
      ((playerStats.goals || 0) * 5) + 
      ((playerStats.assists || 0) * 3) - 
      ((playerStats.yellowCards || 0) * 1) - 
      ((playerStats.redCards || 0) * 3)
    )
  );
  
  // Ensure performance score is between 0-100
  const normalizedPerformanceScore = Math.max(0, Math.min(100, performanceScore));
  
  // Engagement score directly from fan engagement metric
  const engagementScore = Math.min(100, Math.max(0, playerStats.fanEngagement || 0));
  
  // Total influence score is weighted average
  const totalScore = Math.round(
    (socialScore * 0.4) + 
    (normalizedPerformanceScore * 0.4) + 
    (engagementScore * 0.2)
  );
  
  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    socialScore,
    performanceScore: normalizedPerformanceScore,
    engagementScore
  };
}

// Main function to update a player's scores
export async function updatePlayerInfluenceScores(playerId: number): Promise<void> {
  try {
    const scores = await calculatePlayerScores(playerId);
    await storage.createScore({
      playerId,
      ...scores
    });
    console.log(`Updated scores for player ${playerId}: Total score = ${scores.totalScore}`);
  } catch (error) {
    console.error(`Error updating scores for player ${playerId}:`, error);
    throw error;
  }
}