import { db } from "../db";
import { players } from "@shared/schema";
import { sql } from "drizzle-orm";

async function removeSpecialCharactersFromSlugs() {
  console.log("Removing hyphens, periods, and underscores from all player slugs...");
  
  try {
    // Get all players
    const allPlayers = await db.select().from(players);
    console.log(`Found ${allPlayers.length} players to process`);
    
    let updatedCount = 0;
    
    // Process each player
    for (const player of allPlayers) {
      if (!player.slug) continue;
      
      // Remove hyphens, periods, and underscores
      const newSlug = player.slug
        .replace(/[-_.]/g, '');
      
      // Only update if there's a change
      if (newSlug !== player.slug) {
        await db.execute(
          sql`UPDATE players SET slug = ${newSlug} WHERE id = ${player.id}`
        );
        
        console.log(`Player ID ${player.id}: "${player.name}" slug changed from "${player.slug}" to "${newSlug}"`);
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} player slugs successfully!`);
  } catch (error) {
    console.error("Error fixing slugs:", error);
  }
}

removeSpecialCharactersFromSlugs()
  .then(() => {
    console.log("Slug clean-up process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });