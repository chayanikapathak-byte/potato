# Deploying to Vercel

This guide explains how to deploy the Game Tracker app to Vercel with serverless API functions.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git repository pushed to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Push to Git Repository

Make sure all your changes are committed and pushed to your Git repository.

```bash
git add .
git commit -m "Add Vercel serverless functions"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect it's a Vite project

### 3. Configure Build Settings

Vercel should automatically detect the settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` or `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy

Click "Deploy" and Vercel will:
- Install dependencies
- Build your frontend
- Deploy your API functions
- Provide a live URL

## Important Notes

### Database Limitation

⚠️ **The current setup uses SQLite which does NOT work in Vercel production** because serverless functions have a read-only filesystem.

For production, you need to replace the database with one of:

1. **Vercel Postgres** (Recommended - integrated with Vercel)
2. **PlanetScale** (MySQL-compatible)
3. **Supabase** (PostgreSQL with built-in auth)
4. **Railway** (PostgreSQL/MySQL)

### Local Development vs Production

- **Local Development**: Uses SQLite database (works perfectly)
- **Vercel Production**: Uses in-memory storage (data resets on each deployment)

To upgrade to a real database:

1. Choose a database provider (Vercel Postgres recommended)
2. Update `/api/_db.js` to use the database connection
3. Add database credentials to Vercel environment variables

### API Routes

The API is available at `/api/*`:

- `/api/auth/signup` - Create account
- `/api/auth/login` - Login
- `/api/auth/me` - Get user info
- `/api/profile` - Get/update profile
- `/api/games` - Get/create games
- `/api/games/[id]` - Update/delete game
- `/api/steam/search` - Search Steam games
- `/api/steam/game/[appId]` - Get Steam game details

### Environment Variables

No environment variables are required for basic functionality. The app works out of the box!

Optional variables:
- `NODE_ENV` - Set to "production" in Vercel (automatic)

### CORS

CORS is configured to allow all origins. For production, you may want to restrict this to your domain only.

## Testing Deployment

After deployment, test these features:

1. ✅ Sign up with new account
2. ✅ Login with credentials
3. ✅ Search Steam games
4. ✅ Add games to library
5. ✅ Update game status
6. ✅ View statistics

## Troubleshooting

### 404 on API Routes

If you get 404 errors on `/api/*` routes:
1. Check that `vercel.json` is in the root directory
2. Verify API functions are in `/api/` folder
3. Check Vercel deployment logs

### Data Not Persisting

This is expected with the in-memory database. Upgrade to Vercel Postgres or another database provider.

### Build Fails

1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Verify build command is correct

## Upgrading to Vercel Postgres

1. In Vercel dashboard, go to Storage → Create Database → Postgres
2. Install Vercel Postgres SDK: `npm install @vercel/postgres`
3. Update `/api/_db.js` to use Vercel Postgres
4. Vercel will automatically inject database credentials

Example for Vercel Postgres:

```javascript
import { sql } from '@vercel/postgres';

export const dbHelpers = {
  getUserByUsername: async (username) => {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    return rows[0];
  },
  // ... other methods
};
```

## Local Development

For local development with the serverless API structure:

```bash
# Start both frontend and backend
npm run dev:all

# Or separately:
npm run dev      # Frontend on port 5173
npm run server   # Backend on port 3001
```

The Vite dev server proxies `/api/*` requests to the backend automatically.
