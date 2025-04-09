import { 
  users, type User, type InsertUser, 
  players, type Player, type InsertPlayer, 
  playerStats, type PlayerStats, type InsertPlayerStats, 
  scores, type Score, type InsertScore, 
  settings,
  userProfiles, type UserProfile, type InsertUserProfile,
  playerFollows, type PlayerFollow, type InsertPlayerFollow,
  playerComments, type PlayerComment, type InsertPlayerComment,
  playerRatings, type PlayerRating, type InsertPlayerRating,
  type PlayerWithStats
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, asc, and, sql, avg } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// IStorage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profile operations
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  
  // Player Stats operations
  getPlayerStats(playerId: number): Promise<PlayerStats | undefined>;
  createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats>;
  updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined>;
  
  // Score operations
  getScores(playerId: number): Promise<Score[]>;
  getLatestScore(playerId: number): Promise<Score | undefined>;
  createScore(score: InsertScore): Promise<Score>;
  getAllScores(): Promise<Score[]>;
  
  // Joined operations
  getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]>;
  getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined>;
  getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]>;
  
  // Settings operations
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  
  // Player Follow operations
  followPlayer(userId: number, playerId: number): Promise<PlayerFollow>;
  unfollowPlayer(userId: number, playerId: number): Promise<boolean>;
  getPlayerFollowers(playerId: number): Promise<User[]>;
  getUserFollowing(userId: number): Promise<Player[]>;
  isFollowing(userId: number, playerId: number): Promise<boolean>;
  
  // Player Comment operations
  createPlayerComment(comment: InsertPlayerComment): Promise<PlayerComment>;
  getPlayerComments(playerId: number): Promise<{comment: PlayerComment, user: User}[]>;
  getUserComments(userId: number): Promise<{comment: PlayerComment, player: Player}[]>;
  deletePlayerComment(commentId: number, userId: number): Promise<boolean>;
  
  // Player Rating operations
  createOrUpdatePlayerRating(rating: InsertPlayerRating): Promise<PlayerRating>;
  getPlayerRatings(playerId: number): Promise<PlayerRating[]>;
  getUserRating(userId: number, playerId: number): Promise<PlayerRating | undefined>;
  getPlayerAverageRating(playerId: number): Promise<number>;
  
  // Session store
  sessionStore: any;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private playerStats: Map<number, PlayerStats>;
  private scores: Map<number, Score[]>;
  private settings: Map<string, string>;
  private currentUserId: number;
  private currentPlayerId: number;
  private currentStatsId: number;
  private currentScoreId: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.playerStats = new Map();
    this.scores = new Map();
    this.settings = new Map();
    this.currentUserId = 1;
    this.currentPlayerId = 1;
    this.currentStatsId = 1;
    this.currentScoreId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every day
    });
    
    // Create initial admin user
    this.createUser({
      username: "admin",
      password: "password", // This will be hashed before storage in auth.ts
    }).then(user => {
      // Mark the user as an admin
      const adminUser = { ...user, isAdmin: true };
      this.users.set(user.id, adminUser);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    // Make sure bio is not undefined
    const bio = player.bio || "";
    // Make sure social URLs are not undefined
    const instagramUrl = player.instagramUrl === undefined ? null : player.instagramUrl;
    const twitterUrl = player.twitterUrl === undefined ? null : player.twitterUrl;
    const facebookUrl = player.facebookUrl === undefined ? null : player.facebookUrl;
    
    const newPlayer: Player = { 
      ...player, 
      id, 
      createdAt: new Date(),
      bio,
      instagramUrl,
      twitterUrl,
      facebookUrl
    };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existingPlayer = this.players.get(id);
    if (!existingPlayer) return undefined;
    
    const updatedPlayer = { ...existingPlayer, ...player };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    return this.players.delete(id);
  }

  // Player Stats methods
  async getPlayerStats(playerId: number): Promise<PlayerStats | undefined> {
    return Array.from(this.playerStats.values()).find(
      stats => stats.playerId === playerId
    );
  }

  async createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats> {
    const id = this.currentStatsId++;
    const newStats: PlayerStats = { 
      ...stats, 
      id, 
      updatedAt: new Date(),
      // Ensure all required fields have default values
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      yellowCards: stats.yellowCards ?? 0,
      redCards: stats.redCards ?? 0,
      instagramFollowers: stats.instagramFollowers ?? 0,
      facebookFollowers: stats.facebookFollowers ?? 0,
      twitterFollowers: stats.twitterFollowers ?? 0,
      fanEngagement: stats.fanEngagement ?? 0
    };
    this.playerStats.set(id, newStats);
    return newStats;
  }

  async updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined> {
    const existingStats = this.playerStats.get(id);
    if (!existingStats) return undefined;
    
    const updatedStats = { 
      ...existingStats, 
      ...stats,
      updatedAt: new Date() 
    };
    this.playerStats.set(id, updatedStats);
    return updatedStats;
  }

  // Score methods
  async getScores(playerId: number): Promise<Score[]> {
    const playerScores = this.scores.get(playerId) || [];
    return playerScores;
  }

  async getLatestScore(playerId: number): Promise<Score | undefined> {
    const playerScores = this.scores.get(playerId) || [];
    if (playerScores.length === 0) return undefined;
    
    // Sort by date descending and return the first one
    return playerScores.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  async createScore(score: InsertScore): Promise<Score> {
    const id = this.currentScoreId++;
    const newScore: Score = { 
      ...score, 
      id, 
      date: new Date() 
    };
    
    const playerScores = this.scores.get(score.playerId) || [];
    playerScores.push(newScore);
    this.scores.set(score.playerId, playerScores);
    
    return newScore;
  }

  async getAllScores(): Promise<Score[]> {
    const allScores: Score[] = [];
    this.scores.forEach(scoreArray => {
      allScores.push(...scoreArray);
    });
    return allScores;
  }

  // Joined operations
  async getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]> {
    const allPlayers = await this.getAllPlayers();
    const result: PlayerWithStats[] = [];

    for (const player of allPlayers) {
      const stats = await this.getPlayerStats(player.id);
      const latestScore = await this.getLatestScore(player.id);
      
      if (stats && latestScore) {
        result.push({
          player,
          stats,
          score: latestScore
        });
      }
    }

    return result;
  }

  async getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined> {
    const player = await this.getPlayer(playerId);
    if (!player) return undefined;

    const stats = await this.getPlayerStats(playerId);
    const latestScore = await this.getLatestScore(playerId);
    
    if (stats && latestScore) {
      return {
        player,
        stats,
        score: latestScore
      };
    }

    return undefined;
  }

  async getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]> {
    const playerWithStats = await this.getPlayersWithStatsAndScores();
    
    let sortedPlayers: PlayerWithStats[];
    
    switch (category) {
      case 'social':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.socialScore - a.score.socialScore);
        break;
      case 'performance':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.performanceScore - a.score.performanceScore);
        break;
      case 'engagement':
        sortedPlayers = playerWithStats.sort((a, b) => b.score.engagementScore - a.score.engagementScore);
        break;
      default:
        sortedPlayers = playerWithStats.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }
    
    return sortedPlayers.slice(0, limit);
  }
  
  // Settings methods
  async getSetting(key: string): Promise<string | null> {
    return this.settings.get(key) || null;
  }
  
  async setSetting(key: string, value: string): Promise<void> {
    this.settings.set(key, value);
  }

  // User Profile operations
  private userProfiles: Map<number, UserProfile> = new Map();
  private currentProfileId: number = 1;

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      profile => profile.userId === userId
    );
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = this.currentProfileId++;
    const newProfile: UserProfile = {
      ...profile,
      id,
      displayName: profile.displayName || null,
      bio: profile.bio || null,
      avatarUrl: profile.avatarUrl || null,
      location: profile.location || null,
      favoriteTeam: profile.favoriteTeam || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = Array.from(this.userProfiles.values()).find(
      p => p.userId === userId
    );
    if (!existingProfile) return undefined;
    
    const updatedProfile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date()
    };
    this.userProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  // Player Follow operations
  private playerFollows: Map<string, PlayerFollow> = new Map();

  async followPlayer(userId: number, playerId: number): Promise<PlayerFollow> {
    const key = `${userId}-${playerId}`;
    const existingFollow = this.playerFollows.get(key);
    
    if (existingFollow) {
      return existingFollow;
    }
    
    const newFollow: PlayerFollow = {
      userId,
      playerId,
      createdAt: new Date()
    };
    this.playerFollows.set(key, newFollow);
    return newFollow;
  }

  async unfollowPlayer(userId: number, playerId: number): Promise<boolean> {
    const key = `${userId}-${playerId}`;
    return this.playerFollows.delete(key);
  }

  async getPlayerFollowers(playerId: number): Promise<User[]> {
    const userIds = Array.from(this.playerFollows.values())
      .filter(follow => follow.playerId === playerId)
      .map(follow => follow.userId);
    
    return Array.from(this.users.values())
      .filter(user => userIds.includes(user.id));
  }

  async getUserFollowing(userId: number): Promise<Player[]> {
    const playerIds = Array.from(this.playerFollows.values())
      .filter(follow => follow.userId === userId)
      .map(follow => follow.playerId);
    
    return Array.from(this.players.values())
      .filter(player => playerIds.includes(player.id));
  }

  async isFollowing(userId: number, playerId: number): Promise<boolean> {
    const key = `${userId}-${playerId}`;
    return this.playerFollows.has(key);
  }

  // Player Comment operations
  private playerComments: Map<number, PlayerComment> = new Map();
  private currentCommentId: number = 1;

  async createPlayerComment(comment: InsertPlayerComment): Promise<PlayerComment> {
    const id = this.currentCommentId++;
    const newComment: PlayerComment = {
      ...comment,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.playerComments.set(id, newComment);
    return newComment;
  }

  async getPlayerComments(playerId: number): Promise<{comment: PlayerComment, user: User}[]> {
    const comments = Array.from(this.playerComments.values())
      .filter(comment => comment.playerId === playerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return comments.map(comment => {
      const user = this.users.get(comment.userId);
      if (!user) throw new Error(`User not found for comment ${comment.id}`);
      return { comment, user };
    });
  }

  async getUserComments(userId: number): Promise<{comment: PlayerComment, player: Player}[]> {
    const comments = Array.from(this.playerComments.values())
      .filter(comment => comment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return comments.map(comment => {
      const player = this.players.get(comment.playerId);
      if (!player) throw new Error(`Player not found for comment ${comment.id}`);
      return { comment, player };
    });
  }

  async deletePlayerComment(commentId: number, userId: number): Promise<boolean> {
    const comment = this.playerComments.get(commentId);
    if (!comment || comment.userId !== userId) return false;
    
    return this.playerComments.delete(commentId);
  }

  // Player Rating operations
  private playerRatings: Map<number, PlayerRating> = new Map();
  private currentRatingId: number = 1;

  async createOrUpdatePlayerRating(rating: InsertPlayerRating): Promise<PlayerRating> {
    const existingRating = Array.from(this.playerRatings.values()).find(
      r => r.userId === rating.userId && r.playerId === rating.playerId
    );
    
    if (existingRating) {
      const updatedRating = {
        ...existingRating,
        rating: rating.rating,
        updatedAt: new Date()
      };
      this.playerRatings.set(existingRating.id, updatedRating);
      return updatedRating;
    } else {
      const id = this.currentRatingId++;
      const newRating: PlayerRating = {
        ...rating,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.playerRatings.set(id, newRating);
      return newRating;
    }
  }

  async getPlayerRatings(playerId: number): Promise<PlayerRating[]> {
    return Array.from(this.playerRatings.values())
      .filter(rating => rating.playerId === playerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserRating(userId: number, playerId: number): Promise<PlayerRating | undefined> {
    return Array.from(this.playerRatings.values()).find(
      rating => rating.userId === userId && rating.playerId === playerId
    );
  }

  async getPlayerAverageRating(playerId: number): Promise<number> {
    const ratings = await this.getPlayerRatings(playerId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return sum / ratings.length;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    // Ensure required fields are properly set
    const processedPlayer = {
      ...player,
      bio: player.bio || "",
      instagramUrl: player.instagramUrl === undefined ? null : player.instagramUrl,
      twitterUrl: player.twitterUrl === undefined ? null : player.twitterUrl,
      facebookUrl: player.facebookUrl === undefined ? null : player.facebookUrl,
    };
    
    const [newPlayer] = await db.insert(players).values(processedPlayer).returning();
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updatedPlayer] = await db
      .update(players)
      .set(player)
      .where(eq(players.id, id))
      .returning();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    // Delete associated data first (foreign key relationships)
    await db.delete(scores).where(eq(scores.playerId, id));
    await db.delete(playerStats).where(eq(playerStats.playerId, id));
    
    const result = await db.delete(players).where(eq(players.id, id));
    // Success if we deleted at least one record
    return true;
  }

  // Player Stats methods
  async getPlayerStats(playerId: number): Promise<PlayerStats | undefined> {
    const [stats] = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId));
    return stats;
  }

  async createPlayerStats(stats: InsertPlayerStats): Promise<PlayerStats> {
    // Ensure all required fields have default values
    const processedStats = {
      ...stats,
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      yellowCards: stats.yellowCards ?? 0,
      redCards: stats.redCards ?? 0,
      instagramFollowers: stats.instagramFollowers ?? 0,
      facebookFollowers: stats.facebookFollowers ?? 0,
      twitterFollowers: stats.twitterFollowers ?? 0,
      fanEngagement: stats.fanEngagement ?? 0
    };
    
    const [newStats] = await db
      .insert(playerStats)
      .values(processedStats)
      .returning();
    return newStats;
  }

  async updatePlayerStats(id: number, stats: Partial<InsertPlayerStats>): Promise<PlayerStats | undefined> {
    const [updatedStats] = await db
      .update(playerStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(playerStats.id, id))
      .returning();
    return updatedStats;
  }

  // Score methods
  async getScores(playerId: number): Promise<Score[]> {
    return await db
      .select()
      .from(scores)
      .where(eq(scores.playerId, playerId))
      .orderBy(desc(scores.date));
  }

  async getLatestScore(playerId: number): Promise<Score | undefined> {
    const [latestScore] = await db
      .select()
      .from(scores)
      .where(eq(scores.playerId, playerId))
      .orderBy(desc(scores.date))
      .limit(1);
    return latestScore;
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db
      .insert(scores)
      .values(score)
      .returning();
    return newScore;
  }

  async getAllScores(): Promise<Score[]> {
    return await db.select().from(scores).orderBy(desc(scores.date));
  }

  // Joined operations
  async getPlayersWithStatsAndScores(): Promise<PlayerWithStats[]> {
    const allPlayers = await this.getAllPlayers();
    const result: PlayerWithStats[] = [];

    for (const player of allPlayers) {
      const stats = await this.getPlayerStats(player.id);
      const latestScore = await this.getLatestScore(player.id);
      
      if (stats && latestScore) {
        result.push({
          player,
          stats,
          score: latestScore
        });
      }
    }

    return result;
  }

  async getPlayerWithStatsAndScores(playerId: number): Promise<PlayerWithStats | undefined> {
    const player = await this.getPlayer(playerId);
    if (!player) return undefined;

    const stats = await this.getPlayerStats(playerId);
    const latestScore = await this.getLatestScore(playerId);
    
    if (stats && latestScore) {
      return {
        player,
        stats,
        score: latestScore
      };
    }

    return undefined;
  }

  async getTopPlayersByCategory(category: 'social' | 'performance' | 'engagement', limit: number): Promise<PlayerWithStats[]> {
    // First get all players with their stats and scores
    const playersWithStats = await this.getPlayersWithStatsAndScores();
    
    // Sort based on category
    let sortedPlayers: PlayerWithStats[];
    
    switch (category) {
      case 'social':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.socialScore - a.score.socialScore);
        break;
      case 'performance':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.performanceScore - a.score.performanceScore);
        break;
      case 'engagement':
        sortedPlayers = playersWithStats.sort((a, b) => b.score.engagementScore - a.score.engagementScore);
        break;
      default:
        sortedPlayers = playersWithStats.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }
    
    return sortedPlayers.slice(0, limit);
  }
  
  // Settings methods
  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key));
    return setting?.value || null;
  }
  
  async setSetting(key: string, value: string): Promise<void> {
    // Check if the setting already exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key));
    
    if (existingSetting.length > 0) {
      // Update existing setting
      await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      // Create new setting
      await db
        .insert(settings)
        .values({ key, value });
    }
  }

  // User Profile operations
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Player Follow operations
  async followPlayer(userId: number, playerId: number): Promise<PlayerFollow> {
    // Check if already following
    const isAlreadyFollowing = await this.isFollowing(userId, playerId);
    if (isAlreadyFollowing) {
      // Return the existing follow record
      const [follow] = await db
        .select()
        .from(playerFollows)
        .where(and(
          eq(playerFollows.userId, userId),
          eq(playerFollows.playerId, playerId)
        ));
      return follow;
    }

    const [follow] = await db
      .insert(playerFollows)
      .values({
        userId,
        playerId,
        createdAt: new Date()
      })
      .returning();
    return follow;
  }

  async unfollowPlayer(userId: number, playerId: number): Promise<boolean> {
    const result = await db
      .delete(playerFollows)
      .where(and(
        eq(playerFollows.userId, userId),
        eq(playerFollows.playerId, playerId)
      ));
    return true;
  }

  async getPlayerFollowers(playerId: number): Promise<User[]> {
    const followers = await db
      .select({
        user: users
      })
      .from(playerFollows)
      .where(eq(playerFollows.playerId, playerId))
      .innerJoin(users, eq(playerFollows.userId, users.id));
    
    return followers.map(item => item.user);
  }

  async getUserFollowing(userId: number): Promise<Player[]> {
    const following = await db
      .select({
        player: players
      })
      .from(playerFollows)
      .where(eq(playerFollows.userId, userId))
      .innerJoin(players, eq(playerFollows.playerId, players.id));
    
    return following.map(item => item.player);
  }

  async isFollowing(userId: number, playerId: number): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(playerFollows)
      .where(and(
        eq(playerFollows.userId, userId),
        eq(playerFollows.playerId, playerId)
      ));
    return !!follow;
  }

  // Player Comment operations
  async createPlayerComment(comment: InsertPlayerComment): Promise<PlayerComment> {
    const [newComment] = await db
      .insert(playerComments)
      .values({
        ...comment,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newComment;
  }

  async getPlayerComments(playerId: number): Promise<{comment: PlayerComment, user: User}[]> {
    const comments = await db
      .select({
        comment: playerComments,
        user: users
      })
      .from(playerComments)
      .where(eq(playerComments.playerId, playerId))
      .innerJoin(users, eq(playerComments.userId, users.id))
      .orderBy(desc(playerComments.createdAt));
    
    return comments;
  }

  async getUserComments(userId: number): Promise<{comment: PlayerComment, player: Player}[]> {
    const comments = await db
      .select({
        comment: playerComments,
        player: players
      })
      .from(playerComments)
      .where(eq(playerComments.userId, userId))
      .innerJoin(players, eq(playerComments.playerId, players.id))
      .orderBy(desc(playerComments.createdAt));
    
    return comments;
  }

  async deletePlayerComment(commentId: number, userId: number): Promise<boolean> {
    // Only allow users to delete their own comments
    const result = await db
      .delete(playerComments)
      .where(and(
        eq(playerComments.id, commentId),
        eq(playerComments.userId, userId)
      ));
    return true;
  }

  // Player Rating operations
  async createOrUpdatePlayerRating(rating: InsertPlayerRating): Promise<PlayerRating> {
    // Check if user has already rated this player
    const existingRating = await this.getUserRating(rating.userId, rating.playerId);
    
    if (existingRating) {
      // Update existing rating
      const [updatedRating] = await db
        .update(playerRatings)
        .set({
          rating: rating.rating,
          updatedAt: new Date()
        })
        .where(and(
          eq(playerRatings.userId, rating.userId),
          eq(playerRatings.playerId, rating.playerId)
        ))
        .returning();
      return updatedRating;
    } else {
      // Create new rating
      const [newRating] = await db
        .insert(playerRatings)
        .values({
          ...rating,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newRating;
    }
  }

  async getPlayerRatings(playerId: number): Promise<PlayerRating[]> {
    return await db
      .select()
      .from(playerRatings)
      .where(eq(playerRatings.playerId, playerId))
      .orderBy(desc(playerRatings.createdAt));
  }

  async getUserRating(userId: number, playerId: number): Promise<PlayerRating | undefined> {
    const [rating] = await db
      .select()
      .from(playerRatings)
      .where(and(
        eq(playerRatings.userId, userId),
        eq(playerRatings.playerId, playerId)
      ));
    return rating;
  }

  async getPlayerAverageRating(playerId: number): Promise<number> {
    const [result] = await db
      .select({
        averageRating: avg(playerRatings.rating)
      })
      .from(playerRatings)
      .where(eq(playerRatings.playerId, playerId));
    
    return result && typeof result.averageRating === 'number' ? result.averageRating : 0;
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
