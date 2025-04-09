import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  club: text("club").notNull(),
  country: text("country").notNull(),
  position: text("position").notNull(),
  profileImg: text("profile_img").notNull(),
  bio: text("bio").notNull().default(""),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  club: true,
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
  playerId: integer("player_id").notNull(),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  yellowCards: integer("yellow_cards").notNull().default(0),
  redCards: integer("red_cards").notNull().default(0),
  instagramFollowers: integer("instagram_followers").notNull().default(0),
  facebookFollowers: integer("facebook_followers").notNull().default(0),
  twitterFollowers: integer("twitter_followers").notNull().default(0),
  fanEngagement: real("fan_engagement").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  playerId: integer("player_id").notNull(),
  totalScore: real("total_score").notNull(),
  socialScore: real("social_score").notNull(),
  performanceScore: real("performance_score").notNull(),
  engagementScore: real("engagement_score").notNull(),
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
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow()
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
