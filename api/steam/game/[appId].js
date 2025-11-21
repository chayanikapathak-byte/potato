import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { appId } = req.query;

    // Use Steam's public store API - no API key needed
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
}
