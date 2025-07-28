# Golf Tournament Management System

## Overview

This is a full-stack web application for managing golf tournaments, built with React frontend and Express backend. The system allows administrators to create tournaments, manage players and teams, track scores, and provides a real-time scorecard interface for players.

## User Preferences

Preferred communication style: Simple, everyday language.
App Name: Golf Tournament Pro (updated from GolfScore Pro)
Visual Design: Added professional golf course cover photo for homepage hero section

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with tsx and Vite middleware

## Key Components

### Database Schema
- **courses**: Golf course information (name, par, yardage, rating)
- **holes**: Individual hole details for each course
- **players**: Player profiles with handicap and unique codes
- **teams**: Team composition linking two players to a course
- **scores**: Score tracking per team per hole
- **tournaments**: Tournament metadata and configuration

### API Endpoints
- **Courses**: GET `/api/courses`, GET `/api/courses/:id`, GET `/api/courses/:id/holes`
- **Players**: GET `/api/players`, POST `/api/players`, GET `/api/players/:code`
- **Teams**: GET `/api/teams`, POST `/api/teams`, GET `/api/teams/:id/scorecard`
- **Scores**: PUT `/api/scores/:teamId/:holeNumber`

### Frontend Pages
- **Admin Dashboard**: Tournament management, player/team creation
- **Player Entry**: Code-based team access
- **Team Scorecard**: Real-time score tracking interface
- **Leaderboard**: Live tournament standings with WebSocket updates
- **404 Page**: Error handling for invalid routes

## Data Flow

1. **Tournament Setup**: Admin creates courses, adds players, forms teams
2. **Player Access**: Players enter unique codes to access their team scorecard
3. **Score Tracking**: Real-time score updates with automatic par calculation
4. **Data Persistence**: All changes immediately saved to in-memory storage
5. **Real-time Updates**: Scorecard refreshes every 30 seconds for live updates

## Recent Changes (January 2025)

✓ **Database Integration**: Successfully migrated from in-memory storage to PostgreSQL with Drizzle ORM
✓ **Live Leaderboard**: Added real-time leaderboard page with WebSocket support for live score updates
✓ **Navigation Enhancement**: Added proper navigation header with links to Admin Dashboard, Player Entry, and Leaderboard
✓ **Tournament Management**: Fixed Start Tournament functionality with proper validation and feedback
✓ **WebSocket Implementation**: Added real-time score broadcasting for live tournament tracking
✓ **Visual Improvements**: Added professional golf course cover photo (SVG) to homepage hero section
✓ **Course Expansion**: Added 4 famous golf courses with complete hole data:
  - Pebble Beach Golf Links
  - Augusta National Golf Club
  - St. Andrews Links (Old Course)
  - TPC Sawgrass (Stadium Course)
✓ **Branding Update**: Changed app name from "GolfScore Pro" to "Golf Tournament Pro"
✓ **Schema Fix**: Resolved validation issues with player creation and team formation
✓ **Enhanced UI**: Improved mobile responsiveness and golf-themed design
✓ **Admin Authentication Fixed**: Successfully resolved admin login issues with unified authentication system
✓ **Mobile-Friendly Admin Access**: Admin code 5159 now works on main Sign In page for mobile users
✓ **User Account Created**: Added Isaak Harder (Isaakiya26@live.com) with user access code 2408
✓ **Email Notification System**: Complete Gmail SMTP integration with automatic welcome emails
  - Professional HTML email templates with golf branding
  - Automatic welcome emails for new users with login codes
  - Email resend functionality for existing users
  - Free Gmail SMTP service (up to 500 emails/day)
  - Robust error handling and logging
✓ **Admin Access Control**: Proper security implementation for admin areas
  - Professional "For Admins Only" access denied pages
  - Prevents crashes when non-admin users access restricted areas
  - Clean error handling with user-friendly messages
  - Secure admin code 5159 authentication system
✓ **Deployment Ready**: All authentication, admin features, email system, and security working correctly
✓ **Enhanced Tournament Flow**: Complete user experience improvements with intuitive navigation
  - "Start Round" buttons for tournaments and teams in admin dashboard
  - Persistent "Scorecard" button in header for easy access to active team scoring
  - Smart user flow: automatic redirect to team scorecard when signing in with user codes
  - Visual improvements with clear instructions and workflow explanations
✓ **Stroke Selection Fixed**: Resolved critical scoring functionality where users couldn't select stroke counts
  - Enhanced editing permissions to allow proper access to scorecard
  - Added visual feedback for selected scores and edit permissions
  - Improved admin and user access controls for team scorecards
✓ **Home Page & Navigation Redesign**: Complete overhaul of user experience with centralized dashboard
  - Created comprehensive home page as the main entry point for all users
  - Added real-time statistics dashboard showing players, teams, tournaments, and courses
  - Integrated game rules and scoring information directly in the home page
  - Quick action buttons for all major features (Configuration, Courses, Leaderboard, Player Entry)
  - Renamed "Admin Dashboard" to "Configuration" for clearer purpose
  - All login flows now redirect to the home page for consistent user experience
✓ **Mobile Scorecard Experience**: Complete redesign for optimal golf course use
  - Larger touch targets (64px+) optimized for gloved hands and outdoor conditions
  - Swipe navigation between holes with visual feedback
  - Quick score buttons for Par, Birdie, Bogey, and Double Bogey
  - Sticky progress bar showing round completion and total score
  - Bottom action bar with large confirm/cancel buttons for one-handed operation
  - High contrast design with larger fonts for outdoor visibility
  - Collapsible full scorecard with enhanced mobile table layout
  - Recent scores tracking for undo functionality
  - Enhanced visual hierarchy focusing on current hole information
  - Added "Finish Round" button for tournament completion
✓ **Navigation Improvements**: Enhanced user experience with better organization
  - Renamed "Player Entry" to "Home" and moved to top of navigation
  - Clearer navigation order: Home → Courses → Leaderboard → Scorecard → Configuration
  - Consistent naming across desktop and mobile interfaces
✓ **Mobile Configuration Page**: Optimized admin dashboard for mobile devices
  - Compact card layouts with responsive design
  - Stacked content layout for mobile screens
  - Truncated text to prevent overflow
  - Adaptive button labels for different screen sizes
✓ **Admin Authentication Fix**: Resolved critical authentication issues
  - Fixed admin token persistence across server restarts
  - Added fallback authentication using admin password (1995)
  - Resolved "Admin authentication required" errors
  - Tournament management functions now work reliably
✓ **Critical Bug Fix**: Resolved team deletion cascade issue
  - Fixed bug where deleting one tournament would delete all teams on the same course
  - Enhanced database schema with proper tournament-team relationships
  - Implemented intelligent deletion logic that preserves teams from other tournaments
  - Added backward compatibility for existing teams without tournament associations
✓ **Individual Play Feature**: Complete personal golf round tracking system
  - Added database schema for individual rounds and scores with proper relationships
  - Implemented comprehensive storage interface for individual round operations
  - Created API endpoints for round management, scoring, and handicap calculation
  - Built Individual Play page with round creation, statistics, and history tracking
  - Developed Individual Scorecard page with mobile-optimized scoring interface
  - Added automatic handicap calculation using simplified USGA formula (requires 3+ rounds)
  - Integrated Individual Play navigation link in header (visible only to signed-in users)
  - Enhanced user experience with progress tracking and real-time score updates
✓ **Admin Account Changes**: Updated admin user configuration for better separation
  - Admin code: 5159 (Admin Isaak) for configuration and management access
  - Regular user code: 2408 (Isaak Harder) for Individual Play and normal user features
  - Fixed Individual Play authentication to work with both admin and regular users
  - Individual Play properly restricts admin access and prompts for regular user sign-in
✓ **Golf Ball Animated Spinner**: Implemented themed loading animations throughout the app
  - Created reusable GolfBallSpinner component with bouncing golf ball animation
  - Added GolfBallSpinnerWithText for loading states with custom messages
  - Built GolfLoadingScreen component for full-screen loading experiences
  - Integrated golf ball animations in Individual Play page and loading states
  - Enhanced user experience with professional golf-themed loading indicators
✓ **Individual Play White Screen Fix**: Resolved critical error handling in Individual Play feature
  - Fixed "rounds.filter is not a function" error by implementing proper async/await patterns
  - Added comprehensive error handling for API requests with fallback responses
  - Enhanced query functions to return empty arrays/null instead of crashing on errors
  - Resolved all database table naming conflicts with proper aliased references
  - Individual Play now loads properly without white screen crashes
✓ **Individual Scorecard Data Structure Fix**: Resolved API response structure mismatch
  - Fixed scorecard data references to match API response format {round: {...}}
  - Updated all scorecard.holes references to use correct holes array structure
  - Fixed round and course data access patterns throughout the component
  - Resolved navigation, hole counting, and completion status tracking
  - Moved "Show Scorecard" button to fixed bottom position for better mobile accessibility
✓ **Cancel Round Functionality**: Complete round cancellation system for Individual Play
  - Added DELETE endpoint `/api/rounds/:id` for removing individual rounds
  - Implemented cancel round buttons on both Individual Play and Individual Scorecard pages
  - Added confirmation dialogs with course name for safe deletion
  - Enhanced mobile-responsive design with centered button layouts
  - Proper error handling and user feedback with toast notifications
  - Automatic navigation back to Individual Play after cancellation
  - Database cleanup preserves integrity while allowing users to abandon rounds
✓ **Tournament Join System Redesign**: Streamlined tournament participation process
  - Removed tournament join section from courses page for cleaner interface
  - Renamed "Player Entry" to "Join Tournament" button on homepage
  - Created new `/join-tournament` page displaying all active tournaments
  - Added tournament cards with course details, dates, and access codes
  - Implemented tournament join API endpoint with proper validation
  - Mobile-optimized button text sizing for better phone display
  - Direct tournament selection replaces manual code entry system
✓ **Tournament Rules Update**: Modified rules to reflect actual tournament format
  - Replaced handicap system with Mulligan rule (one per nine holes)
  - Added unplayable ball rule (one club length movement, no closer to hole)
  - Updated homepage rules section to reflect new tournament format
  - Maintained best ball format and real-time scoring information
✓ **Auto-Save Scoring System**: Streamlined scoring workflow for better user experience
  - Scores automatically save when selected from number buttons or quick score buttons
  - Automatic navigation to next hole after score selection
  - Removed manual "Save Score" button requirement
  - Added "Save Round" button that appears at any time for progress saving
  - "Save Round" button completes and closes the round, navigating back to Individual Play
  - Enhanced visual feedback with different styling for completed vs. in-progress rounds
✓ **Enhanced Course Selection**: Improved course selection with scrollable list and search
  - Replaced dropdown with scrollable course list for better mobile experience
  - Added search functionality to find courses by name
  - Course cards show detailed information (par, yardage, rating)
  - Visual selection indicators with green highlighting for chosen course
  - Better accessibility and user experience for course browsing
✓ **Orchard View Golf Club Complete Setup**: Added authentic hole data from web research
  - Updated course information with correct yardage (6,138 yards) and rating (70.1)
  - Added complete hole-by-hole data for all 18 holes with authentic par, yardage, and handicap
  - Front 9: 2,879 yards, Par 36 with holes ranging from 142-520 yards
  - Back 9: 3,259 yards, Par 36 with holes ranging from 156-540 yards
  - Proper handicap ratings from 1 (hardest, hole 10) to 18 (easiest, hole 5)
  - Course now fully functional for Individual Play and tournament use
✓ **Games Played Feature**: Complete games history tracking system
  - Added "Games Played" button to homepage with teal styling
  - Created dedicated `/games-played` page showing all completed rounds across all users
  - Real-time statistics dashboard with total games, average score, and best score
  - Search functionality to filter by player name or course
  - Detailed game cards with player info, course details, scores, and completion dates
  - Mobile-responsive design with professional golf-themed styling
  - Displays only completed rounds with comprehensive score breakdown
✓ **Profile Picture System**: Complete user profile picture functionality
  - Updated database schema to include profilePicture field for users
  - Created reusable ProfilePicture component with Avatar UI from shadcn/ui
  - Profile pictures support base64 encoded images (JPG, PNG, GIF up to 2MB)
  - Built profile picture upload dialog with preview, validation, and error handling
  - Added updateUser API endpoint for profile picture management
  - Integrated profile pictures throughout the app (Games Played, Home page, etc.)
  - Created dedicated Profile page (/profile) with user statistics and picture editing
  - Added Profile navigation link in header for signed-in users
  - Mobile-optimized upload interface with proper file validation
✓ **Interactive Tournament Heat Map**: Real-time tournament visualization system
  - Created comprehensive heat map component showing player positions and performance zones
  - Added tournament selection with automatic active tournament detection
  - Two view modes: Player Positions (team locations on course) and Hole Performance (difficulty analysis)
  - Real-time data updates every 30 seconds for live tournament tracking
  - Visual performance indicators: excellent (green), good (blue), average (yellow), struggling (red)
  - Hole difficulty analysis based on average scores vs par
  - Mobile-responsive grid layout optimized for golf course visualization
  - Added Heat Map navigation link in header for easy access
  - Backend API endpoint for heat map data aggregation and analysis
✓ **Profile Picture System Removal**: Eliminated resource-intensive feature to reduce compute costs
  - Removed profilePicture column from users table to reduce database storage and payload sizes
  - Simplified ProfilePicture component to show user initials only (no upload functionality)
  - Removed profile picture upload API endpoints and related server processing
  - Reverted Express JSON payload limits back to default (from 5MB optimization)
  - Updated Profile page to remove photo editing features and compression guidance
  - Cost optimization: eliminates base64 image storage, reduces memory usage, and server processing

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connection**: Uses `@neondatabase/serverless` driver

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **TanStack Query**: Data fetching and caching

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development server and build tool
- **tsx**: TypeScript execution for Node.js
- **Replit Integration**: Runtime error overlay and cartographer

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` script

### Environment Configuration
- **Development**: Uses Vite dev server with Express middleware
- **Production**: Serves static files from Express with built frontend
- **Database**: Requires `DATABASE_URL` environment variable

### Scripts
- `dev`: Development server with hot reload
- `build`: Production build for both frontend and backend
- `start`: Production server
- `check`: TypeScript compilation check
- `db:push`: Database schema migration

### Deployment Options
**Replit (Current Development)**
- Includes Replit-specific integrations for development
- Real-time collaboration and instant deployment

**Render (Production Ready)**
- Free tier available with PostgreSQL database
- Automatic builds from GitHub repository
- Custom domains and SSL included
- See `DEPLOY_RENDER.md` for detailed instructions

### Deployment Considerations
- Uses PostgreSQL dialect with Drizzle ORM
- Supports both development and production modes
- Static file serving configured for production builds
- Email notifications require Gmail SMTP configuration