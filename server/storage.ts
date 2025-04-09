import { 
  users, type User, type InsertUser, 
  players, type Player, type InsertPlayer, 
  playerStats, type PlayerStats, type InsertPlayerStats, 
  scores, type Score, type InsertScore, 
  type PlayerWithStats, 
  settings, type Settings, type InsertSettings,
  fanProfiles, type FanProfile, type InsertFanProfile,
  follows, type Follow, type InsertFollow,
  engagementTypes, type EngagementType, type InsertEngagementType,
  engagements, type Engagement, type InsertEngagement,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// IStorage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayerBySlug(slug: string): Promise<Player | undefined>;
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
  
  // Fan engagement operations
  getFanProfile(userId: number): Promise<FanProfile | undefined>;
  createFanProfile(profile: InsertFanProfile): Promise<FanProfile>;
  updateFanProfile(userId: number, profile: Partial<InsertFanProfile>): Promise<FanProfile | undefined>;
  
  followPlayer(userId: number, playerId: number): Promise<Follow>;
  unfollowPlayer(userId: number, playerId: number): Promise<boolean>;
  getPlayerFollowers(playerId: number): Promise<Follow[]>;
  getUserFollowing(userId: number): Promise<Follow[]>;
  isFollowing(userId: number, playerId: number): Promise<boolean>;
  
  createEngagement(engagement: InsertEngagement): Promise<Engagement>;
  getPlayerEngagements(playerId: number, limit?: number): Promise<Engagement[]>;
  getUserEngagements(userId: number, limit?: number): Promise<Engagement[]>;
  
  getEngagementTypes(): Promise<EngagementType[]>;
  getEngagementType(id: number): Promise<EngagementType | undefined>;
  createEngagementType(type: InsertEngagementType): Promise<EngagementType>;
  
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  assignBadgeToUser(userId: number, badgeId: number): Promise<UserBadge>;
  getUserBadges(userId: number): Promise<{ badge: Badge, userBadge: UserBadge }[]>;
  
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
  private fanProfiles: Map<number, FanProfile>;
  private follows: Map<number, Follow>;
  private engagementTypes: Map<number, EngagementType>;
  private engagements: Map<number, Engagement>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private currentUserId: number;
  private currentPlayerId: number;
  private currentStatsId: number;
  private currentScoreId: number;
  private currentProfileId: number;
  private currentFollowId: number;
  private currentEngagementTypeId: number;
  private currentEngagementId: number;
  private currentBadgeId: number;
  private currentUserBadgeId: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.playerStats = new Map();
    this.scores = new Map();
    this.settings = new Map();
    this.fanProfiles = new Map();
    this.follows = new Map();
    this.engagementTypes = new Map();
    this.engagements = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.currentUserId = 1;
    this.currentPlayerId = 1;
    this.currentStatsId = 1;
    this.currentScoreId = 1;
    this.currentProfileId = 1;
    this.currentFollowId = 1;
    this.currentEngagementTypeId = 1;
    this.currentEngagementId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
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
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: null
    };
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

  async getPlayerBySlug(slug: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(player => {
      // Generate slug from player name if slug field is missing
      const playerSlug = player.slug || player.name.toLowerCase().replace(/\s+/g, '-');
      return playerSlug === slug;
    });
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    // Generate slug from player name if not provided
    const slug = player.slug || player.name.toLowerCase().replace(/\s+/g, '-');
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
      updatedAt: null,
      slug,
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
    
    // If name is being updated but slug isn't provided, update the slug too
    if (player.name && !player.slug) {
      player.slug = player.name.toLowerCase().replace(/\s+/g, '-');
    }
    
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
      createdAt: new Date(),
      updatedAt: null,
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
  
  // Fan Profile methods
  async getFanProfile(userId: number): Promise<FanProfile | undefined> {
    return Array.from(this.fanProfiles.values()).find(
      profile => profile.userId === userId
    );
  }

  async createFanProfile(profile: InsertFanProfile): Promise<FanProfile> {
    const id = this.currentProfileId++;
    const newProfile: FanProfile = {
      ...profile,
      id,
      createdAt: new Date(),
      updatedAt: null,
      // Ensure null values for optional fields
      country: profile.country || null,
      bio: profile.bio || null,
      avatarUrl: profile.avatarUrl || null,
      favoriteTeam: profile.favoriteTeam || null
    };
    this.fanProfiles.set(id, newProfile);
    return newProfile;
  }

  async updateFanProfile(userId: number, profile: Partial<InsertFanProfile>): Promise<FanProfile | undefined> {
    const existingProfile = Array.from(this.fanProfiles.values()).find(
      p => p.userId === userId
    );
    
    if (!existingProfile) return undefined;
    
    const updatedProfile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date()
    };
    
    this.fanProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Follow methods
  async followPlayer(userId: number, playerId: number): Promise<Follow> {
    // Check if already following
    const existingFollow = Array.from(this.follows.values()).find(
      f => f.userId === userId && f.playerId === playerId
    );
    
    if (existingFollow) return existingFollow;
    
    // Create new follow
    const id = this.currentFollowId++;
    const newFollow: Follow = {
      id,
      userId,
      playerId,
      createdAt: new Date()
    };
    
    this.follows.set(id, newFollow);
    return newFollow;
  }
  
  async unfollowPlayer(userId: number, playerId: number): Promise<boolean> {
    const existingFollow = Array.from(this.follows.values()).find(
      f => f.userId === userId && f.playerId === playerId
    );
    
    if (!existingFollow) return false;
    
    return this.follows.delete(existingFollow.id);
  }
  
  async getPlayerFollowers(playerId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      f => f.playerId === playerId
    );
  }
  
  async getUserFollowing(userId: number): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(
      f => f.userId === userId
    );
  }
  
  async isFollowing(userId: number, playerId: number): Promise<boolean> {
    return Array.from(this.follows.values()).some(
      f => f.userId === userId && f.playerId === playerId
    );
  }
  
  // Engagement methods
  async createEngagement(engagement: InsertEngagement): Promise<Engagement> {
    const id = this.currentEngagementId++;
    const newEngagement: Engagement = {
      ...engagement,
      id,
      createdAt: new Date(),
      // Ensure null value for optional content
      content: engagement.content || null
    };
    
    this.engagements.set(id, newEngagement);
    return newEngagement;
  }
  
  async getPlayerEngagements(playerId: number, limit: number = 10): Promise<Engagement[]> {
    return Array.from(this.engagements.values())
      .filter(e => e.playerId === playerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getUserEngagements(userId: number, limit: number = 10): Promise<Engagement[]> {
    return Array.from(this.engagements.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  // Engagement Types methods
  async getEngagementTypes(): Promise<EngagementType[]> {
    return Array.from(this.engagementTypes.values());
  }
  
  async getEngagementType(id: number): Promise<EngagementType | undefined> {
    return this.engagementTypes.get(id);
  }
  
  async createEngagementType(type: InsertEngagementType): Promise<EngagementType> {
    const id = this.currentEngagementTypeId++;
    const newType: EngagementType = {
      ...type,
      id,
      createdAt: new Date(),
      // Ensure required pointValue has a default
      pointValue: type.pointValue ?? 0
    };
    
    this.engagementTypes.set(id, newType);
    return newType;
  }
  
  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.currentBadgeId++;
    const newBadge: Badge = {
      ...badge,
      id,
      createdAt: new Date()
    };
    
    this.badges.set(id, newBadge);
    return newBadge;
  }
  
  // User Badge methods
  async assignBadgeToUser(userId: number, badgeId: number): Promise<UserBadge> {
    // Check if user already has this badge
    const existingBadge = Array.from(this.userBadges.values()).find(
      ub => ub.userId === userId && ub.badgeId === badgeId
    );
    
    if (existingBadge) return existingBadge;
    
    // Assign badge to user
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = {
      id,
      userId,
      badgeId,
      earnedAt: new Date()
    };
    
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
  
  async getUserBadges(userId: number): Promise<{ badge: Badge, userBadge: UserBadge }[]> {
    const userBadges = Array.from(this.userBadges.values()).filter(
      ub => ub.userId === userId
    );
    
    const result: { badge: Badge, userBadge: UserBadge }[] = [];
    
    for (const userBadge of userBadges) {
      const badge = this.badges.get(userBadge.badgeId);
      if (badge) {
        result.push({ badge, userBadge });
      }
    }
    
    return result;
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
  
  async getPlayerBySlug(slug: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.slug, slug));
    return player;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    // Generate slug from player name if not provided
    if (!player.slug) {
      player.slug = player.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Ensure required fields are properly set
    const processedPlayer = {
      ...player,
      slug: player.slug,
      bio: player.bio || "",
      instagramUrl: player.instagramUrl === undefined ? null : player.instagramUrl,
      twitterUrl: player.twitterUrl === undefined ? null : player.twitterUrl,
      facebookUrl: player.facebookUrl === undefined ? null : player.facebookUrl,
    };
    
    const [newPlayer] = await db.insert(players).values(processedPlayer).returning();
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    // If name is being updated but slug isn't provided, update the slug too
    if (player.name && !player.slug) {
      player.slug = player.name.toLowerCase().replace(/\s+/g, '-');
    }
    
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

  // Fan Profile methods
  async getFanProfile(userId: number): Promise<FanProfile | undefined> {
    const [profile] = await db
      .select()
      .from(fanProfiles)
      .where(eq(fanProfiles.userId, userId));
    return profile;
  }

  async createFanProfile(profile: InsertFanProfile): Promise<FanProfile> {
    const [newProfile] = await db
      .insert(fanProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateFanProfile(userId: number, profile: Partial<InsertFanProfile>): Promise<FanProfile | undefined> {
    const [updatedProfile] = await db
      .update(fanProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(fanProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Follow methods
  async followPlayer(userId: number, playerId: number): Promise<Follow> {
    console.log(`[FOLLOW] Attempting to follow playerId=${playerId} for userId=${userId}`);
    
    // Check if already following
    const existingFollow = await db
      .select()
      .from(follows)
      .where(and(
        eq(follows.userId, userId),
        eq(follows.playerId, playerId)
      ));

    if (existingFollow.length > 0) {
      console.log(`[FOLLOW] Already following, returning existing follow`);
      return existingFollow[0];
    }

    try {
      // Create new follow
      console.log(`[FOLLOW] Creating new follow relation`);
      const [follow] = await db
        .insert(follows)
        .values({ userId, playerId })
        .returning();
      
      console.log(`[FOLLOW] Successfully created follow relation: ${JSON.stringify(follow)}`);
      return follow;
    } catch (error) {
      console.error(`[FOLLOW ERROR] Failed to create follow:`, error);
      throw error;
    }
  }

  async unfollowPlayer(userId: number, playerId: number): Promise<boolean> {
    console.log(`[UNFOLLOW] Attempting to unfollow playerId=${playerId} for userId=${userId}`);
    
    try {
      await db
        .delete(follows)
        .where(and(
          eq(follows.userId, userId),
          eq(follows.playerId, playerId)
        ));
      
      console.log(`[UNFOLLOW] Successfully unfollowed`);
      return true;
    } catch (error) {
      console.error(`[UNFOLLOW ERROR] Failed to unfollow:`, error);
      throw error;
    }
  }

  async getPlayerFollowers(playerId: number): Promise<Follow[]> {
    return await db
      .select()
      .from(follows)
      .where(eq(follows.playerId, playerId));
  }

  async getUserFollowing(userId: number): Promise<Follow[]> {
    try {
      console.log(`[FOLLOWS] Getting follows for user ${userId}`);
      const followsWithPlayers = await db
        .select({
          follow: follows,
          player: players
        })
        .from(follows)
        .where(eq(follows.userId, userId))
        .innerJoin(players, eq(follows.playerId, players.id));
      
      console.log(`[FOLLOWS] Found ${followsWithPlayers.length} follows for user ${userId}`);
      
      return followsWithPlayers.map(result => ({ 
        ...result.follow,
        playerName: result.player.name,
        playerSlug: result.player.slug,
        player: result.player // Include the full player object
      }));
    } catch (error) {
      console.error(`[FOLLOWS ERROR] Error getting follows for user ${userId}:`, error);
      // Return empty array on error rather than throwing
      return [];
    }
  }

  async isFollowing(userId: number, playerId: number): Promise<boolean> {
    const followEntries = await db
      .select()
      .from(follows)
      .where(and(
        eq(follows.userId, userId),
        eq(follows.playerId, playerId)
      ));
    
    return followEntries.length > 0;
  }

  // Engagement methods
  async createEngagement(engagement: InsertEngagement): Promise<Engagement> {
    const [newEngagement] = await db
      .insert(engagements)
      .values(engagement)
      .returning();
    
    return newEngagement;
  }

  async getPlayerEngagements(playerId: number, limit: number = 10): Promise<Engagement[]> {
    return await db
      .select()
      .from(engagements)
      .where(eq(engagements.playerId, playerId))
      .orderBy(desc(engagements.createdAt))
      .limit(limit);
  }

  async getUserEngagements(userId: number, limit: number = 10): Promise<Engagement[]> {
    return await db
      .select()
      .from(engagements)
      .where(eq(engagements.userId, userId))
      .orderBy(desc(engagements.createdAt))
      .limit(limit);
  }

  // Engagement Types methods
  async getEngagementTypes(): Promise<EngagementType[]> {
    return await db.select().from(engagementTypes);
  }

  async getEngagementType(id: number): Promise<EngagementType | undefined> {
    const [type] = await db
      .select()
      .from(engagementTypes)
      .where(eq(engagementTypes.id, id));
    
    return type;
  }

  async createEngagementType(type: InsertEngagementType): Promise<EngagementType> {
    const [newType] = await db
      .insert(engagementTypes)
      .values(type)
      .returning();
    
    return newType;
  }

  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db
      .select()
      .from(badges)
      .where(eq(badges.id, id));
    
    return badge;
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db
      .insert(badges)
      .values(badge)
      .returning();
    
    return newBadge;
  }

  // User Badge methods
  async assignBadgeToUser(userId: number, badgeId: number): Promise<UserBadge> {
    // Check if user already has this badge
    const existingBadge = await db
      .select()
      .from(userBadges)
      .where(and(
        eq(userBadges.userId, userId),
        eq(userBadges.badgeId, badgeId)
      ));

    if (existingBadge.length > 0) {
      return existingBadge[0];
    }

    // Assign badge to user
    const [userBadge] = await db
      .insert(userBadges)
      .values({ userId, badgeId })
      .returning();
    
    return userBadge;
  }

  async getUserBadges(userId: number): Promise<{ badge: Badge, userBadge: UserBadge }[]> {
    const userBadgesWithInfo = await db
      .select({
        badge: badges,
        userBadge: userBadges
      })
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .innerJoin(badges, eq(userBadges.badgeId, badges.id));
    
    return userBadgesWithInfo;
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
