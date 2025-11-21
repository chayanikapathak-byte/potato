# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### First Time Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your settings (optional Steam API key)

### Running the Application

#### Option 1: Run both servers together (recommended)
```bash
npm run dev:all
```

This starts:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

#### Option 2: Run servers separately

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### Available Commands

- `npm run dev` - Start Vite dev server (frontend only)
- `npm run server` - Start Express server (backend only)
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Architecture

### Backend (Express + SQLite)

**Location**: `server/`

- `server.js` - Main Express application with all API routes
- `database.js` - SQLite database initialization and schema

**Key Features**:
- JWT-based authentication
- RESTful API endpoints
- Steam Web API proxy
- SQLite with better-sqlite3 for performance

### Frontend (Vue 3 + Vite)

**Location**: `src/`

**Stores** (`src/stores/`):
- `auth.js` - Authentication state and API calls
- `games.js` - Game data management and API calls
- `profile.js` - User profile management
- `theme.js` - Dark/light theme toggle

**Views** (`src/views/`):
- `Login.vue` - Login page
- `Signup.vue` - Registration page
- `Home.vue` - Dashboard with quick stats
- `Library.vue` - Full game library with search/filter
- `Stats.vue` - Detailed statistics page
- `Profile.vue` - User profile customization

**Components** (`src/components/`):
- `Navigation.vue` - Site navigation with auth
- `GameCard.vue` - Individual game display
- `AddGameModal.vue` - Add game form with Steam search
- `EditGameModal.vue` - Edit game details
- `SteamSearchModal.vue` - Steam game search interface
- `EditProfileModal.vue` - Profile editing
- `AvatarModal.vue` - Avatar upload
- `BannerModal.vue` - Banner image upload

## Authentication Flow

1. User signs up → Creates user + profile in database
2. User logs in → Receives JWT token
3. Token stored in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Backend validates token for protected routes
6. Token expires after 30 days

## Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  auth_key TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme_color TEXT DEFAULT '#6366f1',
  banner_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

### user_games
```sql
CREATE TABLE user_games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  steam_app_id INTEGER,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'backlog',
  progress INTEGER DEFAULT 0,
  rating INTEGER,
  cover_image TEXT,
  genres TEXT,
  playtime INTEGER DEFAULT 0,
  started_date TEXT,
  completed_date TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user (protected)

### Profile
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update profile (protected)

### Games
- `GET /api/games` - List user's games (protected)
- `POST /api/games` - Add new game (protected)
- `PUT /api/games/:id` - Update game (protected)
- `DELETE /api/games/:id` - Delete game (protected)

### Steam
- `GET /api/steam/search?query=<term>` - Search Steam games
- `GET /api/steam/game/:appId` - Get game details

## Steam Web API Integration

The app uses Steam's public APIs:
- **Search**: `https://steamcommunity.com/actions/SearchApps/`
- **Details**: `https://store.steampowered.com/api/appdetails`

No Steam API key is required for basic functionality. An optional Steam Web API key can be added for potential future enhancements.

## Adding New Features

### Adding a new API endpoint:

1. Add route in `server/server.js`:
   ```javascript
   app.get('/api/your-endpoint', authenticateToken, (req, res) => {
     // Your logic here
   });
   ```

2. Add corresponding function in appropriate store (e.g., `src/stores/games.js`)

3. Use the function in your Vue components

### Adding a new page:

1. Create view component in `src/views/`
2. Add route in `src/main.js`
3. Add navigation link in `src/components/Navigation.vue`

### Adding a new modal:

1. Create component in `src/components/`
2. Import and use in parent component with `v-if` for visibility

## Code Style

- Use Vue 3 Composition API (`<script setup>`)
- Follow existing Tailwind CSS utility patterns
- Use Pinia stores for state management
- Use async/await for API calls
- Handle errors gracefully with try/catch

## Testing Locally

1. Start the servers: `npm run dev:all`
2. Create a test account at `http://localhost:5173/signup`
3. Test all features:
   - Add games manually
   - Search and add from Steam
   - Update game progress
   - Customize profile
   - View statistics

## Troubleshooting

### Database is locked
- Stop all running server instances
- Delete `server/gametracker.db` and restart

### CORS errors
- Ensure backend is running on port 3001
- Check CORS configuration in `server/server.js`

### Steam search not working
- Check network tab for API errors
- Steam's API occasionally has rate limits

### Authentication issues
- Clear localStorage in browser DevTools
- Check JWT_SECRET is set in `.env`
- Verify token is being sent in request headers

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
STEAM_API_KEY=optional-steam-api-key
```

**Never commit `.env` file to version control!**

## Performance Tips

- Database uses WAL mode for better concurrent access
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Images are lazy-loaded
- Routes are automatically code-split by Vite

## Security Best Practices

1. Always hash passwords (using bcryptjs)
2. Use JWT for stateless authentication
3. Validate all user inputs on the server
4. Use HTTPS in production
5. Keep dependencies updated
6. Set proper CORS origins in production
7. Use environment variables for secrets

## Deployment Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Update API_URL in frontend stores to production URL
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure environment variables on hosting platform
- [ ] Test all authentication flows
- [ ] Test Steam API integration

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
