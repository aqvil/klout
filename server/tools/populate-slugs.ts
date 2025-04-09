import { storage } from "../storage";

async function populateSlugs() {
  try {
    console.log("Starting slug population for all players...");
    
    // Get all players
    const players = await storage.getAllPlayers();
    console.log(`Found ${players.length} players to process`);
    
    let updatedCount = 0;
    
    // Process each player
    for (const player of players) {
      // Only update players that don't have a slug or have an empty slug
      if (!player.slug) {
        // Generate slug from name
        const slug = player.name.toLowerCase().replace(/\s+/g, '-');
        console.log(`Generating slug for ${player.name}: ${slug}`);
        
        // Update the player with the new slug
        await storage.updatePlayer(player.id, { slug });
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} players with new slugs`);
    
    // Verify updates
    const updatedPlayers = await storage.getAllPlayers();
    const playersWithSlugs = updatedPlayers.filter(p => p.slug);
    console.log(`Players with slugs: ${playersWithSlugs.length}/${updatedPlayers.length}`);
    
    // Show some examples
    if (playersWithSlugs.length > 0) {
      console.log("Example players with slugs:");
      playersWithSlugs.slice(0, 5).forEach(p => {
        console.log(`- ${p.name}: ${p.slug}`);
      });
    }
    
    return { success: true, updated: updatedCount, total: players.length };
  } catch (error) {
    console.error("Error populating slugs:", error);
    return { success: false, error };
  }
}

// Self-execute for direct run via 'node' or 'tsx'
const isMainModule = import.meta.url.endsWith('/populate-slugs.ts');
if (isMainModule) {
  populateSlugs()
    .then(result => {
      console.log("Slug population completed:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error("Unhandled error:", err);
      process.exit(1);
    });
}

export { populateSlugs };