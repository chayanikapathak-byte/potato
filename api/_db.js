// Simple in-memory database for Vercel serverless functions
// In production, replace this with Vercel Postgres, PlanetScale, or similar

let users = [];
let profiles = [];
let games = [];

let userIdCounter = 1;
let profileIdCounter = 1;
let gameIdCounter = 1;

// For local development, try to use SQLite if available
let db = null;
let useSqlite = false;

try {
  if (process.env.NODE_ENV !== 'production') {
    const Database = await import('better-sqlite3').then(m => m.default);
    const { fileURLToPath } = await import('url');
    const { dirname, join } = await import('path');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    db = new Database(join(__dirname, '../server/gametracker.db'));
    db.pragma('journal_mode = WAL');
    
    // Initialize database
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        auth_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
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

      CREATE TABLE IF NOT EXISTS user_games (
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

      CREATE INDEX IF NOT EXISTS idx_user_games_user_id ON user_games(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
    
    useSqlite = true;
    console.log('Using SQLite database');
  }
} catch (error) {
  console.log('Using in-memory database (production mode)');
}

export const dbHelpers = {
  // User methods
  getUserByUsername: (username) => {
    if (useSqlite && db) {
      return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    }
    return users.find(u => u.username === username);
  },
  
  getUserById: (id) => {
    if (useSqlite && db) {
      return db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(id);
    }
    const user = users.find(u => u.id === id);
    if (user) {
      const { auth_key, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
  
  createUser: (username, hashedPassword) => {
    if (useSqlite && db) {
      const result = db.prepare('INSERT INTO users (username, auth_key) VALUES (?, ?)').run(username, hashedPassword);
      db.prepare('INSERT INTO user_profiles (user_id, display_name) VALUES (?, ?)').run(result.lastInsertRowid, username);
      return result.lastInsertRowid;
    }
    
    const userId = userIdCounter++;
    users.push({
      id: userId,
      username,
      auth_key: hashedPassword,
      created_at: new Date().toISOString()
    });
    
    const profileId = profileIdCounter++;
    profiles.push({
      id: profileId,
      user_id: userId,
      display_name: username,
      bio: null,
      avatar_url: null,
      theme_color: '#6366f1',
      banner_image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    return userId;
  },
  
  // Profile methods
  getProfile: (userId) => {
    if (useSqlite && db) {
      return db.prepare(`
        SELECT 
          p.*,
          u.username
        FROM user_profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
      `).get(userId);
    }
    
    const profile = profiles.find(p => p.user_id === userId);
    if (profile) {
      const user = users.find(u => u.id === userId);
      return {
        ...profile,
        username: user?.username
      };
    }
    return null;
  },
  
  updateProfile: (userId, data) => {
    if (useSqlite && db) {
      db.prepare(`
        UPDATE user_profiles 
        SET display_name = ?,
            bio = ?,
            avatar_url = ?,
            theme_color = ?,
            banner_image = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(data.display_name, data.bio, data.avatar_url, data.theme_color, data.banner_image, userId);
      
      return db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(userId);
    }
    
    const profile = profiles.find(p => p.user_id === userId);
    if (profile) {
      Object.assign(profile, {
        ...data,
        updated_at: new Date().toISOString()
      });
      return profile;
    }
    return null;
  },
  
  // Game methods
  getGames: (userId) => {
    if (useSqlite && db) {
      const games = db.prepare(`
        SELECT * FROM user_games 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `).all(userId);
      
      return games.map(game => ({
        ...game,
        genres: game.genres ? JSON.parse(game.genres) : []
      }));
    }
    
    return games
      .filter(g => g.user_id === userId)
      .map(game => ({
        ...game,
        genres: game.genres || []
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  createGame: (userId, gameData) => {
    if (useSqlite && db) {
      const result = db.prepare(`
        INSERT INTO user_games (
          user_id, steam_app_id, title, platform, status, progress, rating,
          cover_image, genres, playtime, started_date, completed_date, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        gameData.steam_app_id || null,
        gameData.title,
        gameData.platform,
        gameData.status || 'backlog',
        gameData.progress || 0,
        gameData.rating || null,
        gameData.cover_image || null,
        gameData.genres ? JSON.stringify(gameData.genres) : '[]',
        gameData.playtime || 0,
        gameData.started_date || null,
        gameData.completed_date || null,
        gameData.notes || null
      );
      
      const game = db.prepare('SELECT * FROM user_games WHERE id = ?').get(result.lastInsertRowid);
      return {
        ...game,
        genres: game.genres ? JSON.parse(game.genres) : []
      };
    }
    
    const gameId = gameIdCounter++;
    const game = {
      id: gameId,
      user_id: userId,
      steam_app_id: gameData.steam_app_id || null,
      title: gameData.title,
      platform: gameData.platform,
      status: gameData.status || 'backlog',
      progress: gameData.progress || 0,
      rating: gameData.rating || null,
      cover_image: gameData.cover_image || null,
      genres: gameData.genres || [],
      playtime: gameData.playtime || 0,
      started_date: gameData.started_date || null,
      completed_date: gameData.completed_date || null,
      notes: gameData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    games.push(game);
    return game;
  },
  
  getGameById: (gameId, userId) => {
    if (useSqlite && db) {
      const game = db.prepare('SELECT * FROM user_games WHERE id = ? AND user_id = ?').get(gameId, userId);
      if (game) {
        return {
          ...game,
          genres: game.genres ? JSON.parse(game.genres) : []
        };
      }
      return null;
    }
    
    return games.find(g => g.id === parseInt(gameId) && g.user_id === userId);
  },
  
  updateGame: (gameId, userId, gameData) => {
    if (useSqlite && db) {
      db.prepare(`
        UPDATE user_games
        SET title = ?,
            platform = ?,
            status = ?,
            progress = ?,
            rating = ?,
            cover_image = ?,
            genres = ?,
            playtime = ?,
            started_date = ?,
            completed_date = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(
        gameData.title,
        gameData.platform,
        gameData.status,
        gameData.progress,
        gameData.rating,
        gameData.cover_image,
        gameData.genres ? JSON.stringify(gameData.genres) : '[]',
        gameData.playtime,
        gameData.started_date,
        gameData.completed_date,
        gameData.notes,
        gameId,
        userId
      );
      
      const updatedGame = db.prepare('SELECT * FROM user_games WHERE id = ?').get(gameId);
      return {
        ...updatedGame,
        genres: updatedGame.genres ? JSON.parse(updatedGame.genres) : []
      };
    }
    
    const game = games.find(g => g.id === parseInt(gameId) && g.user_id === userId);
    if (game) {
      Object.assign(game, {
        ...gameData,
        genres: gameData.genres || [],
        updated_at: new Date().toISOString()
      });
      return game;
    }
    return null;
  },
  
  deleteGame: (gameId, userId) => {
    if (useSqlite && db) {
      const result = db.prepare('DELETE FROM user_games WHERE id = ? AND user_id = ?').run(gameId, userId);
      return result.changes > 0;
    }
    
    const index = games.findIndex(g => g.id === parseInt(gameId) && g.user_id === userId);
    if (index !== -1) {
      games.splice(index, 1);
      return true;
    }
    return false;
  }
};
