# Game Tracker Development Guide

## Project Overview
A modern, fast game tracking web app built with Vue 3, Vite, and Tailwind CSS. Features responsive design for mobile and desktop, dark mode support, and comprehensive game library management.

## Tech Stack
- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite (for fast development and optimized builds)
- **Styling**: Tailwind CSS with custom theme colors
- **State Management**: Pinia stores
- **Routing**: Vue Router 4
- **Icons**: Heroicons
- **Deployment**: Static site ready (Vercel, Netlify, etc.)

## Key Features
- Game library management (add, edit, delete games)
- Progress tracking with visual progress bars
- 5-star rating system
- Statistics dashboard with detailed analytics
- Dark/light theme toggle with system preference detection
- Mobile-first responsive design
- Search and filter functionality
- Platform and genre tracking
- Playtime tracking

## Development Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure
```
src/
├── components/          # Reusable Vue components
│   ├── GameCard.vue    # Individual game card with progress tracking
│   ├── AddGameModal.vue # Modal for adding new games
│   ├── EditGameModal.vue # Modal for editing existing games
│   └── Navigation.vue  # Site navigation with mobile menu
├── views/              # Page components
│   ├── Home.vue        # Dashboard with overview stats
│   ├── Library.vue     # Game library with search/filter
│   └── Stats.vue       # Detailed statistics dashboard
├── stores/             # Pinia state management
│   ├── games.js        # Game data and operations
│   └── theme.js        # Theme management (dark/light mode)
├── App.vue             # Root component with router transitions
├── main.js             # App entry point
└── style.css           # Global styles and Tailwind components
```

## Important Implementation Notes
- Uses ES modules throughout (package.json has "type": "module")
- PostCSS and ESLint configs use ES module syntax (export default)
- Tailwind config includes custom color scheme with primary and dark variants
- Images use Unsplash placeholder URLs with random seeds
- Component-based architecture with reusable modal components
- State management with Pinia for reactive data
- Responsive design with mobile-first approach
- Smooth animations and transitions using CSS and Vue transitions

## Performance Optimizations
- Lazy loading for images
- Component-level code splitting
- Vendor chunk separation in build
- Optimized bundle sizes with Vite
- CSS purging with Tailwind

## Browser Support
- Modern browsers supporting ES modules
- Mobile and desktop responsive
- Touch-friendly interface for mobile devices