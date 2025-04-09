import { pgTable, text, serial, integer, real, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("isAdmin").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
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
  position: text("position").notNull().default("Unknown"),
  profileImg: text("profileImg"),
  bio: text("bio").notNull().default(""),
  instagramUrl: text("instagramUrl"),
  twitterUrl: text("twitterUrl"),
  facebookUrl: text("facebookUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
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

// User Profiles for additional user information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  favoriteTeam: text("favorite_team"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  location: true,
  favoriteTeam: true,
});

// Player Follows - track which players a user is following
export const playerFollows = pgTable("player_follows", {
  userId: integer("user_id").notNull(),
  playerId: integer("player_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.playerId] }),
  };
});

export const insertPlayerFollowSchema = createInsertSchema(playerFollows).pick({
  userId: true,
  playerId: true,
});

// Player Comments - allow users to comment on player profiles
export const playerComments = pgTable("player_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  playerId: integer("player_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlayerCommentSchema = createInsertSchema(playerComments).pick({
  userId: true,
  playerId: true,
  content: true,
});

// Player Ratings - allow users to rate players
export const playerRatings = pgTable("player_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  playerId: integer("player_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 star rating
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlayerRatingSchema = createInsertSchema(playerRatings).pick({
  userId: true,
  playerId: true,
  rating: true,
});

// Define relations between tables
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  follows: many(playerFollows),
  comments: many(playerComments),
  ratings: many(playerRatings),
}));

export const playersRelations = relations(players, ({ many }) => ({
  followers: many(playerFollows),
  comments: many(playerComments),
  ratings: many(playerRatings),
  stats: many(playerStats),
  scores: many(scores),
}));

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertPlayerFollow = z.infer<typeof insertPlayerFollowSchema>;
export type PlayerFollow = typeof playerFollows.$inferSelect;

export type InsertPlayerComment = z.infer<typeof insertPlayerCommentSchema>;
export type PlayerComment = typeof playerComments.$inferSelect;

export type InsertPlayerRating = z.infer<typeof insertPlayerRatingSchema>;
export type PlayerRating = typeof playerRatings.$inferSelect;
