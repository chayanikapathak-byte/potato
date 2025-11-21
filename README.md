# Game Tracker

A modern, fast, and responsive web application for tracking your video game library and progress. Built with Vue 3, Vite, and Tailwind CSS for a smooth and snappy user experience on both mobile and desktop devices.

## Features

- 🎮 **Game Library Management**: Add, edit, and organize your video game collection
- 📊 **Progress Tracking**: Track your progress through games with visual progress bars
- ⭐ **Rating System**: Rate games with a 5-star system
- 📈 **Statistics Dashboard**: View detailed stats about your gaming habits
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Mobile Responsive**: Optimized for both mobile and desktop experiences
- ⚡ **Blazing Fast**: Built with Vite for instant development and optimized builds
- 🎨 **Modern UI**: Clean, minimalist design with smooth animations

## Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Heroicons
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── GameCard.vue    # Individual game card component
│   ├── AddGameModal.vue # Add game modal
│   ├── EditGameModal.vue # Edit game modal
│   └── Navigation.vue  # Site navigation
├── views/              # Page components
│   ├── Home.vue        # Dashboard/home page
│   ├── Library.vue     # Game library view
│   └── Stats.vue       # Statistics dashboard
├── stores/             # Pinia state management
│   ├── games.js        # Game data store
│   └── theme.js        # Theme management
├── App.vue             # Root component
├── main.js             # App entry point
└── style.css           # Global styles
```

## Features Overview

### Game Management
- Add games to your library with details like title, platform, genres, and cover images
- Edit existing games to update progress, ratings, and notes
- Delete games from your library
- Search and filter your game collection

### Progress Tracking
- Track completion percentage for games you're currently playing
- Visual progress bars on game cards
- Status indicators (Backlog, Playing, Completed)
- Playtime tracking

### Statistics
- Overview stats showing total games, completion rate, and playtime
- Platform distribution breakdown
- Genre analysis
- Top-rated games display
- Recent completions tracking

### User Experience
- Dark/light theme toggle with system preference detection
- Smooth animations and transitions
- Mobile-first responsive design
- Fast navigation with lazy loading
- Keyboard shortcuts support

## Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production assets ready for deployment.

## Deployment

This app can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect Git
- **GitHub Pages**: Use GitHub Actions to deploy
- **Firebase Hosting**: Deploy with the Firebase CLI

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).