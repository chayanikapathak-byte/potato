import { dbHelpers } from '../_db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const userId = req.query.userId || req.body?.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (req.method === 'GET') {
      const games = dbHelpers.getGames(parseInt(userId));
      return res.json(games);
    }

    if (req.method === 'POST') {
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

      const game = dbHelpers.createGame(parseInt(userId), {
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
      });

      return res.json(game);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Games error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
