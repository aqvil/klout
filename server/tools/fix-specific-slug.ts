import { db } from "../db";
import { players } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixSpecificSlug() {
  console.log("Fixing specific player slug...");
  
  try {
    // Find the player with problematic slug
    const [player] = await db.select()
      .from(players)
      .where(eq(players.name, "N. O'Reilly"));
    
    if (player) {
      console.log(`Found player: ${player.name}, current slug: ${player.slug}`);
      
      // Update to a clean slug without special characters
      const newSlug = "noreilly";
      
      await db.update(players)
        .set({ slug: newSlug })
        .where(eq(players.id, player.id));
      
      console.log(`Updated ${player.name}'s slug from "${player.slug}" to "${newSlug}"`);
    } else {
      console.log("Player not found");
    }
  } catch (error) {
    console.error("Error fixing specific slug:", error);
  }
}

fixSpecificSlug()
  .then(() => {
    console.log("Slug fix completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });