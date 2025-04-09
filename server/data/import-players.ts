import { db } from '../db';
import { storage } from '../storage';
import { playerDatabase } from './player-database';
import { scores } from '@shared/schema';

// Helper function to calculate influence scores (copied from routes.ts for consistency)
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
  const engagementScore = Math.round(stats.fanEngagement * 100);
  
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

// Function to import all players from our database
export async function importAllPlayers() {
  try {
    console.log('Starting import of players from local database...');
    
    let importedCount = 0;
    const existingPlayers = await storage.getAllPlayers();
    
    // Process each player in our database
    for (const data of playerDatabase) {
      try {
        // Check if player already exists
        const existingPlayer = existingPlayers.find(p => p.name === data.player.name);
        
        if (existingPlayer) {
          console.log(`Player ${data.player.name} already exists, updating information`);
          
          // Update player info
          const updatedPlayer = await storage.updatePlayer(existingPlayer.id, data.player);
          
          // Update player stats
          const playerStats = await storage.getPlayerStats(existingPlayer.id);
          if (playerStats) {
            data.stats.playerId = existingPlayer.id;
            await storage.updatePlayerStats(playerStats.id, data.stats);
          } else {
            data.stats.playerId = existingPlayer.id;
            await storage.createPlayerStats(data.stats);
          }
          
          // Calculate and add new score
          const scoreData = calculateScores(data.stats);
          await storage.createScore({
            playerId: existingPlayer.id,
            ...scoreData
          });
        } else {
          // Create new player
          const newPlayer = await storage.createPlayer(data.player);
          console.log(`Created new player: ${newPlayer.name} (ID: ${newPlayer.id})`);
          
          // Create player stats
          data.stats.playerId = newPlayer.id;
          const stats = await storage.createPlayerStats(data.stats);
          
          // Calculate and add score
          const scoreData = calculateScores(data.stats);
          await storage.createScore({
            playerId: newPlayer.id,
            ...scoreData
          });
          
          importedCount++;
        }
      } catch (playerError) {
        console.error(`Error processing player ${data.player.name}:`, playerError);
      }
    }
    
    console.log(`Successfully imported ${importedCount} new players from local database`);
    return { imported: importedCount, total: playerDatabase.length };
  } catch (error) {
    console.error('Error importing players:', error);
    throw error;
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importAllPlayers()
    .then(result => {
      console.log(`Import completed: ${result.imported} new players added out of ${result.total} total`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}