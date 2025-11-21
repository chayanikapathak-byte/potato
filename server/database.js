import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'gametracker.db'));

db.pragma('journal_mode = WAL');

function initDatabase() {
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
}

initDatabase();

export default db;
