# Soccer Player Influence Tracker - Klout.soccer

## Project Overview
A full-stack web application that tracks and analyzes soccer players' global influence using a combination of social media metrics, performance data, and fan engagement. The platform provides rankings, detailed player profiles, and comprehensive analytics for football enthusiasts.

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query for state management
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Library**: Shadcn/ui components with Tailwind CSS
- **Authentication**: Passport.js with local strategy

### Database Schema
- **Users**: Authentication and user management
- **Players**: Player information with stats and social media profiles
- **Player Stats**: Performance metrics (goals, assists, cards, social followers)
- **Scores**: Calculated influence scores (total, social, performance, engagement)
- **Fan Profiles**: User profiles for fans
- **Follows**: Fan-player relationships
- **Engagements**: Fan interaction tracking
- **Badges**: Achievement system for fans

### Key Features
1. **Player Rankings**: Top 100 players ranked by total influence score
2. **Detailed Player Profiles**: Comprehensive stats and social media metrics
3. **Category Leaders**: Top performers in social media, performance, and engagement
4. **Fan System**: User profiles, following players, engagement tracking
5. **Admin Panel**: Player management and data updates
6. **Real-time Updates**: Automatic data refreshing from external APIs

## Recent Changes
- **2025-01-17**: Migrated from Replit Agent to Replit environment
  - Set up PostgreSQL database with all required tables
  - Fixed frontend API response handling for rankings endpoint
  - Resolved nested anchor tag warnings in footer component
  - Ensured proper client/server separation and security practices

## Development Guidelines
- Follows fullstack JavaScript best practices
- Uses modern web application patterns
- Emphasizes client-side functionality with minimal backend
- Implements proper error handling and loading states
- Maintains type safety throughout the application

## API Endpoints
- `/api/rankings` - Paginated player rankings
- `/api/players` - Player list and details
- `/api/top-players/:category` - Category-specific top performers
- `/api/user` - User authentication and profile
- `/api/admin/*` - Administrative functions

## User Preferences
- None specified yet

## Environment Configuration
- Database: PostgreSQL (configured via DATABASE_URL)
- Server: Express on port 5000
- Development: Vite dev server integrated with Express
- Authentication: Session-based with secure cookies