# Game Tracker - Vercel Deployment Ready

A modern, full-stack game tracking web application built with Vue 3 and serverless architecture, ready to deploy on Vercel.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev:all
```

Visit http://localhost:5173 to use the app.

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Click "Deploy"

That's it! Vercel automatically detects the configuration.

## ✨ Features

- 🎮 Track games across multiple platforms
- 🔍 Search and import from Steam (no API key needed)
- 📊 View statistics and completion rates
- 🎨 Customizable themes and profiles
- 📱 Fully responsive design
- ⚡ Fast serverless backend
- 🌐 Ready for Vercel deployment

## 🏗️ Architecture

### Frontend
- **Vue 3** with Composition API
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **Pinia** for state management

### Backend
- **Serverless Functions** (Vercel compatible)
- **SQLite** for local development
- **In-memory DB** for Vercel (upgradable to Vercel Postgres)
- **No JWT** - simplified authentication

### API Structure
```
/api
├── auth/
│   ├── signup.js      # Create account
│   ├── login.js       # User login
│   └── me.js          # Get user info
├── profile.js         # Profile management
├── games/
│   ├── index.js       # List/create games
│   └── [id].js        # Update/delete games
└── steam/
    ├── search.js      # Search Steam games
    └── game/[appId].js # Get game details
```

## 🔧 Configuration

### Environment Variables

No environment variables are required! The app works out of the box.

For production database (optional):
```
DATABASE_URL=your-postgres-connection-string
```

### Vercel Configuration

The `vercel.json` file is already configured:
- Routes frontend to static files
- Routes `/api/*` to serverless functions
- Optimized for production

## 📦 Project Structure

```
game-tracker/
├── api/               # Serverless API functions
│   ├── _db.js        # Database helper
│   ├── auth/         # Authentication endpoints
│   ├── games/        # Game management
│   ├── profile.js    # Profile endpoint
│   └── steam/        # Steam API proxy
├── src/              # Vue frontend
│   ├── components/   # UI components
│   ├── stores/       # Pinia stores
│   ├── views/        # Page components
│   └── utils/        # Helper functions
├── server/           # Local dev server
│   └── api-server.js # Express wrapper
├── vercel.json       # Vercel configuration
└── vite.config.js    # Vite + API proxy
```

## 🎯 API Endpoints

All endpoints are at `/api/*`:

### Authentication
```
POST /api/auth/signup
Body: { username, password }
Returns: { success: true, user: {...} }

POST /api/auth/login
Body: { username, password }
Returns: { success: true, user: {...} }

GET /api/auth/me?userId=X
Returns: { id, username, created_at }
```

### Games
```
GET /api/games?userId=X
POST /api/games (userId in body)
PUT /api/games/[id] (userId in body)
DELETE /api/games/[id]?userId=X
```

### Profile
```
GET /api/profile?userId=X
PUT /api/profile (userId in body)
```

### Steam (No Auth Required)
```
GET /api/steam/search?query=game-name
GET /api/steam/game/[appId]
```

## 🗄️ Database

### Local Development
- Uses **SQLite** with persistent storage
- Database file: `server/gametracker.db`
- Automatically created on first run

### Vercel Production
- Uses **in-memory storage** (data doesn't persist)
- To persist data, upgrade to **Vercel Postgres**:
  1. Add Postgres database in Vercel dashboard
  2. Update `/api/_db.js` to use Postgres
  3. Install `@vercel/postgres` package

## 🔐 Authentication

Simplified authentication without JWT:
- User credentials validated on login/signup
- User object stored in localStorage
- User ID sent with each request
- Perfect for prototype/demo, upgrade for production

## 🎮 Steam Integration

Uses Steam's **public API** - no API key required:
- Search games: `https://steamcommunity.com/actions/SearchApps/`
- Game details: `https://store.steampowered.com/api/appdetails`
- No rate limits on public endpoints
- Works out of the box

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start frontend (port 5173)
npm run server       # Start backend (port 3001)
npm run dev:all      # Start both servers
npm run build        # Build for production
npm run vercel-build # Build for Vercel
npm run preview      # Preview production build
npm run lint         # Lint code
```

### Adding Features

1. **New API Endpoint**: Create file in `/api/`
2. **New Page**: Add Vue component in `/src/views/`
3. **New Component**: Add to `/src/components/`
4. **State Management**: Update Pinia stores in `/src/stores/`

## 📝 Important Notes

### For Production Use

1. **Database**: Migrate from in-memory to Vercel Postgres
2. **Authentication**: Consider adding JWT or sessions
3. **CORS**: Restrict to your domain only
4. **Rate Limiting**: Add rate limits to API endpoints
5. **Error Tracking**: Add Sentry or similar
6. **Analytics**: Add Vercel Analytics

### Known Limitations

- In-memory database on Vercel (data resets on redeploy)
- No JWT authentication (users can fake requests)
- CORS allows all origins
- No rate limiting

These are intentional simplifications for quick deployment. Upgrade for production use.

## 🐛 Troubleshooting

### 404 on API Routes
- Verify `vercel.json` exists
- Check API files are in `/api/` folder
- Review Vercel deployment logs

### Data Not Persisting
- Expected with in-memory DB
- Upgrade to Vercel Postgres for persistence

### Steam Search Not Working
- Steam API might rate limit (rare)
- Try different search terms
- Check internet connection

### Build Fails on Vercel
- Check Vercel build logs
- Verify `package.json` dependencies
- Ensure Node version compatibility

## 📚 Documentation

- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide
- `CHANGES.md` - Recent changes and migration notes
- `DEVELOPMENT.md` - Development guidelines

## 🤝 Contributing

This is a prototype/demo app. For production use:
1. Migrate to persistent database
2. Add proper authentication
3. Implement rate limiting
4. Add comprehensive error handling

## 📄 License

MIT

## 🙏 Credits

- Steam for public API access
- Vercel for serverless hosting
- Vue.js and Vite communities

---

**Ready to deploy?** Just push to Git and import to Vercel! 🚀
