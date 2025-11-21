# Game Tracker

A modern, fast, and responsive web application for tracking your video game library and progress. Built with Vue 3, Vite, Express, and SQLite with full user authentication and Steam Web API integration.

## Features

- 🎮 **Game Library Management**: Add, edit, and organize your video game collection
- 🔐 **User Authentication**: Secure signup/login with username and password
- 🎨 **Profile Customization**: Customize your profile with avatar, banner, bio, and theme colors
- 🔍 **Steam Integration**: Search and add games directly from Steam's library
- 📊 **Progress Tracking**: Track your progress through games with visual progress bars
- ⭐ **Rating System**: Rate games with a 5-star system
- 📈 **Statistics Dashboard**: View detailed stats about your gaming habits
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Mobile Responsive**: Optimized for both mobile and desktop experiences
- ⚡ **Blazing Fast**: Built with Vite for instant development and optimized builds
- 🎨 **Modern UI**: Clean, minimalist design with smooth animations
- 💾 **SQLite Database**: Persistent data storage for users and games

## Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Heroicons
- **HTTP Client**: Axios

### Backend
- **Server**: Express.js
- **Database**: SQLite3 with better-sqlite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API Integration**: Steam Web API

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values:
   - `PORT`: Server port (default: 3001)
   - `JWT_SECRET`: Secret key for JWT tokens (change in production!)
   - `STEAM_API_KEY`: Optional - Steam API key for enhanced features

3. **Start both server and client**
   ```bash
   npm run dev:all
   ```
   
   Or run them separately:
   ```bash
   # Terminal 1 - Backend server
   npm run server
   
   # Terminal 2 - Frontend dev server
   npm run dev
   ```

4. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

5. **Create an account**
   Navigate to the signup page and create your account to start tracking games!

## Project Structure

```
├── server/                 # Backend server
│   ├── database.js        # SQLite database setup
│   ├── server.js          # Express server with API endpoints
│   └── gametracker.db     # SQLite database (auto-generated)
├── src/
│   ├── components/        # Reusable Vue components
│   │   ├── GameCard.vue
│   │   ├── AddGameModal.vue
│   │   ├── EditGameModal.vue
│   │   ├── SteamSearchModal.vue
│   │   ├── EditProfileModal.vue
│   │   ├── AvatarModal.vue
│   │   ├── BannerModal.vue
│   │   └── Navigation.vue
│   ├── views/             # Page components
│   │   ├── Home.vue
│   │   ├── Library.vue
│   │   ├── Stats.vue
│   │   ├── Login.vue
│   │   ├── Signup.vue
│   │   └── Profile.vue
│   ├── stores/            # Pinia state management
│   │   ├── games.js       # Game data and API calls
│   │   ├── auth.js        # Authentication state
│   │   ├── profile.js     # User profile management
│   │   └── theme.js       # Theme management
│   ├── utils/             # Utility functions
│   │   └── steam.js       # Steam API helpers
│   ├── App.vue
│   ├── main.js
│   └── style.css
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

### Games
- `GET /api/games` - Get user's games (requires auth)
- `POST /api/games` - Add a new game (requires auth)
- `PUT /api/games/:id` - Update a game (requires auth)
- `DELETE /api/games/:id` - Delete a game (requires auth)

### Steam API
- `GET /api/steam/search?query=<game>` - Search Steam games
- `GET /api/steam/game/:appId` - Get Steam game details

## Features Overview

### User Authentication
- Secure signup and login with username/password
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes requiring authentication
- Persistent sessions with localStorage

### Profile Customization
- Upload custom avatar and banner images
- Write a personal bio
- Choose from 10 theme colors
- View gaming statistics on profile
- Public profile URL (username-based)

### Steam Integration
- Search thousands of games from Steam's library
- Auto-populate game details (cover art, genres, description)
- Direct integration with Steam Web API
- Add games with one click

### Game Management
- Add games manually or from Steam
- Track multiple platforms per game
- Custom cover images and genres
- Notes and personal ratings
- Progress tracking with percentages
- Playtime logging
- Status management (Backlog/Playing/Completed)

### Progress Tracking
- Visual progress bars on game cards
- Automatic completion detection
- Started and completed date tracking
- Playtime accumulation
- Status-based filtering

### Statistics Dashboard
- Overview stats (total games, completion rate, playtime)
- Platform distribution breakdown
- Genre analysis
- Top-rated games display
- Recent completions tracking
- Status breakdown with visual charts

## Database Schema

### users
- `id`: Primary key
- `username`: Unique username
- `auth_key`: Hashed password
- `created_at`: Account creation timestamp

### user_profiles
- `id`: Primary key
- `user_id`: Foreign key to users
- `display_name`: Display name
- `bio`: User bio
- `avatar_url`: Avatar image URL
- `theme_color`: Preferred theme color
- `banner_image`: Profile banner URL

### user_games
- `id`: Primary key
- `user_id`: Foreign key to users
- `steam_app_id`: Steam app ID (optional)
- `title`: Game title
- `platform`: Gaming platform
- `status`: backlog/playing/completed
- `progress`: Progress percentage
- `rating`: 1-5 star rating
- `cover_image`: Cover art URL
- `genres`: JSON array of genres
- `playtime`: Hours played
- `started_date`: Date started
- `completed_date`: Date completed
- `notes`: Personal notes

## Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production assets.

## Deployment

### Backend (Server)
Deploy to services like:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

### Frontend
Deploy to static hosting:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

**Important**: Update the `API_URL` in frontend stores to point to your production backend URL.

## Security Notes

- Always change `JWT_SECRET` in production
- Use HTTPS in production
- Set proper CORS origins in production
- Keep `.env` file secure and never commit it
- Regularly update dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
