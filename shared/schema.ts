import { pgTable, text, serial, integer, real, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(), // Add slug field with unique constraint, but allow NULL for existing records
  team: text("team").notNull(),
  country: text("country").notNull(),
  position: text("position").notNull(),
  profileImg: text("profile_img").notNull(),
  bio: text("bio").notNull().default(""),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  slug: true,  // Include slug field in insert schema
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
  playerId: integer("player_id").notNull(),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  yellowCards: integer("yellow_cards").notNull().default(0),
  redCards: integer("red_cards").notNull().default(0),
  instagramFollowers: integer("instagram_followers").notNull().default(0),
  facebookFollowers: integer("facebook_followers").notNull().default(0),
  twitterFollowers: integer("twitter_followers").notNull().default(0),
  fanEngagement: real("fan_engagement").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
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
  value: text("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
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

// Fan Profile schema
export const fanProfiles = pgTable("fan_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  favoriteTeam: text("favorite_team"),
  country: text("country"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertFanProfileSchema = createInsertSchema(fanProfiles).pick({
  userId: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  favoriteTeam: true,
  country: true,
});

// Fan Follows - tracking which players fans follow
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  playerId: integer("player_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  userId: true,
  playerId: true,
});

// Engagement types for fan interactions
export const engagementTypes = pgTable("engagement_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  pointValue: integer("point_value").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEngagementTypeSchema = createInsertSchema(engagementTypes).pick({
  name: true,
  description: true,
  pointValue: true,
});

// Fan engagement tracking
export const engagements = pgTable("engagements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  playerId: integer("player_id").notNull(),
  typeId: integer("type_id").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEngagementSchema = createInsertSchema(engagements).pick({
  userId: true,
  playerId: true,
  typeId: true,
  content: true,
});

// Fan badges/achievements
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
  criteria: text("criteria").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  iconUrl: true,
  criteria: true,
});

// Users earning badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(fanProfiles, {
    fields: [users.id],
    references: [fanProfiles.userId],
  }),
  follows: many(follows),
  engagements: many(engagements),
  badges: many(userBadges),
}));

export const playersRelations = relations(players, ({ many }) => ({
  followers: many(follows),
  engagements: many(engagements),
}));

export const engagementTypesRelations = relations(engagementTypes, ({ many }) => ({
  engagements: many(engagements),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

// Additional types
export type InsertFanProfile = z.infer<typeof insertFanProfileSchema>;
export type FanProfile = typeof fanProfiles.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect & { playerName?: string | null };

export type InsertEngagementType = z.infer<typeof insertEngagementTypeSchema>;
export type EngagementType = typeof engagementTypes.$inferSelect;

export type InsertEngagement = z.infer<typeof insertEngagementSchema>;
export type Engagement = typeof engagements.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
