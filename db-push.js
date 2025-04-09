import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema.js';

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient, { schema });

async function main() {
  console.log('Pushing schema to database...');
  
  try {
    // This will automatically create the tables and schema without prompts
    const result = await db.execute(`
      -- Drop tables if they exist in reverse order of dependencies
      DROP TABLE IF EXISTS player_ratings CASCADE;
      DROP TABLE IF EXISTS player_comments CASCADE;
      DROP TABLE IF EXISTS player_follows CASCADE;
      DROP TABLE IF EXISTS user_profiles CASCADE;
      DROP TABLE IF EXISTS scores CASCADE;
      DROP TABLE IF EXISTS player_stats CASCADE;
      DROP TABLE IF EXISTS players CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS settings CASCADE;
      
      -- Create tables in order of dependencies
      
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Players table
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        team VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL DEFAULT '',
        "profileImg" VARCHAR(255),
        "instagramUrl" VARCHAR(255),
        "twitterUrl" VARCHAR(255),
        "facebookUrl" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Player Stats table
      CREATE TABLE IF NOT EXISTS player_stats (
        id SERIAL PRIMARY KEY,
        "playerId" INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        goals INTEGER NOT NULL DEFAULT 0,
        assists INTEGER NOT NULL DEFAULT 0,
        "yellowCards" INTEGER NOT NULL DEFAULT 0,
        "redCards" INTEGER NOT NULL DEFAULT 0,
        "instagramFollowers" INTEGER NOT NULL DEFAULT 0,
        "twitterFollowers" INTEGER NOT NULL DEFAULT 0,
        "facebookFollowers" INTEGER NOT NULL DEFAULT 0,
        "fanEngagement" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Scores table
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        "playerId" INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        "totalScore" INTEGER NOT NULL,
        "socialScore" INTEGER NOT NULL,
        "performanceScore" INTEGER NOT NULL,
        "engagementScore" INTEGER NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Settings table
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- User Profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        "displayName" VARCHAR(255),
        bio TEXT,
        "avatarUrl" VARCHAR(255),
        location VARCHAR(255),
        "favoriteTeam" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Player Follows table
      CREATE TABLE IF NOT EXISTS player_follows (
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "playerId" INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("userId", "playerId")
      );
      
      -- Player Comments table
      CREATE TABLE IF NOT EXISTS player_comments (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "playerId" INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      -- Player Ratings table
      CREATE TABLE IF NOT EXISTS player_ratings (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "playerId" INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        UNIQUE("userId", "playerId")
      );
      
      -- Session table for connect-pg-simple
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    
    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main();