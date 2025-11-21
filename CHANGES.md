# Recent Changes - Vercel Deployment Support

## Summary
Added support for deploying both frontend and backend to Vercel using serverless functions. Simplified authentication by removing JWT tokens.

## Key Changes

### 1. Backend Structure
- ✅ Created `/api/` folder with Vercel serverless functions
- ✅ Each API endpoint is now a separate serverless function
- ✅ Added `api-server.js` for local development (wraps serverless functions)
- ✅ Database helper (`_db.js`) supports both SQLite (local) and in-memory (Vercel)

### 2. Authentication Simplified
- ❌ Removed JWT token authentication
- ✅ User credentials validated, user object returned on login/signup
- ✅ User data stored in localStorage
- ✅ User ID sent with each API request (no more Bearer tokens)

### 3. API Changes
- **Old**: `http://localhost:3001/api/*`
- **New**: `/api/*` (works both locally and on Vercel)
- Frontend now uses relative API paths
- Vite dev server proxies `/api/*` to backend

### 4. Configuration Files
- `vercel.json` - Vercel deployment configuration
- `vite.config.js` - Added API proxy for local dev
- `package.json` - Updated server script, added vercel-build

### 5. Steam API
- ✅ Confirmed: No API key needed for public search and game details
- Uses Steam's public storefront API
- No rate limiting on community search endpoint

## API Endpoints

All endpoints are now available at `/api/*`:

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me?userId=X` - Get user info

### Profile
- `GET /api/profile?userId=X` - Get profile
- `PUT /api/profile` - Update profile (userId in body)

### Games
- `GET /api/games?userId=X` - List games
- `POST /api/games` - Add game (userId in body)
- `PUT /api/games/[id]` - Update game (userId in body)
- `DELETE /api/games/[id]?userId=X` - Delete game

### Steam
- `GET /api/steam/search?query=X` - Search games (no auth needed)
- `GET /api/steam/game/[appId]` - Get game details (no auth needed)

## Request Format Changes

### Before (with JWT)
```javascript
headers: {
  'Authorization': 'Bearer <token>'
}
```

### After (without JWT)
```javascript
// In query params or request body
{ userId: 123 }
```

The auth store automatically adds userId to all requests.

## Local Development

```bash
npm run dev:all    # Start both frontend and backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API requests from frontend are proxied to backend

## Vercel Deployment

```bash
# Push to Git
git add .
git commit -m "Add Vercel support"
git push

# Deploy to Vercel
# Import project at vercel.com/new
```

**Important**: The current database is in-memory on Vercel (data doesn't persist). For production, upgrade to Vercel Postgres or another cloud database.

## Files Added
- `/api/` - Serverless function handlers
- `/api/_db.js` - Database helper
- `/api/auth/signup.js`, `login.js`, `me.js`
- `/api/profile.js`
- `/api/games/index.js`, `[id].js`
- `/api/steam/search.js`, `game/[appId].js`
- `server/api-server.js` - Local dev server
- `vercel.json` - Vercel config
- `.vercelignore` - Files to exclude from deployment
- `VERCEL_DEPLOYMENT.md` - Deployment guide
- `CHANGES.md` - This file

## Files Modified
- `src/stores/auth.js` - Removed JWT, use localStorage
- `src/utils/steam.js` - Use relative API URL
- `vite.config.js` - Added API proxy
- `package.json` - Updated scripts

## Files Deprecated
- `server/server.js` - Original Express server (can be removed)

## Migration Checklist

If you had existing data:

1. ✅ Users will need to re-register (no JWT tokens)
2. ✅ Database works locally (SQLite)
3. ⚠️ Database doesn't persist on Vercel (in-memory only)
4. 🔄 To persist data on Vercel, migrate to Vercel Postgres

## Testing

All endpoints have been tested and work correctly:
- ✅ User signup
- ✅ User login
- ✅ Add/update/delete games
- ✅ Profile management
- ✅ Steam search
- ✅ Steam game details

Run `./test-api.sh` to test all endpoints.
