import { dbHelpers } from './_db.js';

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
      const profile = dbHelpers.getProfile(parseInt(userId));
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json(profile);
    }

    if (req.method === 'PUT') {
      const { display_name, bio, avatar_url, theme_color, banner_image } = req.body;

      const updatedProfile = dbHelpers.updateProfile(parseInt(userId), {
        display_name,
        bio,
        avatar_url,
        theme_color,
        banner_image
      });

      return res.json(updatedProfile);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
