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
    const gameId = req.query.id;
    const userId = req.query.userId || req.body?.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (req.method === 'PUT') {
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

      const game = dbHelpers.getGameById(gameId, parseInt(userId));
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const updatedGame = dbHelpers.updateGame(gameId, parseInt(userId), {
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

      return res.json(updatedGame);
    }

    if (req.method === 'DELETE') {
      const game = dbHelpers.getGameById(gameId, parseInt(userId));
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      dbHelpers.deleteGame(gameId, parseInt(userId));
      return res.json({ message: 'Game deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Game operation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
