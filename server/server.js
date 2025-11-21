import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const STEAM_API_KEY = process.env.STEAM_API_KEY || '';

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (username, auth_key) VALUES (?, ?)').run(username, hashedPassword);
    
    db.prepare('INSERT INTO user_profiles (user_id, display_name) VALUES (?, ?)').run(result.lastInsertRowid, username);

    const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: result.lastInsertRowid,
        username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.auth_key);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const profile = db.prepare(`
      SELECT 
        p.*,
        u.username
      FROM user_profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `).get(req.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/profile', authenticateToken, (req, res) => {
  try {
    const { display_name, bio, avatar_url, theme_color, banner_image } = req.body;

    db.prepare(`
      UPDATE user_profiles 
      SET display_name = ?,
          bio = ?,
          avatar_url = ?,
          theme_color = ?,
          banner_image = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(display_name, bio, avatar_url, theme_color, banner_image, req.userId);

    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.userId);
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/games', authenticateToken, (req, res) => {
  try {
    const games = db.prepare(`
      SELECT * FROM user_games 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.userId);

    const parsedGames = games.map(game => ({
      ...game,
      genres: game.genres ? JSON.parse(game.genres) : []
    }));

    res.json(parsedGames);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/games', authenticateToken, (req, res) => {
  try {
    const {
      steam_app_id,
      title,
      platform,
      status,
      progress,
      rating,
      cover_image,
      genres,
      playtime,
      started_date,
      completed_date,
      notes
    } = req.body;

    if (!title || !platform) {
      return res.status(400).json({ error: 'Title and platform are required' });
    }

    const result = db.prepare(`
      INSERT INTO user_games (
        user_id, steam_app_id, title, platform, status, progress, rating,
        cover_image, genres, playtime, started_date, completed_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.userId,
      steam_app_id || null,
      title,
      platform,
      status || 'backlog',
      progress || 0,
      rating || null,
      cover_image || null,
      genres ? JSON.stringify(genres) : '[]',
      playtime || 0,
      started_date || null,
      completed_date || null,
      notes || null
    );

    const game = db.prepare('SELECT * FROM user_games WHERE id = ?').get(result.lastInsertRowid);
    const parsedGame = {
      ...game,
      genres: game.genres ? JSON.parse(game.genres) : []
    };

    res.json(parsedGame);
  } catch (error) {
    console.error('Add game error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/games/:id', authenticateToken, (req, res) => {
  try {
    const gameId = req.params.id;
    const {
      title,
      platform,
      status,
      progress,
      rating,
      cover_image,
      genres,
      playtime,
      started_date,
      completed_date,
      notes
    } = req.body;

    const game = db.prepare('SELECT * FROM user_games WHERE id = ? AND user_id = ?').get(gameId, req.userId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

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
      title,
      platform,
      status,
      progress,
      rating,
      cover_image,
      genres ? JSON.stringify(genres) : '[]',
      playtime,
      started_date,
      completed_date,
      notes,
      gameId,
      req.userId
    );

    const updatedGame = db.prepare('SELECT * FROM user_games WHERE id = ?').get(gameId);
    const parsedGame = {
      ...updatedGame,
      genres: updatedGame.genres ? JSON.parse(updatedGame.genres) : []
    };

    res.json(parsedGame);
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/games/:id', authenticateToken, (req, res) => {
  try {
    const gameId = req.params.id;

    const game = db.prepare('SELECT * FROM user_games WHERE id = ? AND user_id = ?').get(gameId, req.userId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    db.prepare('DELETE FROM user_games WHERE id = ? AND user_id = ?').run(gameId, req.userId);

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/steam/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get('https://steamcommunity.com/actions/SearchApps/' + encodeURIComponent(query));
    
    res.json(response.data || []);
  } catch (error) {
    console.error('Steam search error:', error);
    res.status(500).json({ error: 'Failed to search Steam games' });
  }
});

app.get('/api/steam/game/:appId', async (req, res) => {
  try {
    const { appId } = req.params;

    const detailsResponse = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    
    if (!detailsResponse.data[appId] || !detailsResponse.data[appId].success) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameData = detailsResponse.data[appId].data;

    res.json({
      appId: parseInt(appId),
      name: gameData.name,
      description: gameData.short_description,
      headerImage: gameData.header_image,
      developers: gameData.developers || [],
      publishers: gameData.publishers || [],
      genres: gameData.genres ? gameData.genres.map(g => g.description) : [],
      platforms: gameData.platforms || {},
      releaseDate: gameData.release_date ? gameData.release_date.date : null,
      price: gameData.price_overview ? gameData.price_overview.final_formatted : 'Free',
      screenshots: gameData.screenshots ? gameData.screenshots.slice(0, 5).map(s => s.path_full) : []
    });
  } catch (error) {
    console.error('Steam game details error:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
