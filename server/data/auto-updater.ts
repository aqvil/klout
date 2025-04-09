import { storage } from '../storage';
import { scrapeSocialMediaStats } from '../scraper';
import { calculatePlayerScores } from '../api/football';

/**
 * This module provides automated updating of player data:
 * 1. Updates social media metrics for all players
 * 2. Recalculates influence scores based on new data
 */

// Function to update a single player's data
async function updatePlayerData(playerId: number) {
  try {
    console.log(`Updating data for player ID ${playerId}...`);
    
    // Get player details
    const player = await storage.getPlayer(playerId);
    if (!player) {
      console.log(`Player ID ${playerId} not found, skipping update`);
      return;
    }
    
    // Simulate social media metrics update (in a production environment, 
    // this would be replaced with real scraping from the player's profiles)
    try {
      const socialStats = await scrapeSocialMediaStats(player);
      
      // Get current player stats
      const currentStats = await storage.getPlayerStats(playerId);
      if (!currentStats) {
        console.log(`No stats found for player ID ${playerId}, skipping update`);
        return;
      }
      
      // Update the player stats with new social media metrics
      // We're using a small random variation to simulate real changes in followers/engagement
      const variationFactor = 1 + (Math.random() * 0.02); // 0-2% variation
      
      const updatedStats = await storage.updatePlayerStats(currentStats.id, {
        instagramFollowers: Math.floor(currentStats.instagramFollowers * variationFactor),
        twitterFollowers: Math.floor(currentStats.twitterFollowers * variationFactor),
        facebookFollowers: Math.floor(currentStats.facebookFollowers * variationFactor),
        fanEngagement: Math.min(1, currentStats.fanEngagement * (1 + (Math.random() * 0.01 - 0.005))), // +/- 0.5% variation
      });
      
      console.log(`Updated social media metrics for ${player.name}`);
      
      // Calculate and update player scores
      const scoreData = await calculatePlayerScores(playerId);
      await storage.createScore({
        playerId,
        ...scoreData
      });
      
      console.log(`Updated influence scores for ${player.name}`);
      
      return true;
    } catch (error) {
      console.error(`Error updating player ${player.name}:`, error);
      return false;
    }
  } catch (error) {
    console.error(`Error in updatePlayerData for ID ${playerId}:`, error);
    return false;
  }
}

// Function to update all players in the database
export async function updateAllPlayersData() {
  try {
    console.log('Starting automatic update of all players...');
    
    // Get all players
    const players = await storage.getAllPlayers();
    console.log(`Found ${players.length} players to update`);
    
    // Process each player with a small delay between each
    // to avoid overwhelming resources and simulate a natural update pattern
    let successCount = 0;
    for (const player of players) {
      const success = await updatePlayerData(player.id);
      if (success) successCount++;
      
      // Add a small delay between player updates
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`Automatic update completed. Updated ${successCount} of ${players.length} players successfully.`);
    return { updated: successCount, total: players.length };
  } catch (error) {
    console.error('Error in updateAllPlayersData:', error);
    throw error;
  }
}

// Schedule automatic updates
// In a production environment, this would be configured with a more sophisticated
// scheduling system, but for our purposes, this simple interval works
let updateIntervalId: NodeJS.Timeout;

export function startAutomaticUpdates(intervalMinutes = 60) {
  // Stop any existing interval
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
  }
  
  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`Starting automatic player updates every ${intervalMinutes} minutes`);
  
  // Run initial update
  updateAllPlayersData()
    .then(result => console.log(`Initial automatic update completed: ${result.updated}/${result.total} players updated`))
    .catch(err => console.error('Error in initial automatic update:', err));
  
  // Set up recurring updates
  updateIntervalId = setInterval(() => {
    updateAllPlayersData()
      .then(result => console.log(`Scheduled automatic update completed: ${result.updated}/${result.total} players updated`))
      .catch(err => console.error('Error in scheduled automatic update:', err));
  }, intervalMs);
  
  return updateIntervalId;
}

export function stopAutomaticUpdates() {
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
    console.log('Automatic player updates stopped');
  }
}