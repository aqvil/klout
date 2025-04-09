import { storage } from "../storage";

/**
 * This script fixes slugs for players with problematic slug formats (dots, special chars, etc)
 */
async function fixPlayerSlugs() {
  try {
    console.log("Starting slug fix for all players...");
    
    // Get all players
    const players = await storage.getAllPlayers();
    console.log(`Found ${players.length} players to process`);
    
    let updatedCount = 0;
    
    // Process each player
    for (const player of players) {
      // Generate improved slug from name - handle dots, accents, special characters
      const slug = player.name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^\w\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
        
      // Update the player with the new slug if it's different than the current one
      if (player.slug !== slug) {
        console.log(`Fixing slug for ${player.name}: ${player.slug || 'null'} => ${slug}`);
        await storage.updatePlayer(player.id, { slug });
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} players with fixed slugs`);
    
    // Show some examples
    if (updatedCount > 0) {
      const fixedPlayers = await storage.getAllPlayers();
      console.log("Example players with fixed slugs:");
      fixedPlayers.slice(0, 10).forEach(p => {
        console.log(`- ${p.name}: ${p.slug}`);
      });
    }
    
    return { success: true, updated: updatedCount, total: players.length };
  } catch (error) {
    console.error("Error fixing slugs:", error);
    return { success: false, error };
  }
}

// Run the script directly when called from command line
if (import.meta.url.endsWith('/fix-player-slugs.ts')) {
  fixPlayerSlugs()
    .then(result => {
      console.log("Slug fix completed:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error("Unhandled error:", err);
      process.exit(1);
    });
}

export { fixPlayerSlugs };