import { db } from "../db";
import { players } from "@shared/schema";
import { eq } from "drizzle-orm";

async function createProperSlug(name: string): Promise<string> {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove special characters including .,'- etc.
    .replace(/\s+/g, '') // Remove spaces completely
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

async function fixAllSlugs() {
  console.log("Starting slug cleanup process...");
  
  try {
    // Get all players
    const allPlayers = await db.select().from(players);
    console.log(`Found ${allPlayers.length} players to process`);
    
    // Process each player
    for (const player of allPlayers) {
      const oldSlug = player.slug;
      const newSlug = await createProperSlug(player.name);
      
      // Update the player slug
      await db.update(players)
        .set({ slug: newSlug })
        .where(eq(players.id, player.id));
      
      console.log(`Player ID ${player.id}: "${player.name}" slug changed from "${oldSlug}" to "${newSlug}"`);
    }
    
    console.log("All player slugs have been cleaned up successfully!");
  } catch (error) {
    console.error("Error fixing slugs:", error);
  }
}

fixAllSlugs()
  .then(() => {
    console.log("Slug fix process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });