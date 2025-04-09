import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false), // using snake_case in column definition
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  team: text("team").notNull(),
  country: text("country").notNull(),
  position: text("position").notNull(),
  profileImg: text("profileImg").notNull(),
  bio: text("bio").notNull().default(""),
  instagramUrl: text("instagramUrl"),
  twitterUrl: text("twitterUrl"),
  facebookUrl: text("facebookUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  team: true,
  country: true,
  position: true,
  profileImg: true,
  bio: true,
  instagramUrl: true,
  twitterUrl: true,
  facebookUrl: true,
});

// Player stats schema
export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("playerId").notNull(), // this needs to be camelCase to match DB
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  yellowCards: integer("yellowCards").notNull().default(0), // this needs to be camelCase to match DB
  redCards: integer("redCards").notNull().default(0), // this needs to be camelCase to match DB
  instagramFollowers: integer("instagramFollowers").notNull().default(0), // this needs to be camelCase to match DB
  facebookFollowers: integer("facebookFollowers").notNull().default(0), // this needs to be camelCase to match DB
  twitterFollowers: integer("twitterFollowers").notNull().default(0), // this needs to be camelCase to match DB
  fanEngagement: integer("fanEngagement").notNull().default(0), // this needs to be camelCase to match DB
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).pick({
  playerId: true,
  goals: true,
  assists: true,
  yellowCards: true,
  redCards: true,
  instagramFollowers: true,
  facebookFollowers: true,
  twitterFollowers: true,
  fanEngagement: true,
});

// Influence scores schema
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  playerId: integer("playerId").notNull(), // this needs to be camelCase to match DB
  totalScore: integer("totalScore").notNull(), // this needs to be camelCase to match DB
  socialScore: integer("socialScore").notNull(), // this needs to be camelCase to match DB
  performanceScore: integer("performanceScore").notNull(), // this needs to be camelCase to match DB
  engagementScore: integer("engagementScore").notNull(), // this needs to be camelCase to match DB
  date: timestamp("date").notNull().defaultNow(),
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  playerId: true,
  totalScore: true,
  socialScore: true,
  performanceScore: true,
  engagementScore: true,
});

// Player with stats type (join)
export interface PlayerWithStats {
  player: typeof players.$inferSelect;
  stats: typeof playerStats.$inferSelect;
  score: typeof scores.$inferSelect;
}

// Settings table for app configuration
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  key: true,
  value: true
});

// Types for our schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type PlayerStats = typeof playerStats.$inferSelect;

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
