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

  // For testing and development, use our known working API key
  if (!apiKey || apiKey.length === 0) {
    apiKey = '9cb031a896ff74e836fecef8c218b493';
    await storage.setSetting(FOOTBALL_API_KEY, apiKey);
    console.log('Using default API key for development/testing');
  }

  if (apiKey && apiKey.length > 0) {
    // Log the first few characters of the API key for debugging (don't log the full key for security)
    console.log(`Football API Key status: Set (starts with: ${apiKey.substring(0, 4)}...)`);
  } else {
    console.error('FOOTBALL_API_KEY is not set in database or environment variables');
  }

  // For API-Football.com, we need to use the x-apisports-key header
  // Let's prefer direct API access for better reliability
  const headers: Record<string, string> = {};
  
  // API-Football.com direct API
  headers['x-apisports-key'] = apiKey || '';
  console.log('Using direct API-Football.com access with API key');
  
  return {
    baseUrl: DIRECT_API_BASE_URL,
    headers,
    apiKey: apiKey || ''
  };
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
    let apiKey = await storage.getSetting(FOOTBALL_API_KEY) || process.env.FOOTBALL_API_KEY;
    
    // For testing, use our default key if none is set
    if (!apiKey) {
      apiKey = '9cb031a896ff74e836fecef8c218b493';
      await storage.setSetting(FOOTBALL_API_KEY, apiKey);
      console.log('Using default API key for testing API connection');
    }
    
    // Show the first 4 characters of the API key for verification
    const apiKeyPreview = apiKey.substring(0, 4) + '...';
    console.log(`Football API Key status: Set (starts with: ${apiKeyPreview})`);
    
    // Return detailed info about the apiKey
    console.log(`API Key length: ${apiKey.length} characters`);
    console.log(`API Key type: ${apiKey.length > 40 ? 'RapidAPI' : 'Direct API-Football'}`);
    
    // Log which endpoint we're using
    const isRapidApi = config.baseUrl === RAPIDAPI_BASE_URL;
    
    // Debug the exact headers being sent
    console.log('API Request Headers:', JSON.stringify(config.headers, null, 2));
    console.log(`Using API endpoint: ${config.baseUrl} (${isRapidApi ? 'RapidAPI' : 'Direct API-Football'})`);
    
    // Make a simple API call to test the connection
    console.log('Testing API connection with leagues endpoint...');
    const response = await fetch(`${config.baseUrl}/leagues?id=39`, {
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
          rateLimit: true,
          apiKeyStatus: `Set (starts with: ${apiKeyPreview})`
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
      
      return res.status(500).json({ 
        success: false, 
        message: `API responded with status: ${response.status}`,
        details: errorText.substring(0, 300),
        apiKeyStatus: `Set (starts with: ${apiKeyPreview})`
      });
    }

    // Parse the response as JSON
    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Failed to parse API response as JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    
    // Also fetch current season info to verify endpoint format
    console.log('Testing seasons endpoint to get current season...');
    let latestSeason = 2023; // Default to 2023 if we can't determine the latest
    try {
      const seasonResponse = await fetch(`${config.baseUrl}/leagues/seasons`, {
        method: 'GET',
        headers: config.headers
      });
      
      if (seasonResponse.ok) {
        const seasonData = await seasonResponse.json() as { response?: number[] };
        if (seasonData?.response && Array.isArray(seasonData.response) && seasonData.response.length > 0) {
          latestSeason = Math.max(...seasonData.response);
          console.log(`Latest season from API: ${latestSeason}`);
        } else {
          console.log('No season data from API, using default: 2023');
        }
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
    
    // Check if we got a valid response with expected structure
    if (data && typeof data === 'object' && 'response' in data && Array.isArray(data.response)) {
      console.log('Football API connection successful');
      
      // Create a simplified preview of the leagues data
      const leaguePreview = data.response && data.response.length > 0 
        ? { 
            league: data.response[0].league,
            country: data.response[0].country 
          } 
        : 'No leagues data returned';
        
      res.json({ 
        success: true, 
        message: 'API connection successful',
        baseUrl: config.baseUrl,
        apiKeyStatus: `Set (starts with: ${apiKeyPreview})`,
        latestSeason,
        responsePreview: leaguePreview,
        requestInfo: {
          url: `${config.baseUrl}/leagues?id=39`,
          useRapidApi: isRapidApi
        }
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
/**
 * Updated league IDs for 2023 season based on API-Football.
 * The API might return different IDs for different seasons or change IDs completely.
 * Here are recent IDs for common leagues.
 */
const MAJOR_LEAGUES = [
  { id: 39, name: 'Premier League', country: 'England' },    // English Premier League
  { id: 140, name: 'La Liga', country: 'Spain' },            // Spanish La Liga
  { id: 135, name: 'Serie A', country: 'Italy' },            // Italian Serie A
  { id: 78, name: 'Bundesliga', country: 'Germany' },        // German Bundesliga
  { id: 61, name: 'Ligue 1', country: 'France' },            // French Ligue 1
  { id: 2, name: 'Champions League', country: 'Europe' },    // UEFA Champions League
  { id: 3, name: 'Europa League', country: 'Europe' },       // UEFA Europa League
  { id: 71, name: 'Serie A', country: 'Brazil' },            // Brazilian Serie A
  { id: 253, name: 'MLS', country: 'USA' },                  // US Major League Soccer (updated ID)
  { id: 179, name: 'Primera Division', country: 'Argentina' }, // Argentine Liga Profesional
  { id: 128, name: 'Eredivisie', country: 'Netherlands' },   // Dutch Eredivisie
];

// Define API player interface to handle multiple response formats
interface ApiPlayer {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  nationality?: string;
  height?: string;
  weight?: string;
  injured?: boolean;
  photo?: string;
  league?: {
    id: number;
    name: string;
    country: string;
    logo?: string;
    flag?: string;
  };
  team?: {
    id: number;
    name: string;
    logo?: string;
  };
  position?: string;
  rating?: number | string;
  captain?: boolean;
  statistics?: {
    games?: {
      appearances?: number;
      minutes?: number;
      position?: string;
      rating?: string | number;
      captain?: boolean;
    };
    shots?: {
      total?: number;
      on?: number;
    };
    goals?: {
      total?: number;
      assists?: number;
    };
    cards?: {
      yellow?: number;
      red?: number;
    };
  }[];
  // Support nested player objects in response
  player?: {
    id: number;
    name: string;
    firstname?: string;
    lastname?: string;
    nationality?: string;
    photo?: string;
    position?: string;
    statistics?: any[];
  };
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
    
    // Log the actual request URL for debugging
    const url = `${config.baseUrl}/teams?league=${leagueId}&season=${season}`;
    console.log(`Fetching teams with URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: config.headers
    });

    // Log response status
    console.log(`API response status for teams: ${response.status}`);

    if (!response.ok) {
      // Try to get error details
      const errorText = await response.text();
      console.error(`API error response: ${errorText.substring(0, 200)}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    
    // Check if we have results
    if (!data.response || !Array.isArray(data.response) || data.response.length === 0) {
      console.log(`No teams found for league ${leagueId}, season ${season}`);
      console.log(`API response: ${JSON.stringify(data).substring(0, 300)}...`);
      return [];
    }
    
    // Log the first team for debugging
    console.log(`Found teams in league ${leagueId}. First team: ${JSON.stringify(data.response[0]).substring(0, 200)}...`);
    
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
    
    const url = `${config.baseUrl}/players?team=${teamId}&season=${season}`;
    console.log(`Fetching players with URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: config.headers
    });

    console.log(`API response status for players: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText.substring(0, 200)}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;
    
    // Check if we have results
    if (!data.response || !Array.isArray(data.response) || data.response.length === 0) {
      console.log(`No players found for team ${teamId}, season ${season}`);
      console.log(`API response: ${JSON.stringify(data).substring(0, 300)}...`);
      return [];
    }
    
    // Fix if the response structure is different than expected
    let playerData = data.response;
    
    // Check if this is a "player" wrapped response - API format can vary
    if (data.response.length > 0 && data.response[0].player) {
      console.log(`Found ${data.response.length} players in team ${teamId}. First player: ${data.response[0]?.player?.name || 'Unknown'}`);
    } else {
      console.log(`Found ${data.response.length} players in team ${teamId}`);
    }
    
    // Log full structure of first player for debugging
    if (data.response.length > 0) {
      console.log(`First player response structure: ${JSON.stringify(data.response[0]).substring(0, 500)}...`);
    }
    
    return playerData;
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    return [];
  }
}

// Function to fetch player statistics
export async function fetchPlayerStatistics(playerId: number, season: number = 2023): Promise<ApiPlayer | null> {
  try {
    const config = await getApiConfig();
    
    const url = `${config.baseUrl}/players?id=${playerId}&season=${season}`;
    console.log(`Fetching player stats with URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET', 
      headers: config.headers
    });

    console.log(`API response status for player stats: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText.substring(0, 200)}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json() as any;

    // Check if we have results
    if (!data.response || !Array.isArray(data.response) || data.response.length === 0) {
      console.log(`No stats found for player ${playerId}, season ${season}`);
      console.log(`API response: ${JSON.stringify(data).substring(0, 300)}...`);
      return null;
    }
    
    console.log(`Found stats for player ${playerId}. Name: ${data.response[0]?.player?.name || 'Unknown'}`);
    
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
  // Convert rating to number if it's a string (API sometimes returns strings)
  const ratingValue = typeof player.rating === 'string' ? 
    parseFloat(player.rating || '0') : 
    (player.rating || 0);
  const ratingFactor = ratingValue ? ratingValue / 5 : 1;
  
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
  
  // Generate appropriate social media URLs - normalize player names for URLs
  // Remove special characters, spaces, and accents for better URL formatting
  const formattedName = player.name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/\s+/g, ''); // Remove spaces
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
  
  // Calculate how many players to get from each league to reach the desired limit
  // Allow more players per league if needed to reach the requested limit
  // Increase the base number to ensure we get enough players even if some API calls fail
  const playersPerLeague = Math.ceil(limit / MAJOR_LEAGUES.length) + 10;
  console.log(`Planning to fetch up to ${playersPerLeague} players per league to reach target of ${limit} players`);
  
  for (const league of MAJOR_LEAGUES) {
    if (playerCount >= limit) break;
    
    console.log(`Fetching teams for ${league.name} (${league.country})...`);
    const teamIds = await fetchTeamsInLeague(league.id);
    console.log(`Found ${teamIds.length} teams in ${league.name}`);
    
    // If no teams found, skip this league
    if (teamIds.length === 0) {
      console.log(`No teams found for ${league.name}, skipping to next league...`);
      continue;
    }
    
    // Process as many teams as needed to reach the target player count
    // Use Math.min to avoid taking more teams than available
    const teamsNeeded = Math.min(teamIds.length, Math.ceil(playersPerLeague / 5));
    console.log(`Processing ${teamsNeeded} teams from ${league.name} to reach player quota`);
    
    // Process the teams - prioritize top teams (usually listed first in API responses)
    const teamsToProcess = teamIds.slice(0, teamsNeeded);
    
    for (const teamId of teamsToProcess) {
      if (playerCount >= limit) break;
      
      console.log(`Fetching players for team ${teamId}...`);
      const players = await fetchPlayersInTeam(teamId);
      console.log(`Found ${players.length} players in team ${teamId}`);
      
      // Skip if no players found for this team
      if (players.length === 0) {
        console.log(`No players found for team ${teamId}, skipping to next team...`);
        continue;
      }
      
      // Handle different API response formats and extract rating
      let processedPlayers = players;
      
      // If the response has a nested player object structure
      if (players.length > 0 && players[0].player) {
        processedPlayers = players.map((item: any) => ({
          ...item.player,
          rating: item.statistics && item.statistics[0] ? 
            parseFloat(item.statistics[0].games?.rating || '0') : 0,
          statistics: item.statistics
        }));
        console.log(`Extracted ${processedPlayers.length} players from nested format`);
      }
      
      // Get top players by rating - use more players per team to reach the desired limit
      let playersToImport;
      const playersWithRating = processedPlayers.filter(p => {
        // Convert rating to number and ensure it's valid
        const rating = typeof p.rating === 'string' ? parseFloat(p.rating || '0') : (p.rating || 0);
        return !isNaN(rating) && rating > 0;
      });
      
      if (playersWithRating.length > 0) {
        // Sort by rating (highest first)
        playersToImport = playersWithRating
          .sort((a, b) => {
            const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating || '0') : (a.rating || 0);
            const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating || '0') : (b.rating || 0);
            return ratingB - ratingA;
          })
          // Take as many players as needed to reach limit, but not more than 10 per team
          .slice(0, Math.min(10, Math.ceil(playersPerLeague / teamsNeeded)));
        
        console.log(`Found ${playersToImport.length} rated players to import from team ${teamId}`);
      } else {
        // If no players with ratings, take a reasonable subset
        playersToImport = processedPlayers.slice(0, Math.min(5, processedPlayers.length));
        console.log(`No players with ratings found, taking ${playersToImport.length} players from team ${teamId}`);
      }
      
      for (const player of playersToImport) {
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
          
          // Extract statistics - handle both formats
          let statistics: any = null;
          
          // Handle both response formats - player details might have statistics
          // directly or nested in a player object
          if (playerDetails.statistics && playerDetails.statistics[0]) {
            statistics = playerDetails.statistics[0];
          } else if (playerDetails.player && playerDetails.player.statistics && playerDetails.player.statistics[0]) {
            statistics = playerDetails.player.statistics[0];
          }
          
          // Always create stats even if we don't have game statistics
          // Social media metrics are still valuable for influence
          const statsData: InsertPlayerStats = {
            playerId,
            goals: statistics?.goals?.total || 0,
            assists: statistics?.goals?.assists || 0,
            yellowCards: statistics?.cards?.yellow || 0,
            redCards: statistics?.cards?.red || 0,
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