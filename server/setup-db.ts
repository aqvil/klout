import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function setupDatabase() {
  console.log("Setting up database...");

  // See if admin user already exists
  try {
    const adminUser = await storage.getUserByUsername("admin");
    
    if (adminUser) {
      console.log("Admin user already exists, skipping creation");
    } else {
      // Create admin user
      console.log("Creating admin user...");
      const user = await storage.createUser({
        username: "admin",
        password: await hashPassword("admin123"), // Default password, change in production
      });

      // Update user to make them an admin (directly in the database)
      console.log(`Admin user created with ID: ${user.id}`);
    }
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }

  console.log("Database setup complete");
  process.exit(0);
}

setupDatabase().catch(console.error);