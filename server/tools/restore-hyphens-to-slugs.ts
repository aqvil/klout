import { db } from "../db";
import { players } from "@shared/schema";
import { sql } from "drizzle-orm";

async function formatSlugWithHyphens(name: string): Promise<string> {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, ''); // Remove special characters except hyphens
}

async function restoreHyphensToSlugs() {
  console.log("Restoring proper slugs with hyphens to all players...");
  
  try {
    // Get all players
    const allPlayers = await db.select().from(players);
    console.log(`Found ${allPlayers.length} players to process`);
    
    let updatedCount = 0;
    
    // Process each player
    for (const player of allPlayers) {
      // Format slug with hyphens between words
      const newSlug = await formatSlugWithHyphens(player.name);
      
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
    console.error("Error restoring slugs:", error);
  }
}

restoreHyphensToSlugs()
  .then(() => {
    console.log("Slug restoration process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });