import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import and use API handlers
const importHandler = async (path) => {
  const module = await import(path);
  return module.default;
};

// Helper function to wrap Vercel-style handlers for Express
const wrapHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  const handler = await importHandler('../api/auth/signup.js');
  return wrapHandler(handler)(req, res);
});

app.post('/api/auth/login', async (req, res) => {
  const handler = await importHandler('../api/auth/login.js');
  return wrapHandler(handler)(req, res);
});

app.get('/api/auth/me', async (req, res) => {
  const handler = await importHandler('../api/auth/me.js');
  return wrapHandler(handler)(req, res);
});

// Profile routes
app.get('/api/profile', async (req, res) => {
  const handler = await importHandler('../api/profile.js');
  return wrapHandler(handler)(req, res);
});

app.put('/api/profile', async (req, res) => {
  const handler = await importHandler('../api/profile.js');
  return wrapHandler(handler)(req, res);
});

// Games routes
app.get('/api/games', async (req, res) => {
  const handler = await importHandler('../api/games/index.js');
  return wrapHandler(handler)(req, res);
});

app.post('/api/games', async (req, res) => {
  const handler = await importHandler('../api/games/index.js');
  return wrapHandler(handler)(req, res);
});

app.put('/api/games/:id', async (req, res) => {
  req.query.id = req.params.id;
  const handler = await importHandler('../api/games/[id].js');
  return wrapHandler(handler)(req, res);
});

app.delete('/api/games/:id', async (req, res) => {
  req.query.id = req.params.id;
  const handler = await importHandler('../api/games/[id].js');
  return wrapHandler(handler)(req, res);
});

// Steam routes
app.get('/api/steam/search', async (req, res) => {
  const handler = await importHandler('../api/steam/search.js');
  return wrapHandler(handler)(req, res);
});

app.get('/api/steam/game/:appId', async (req, res) => {
  req.query.appId = req.params.appId;
  const handler = await importHandler('../api/steam/game/[appId].js');
  return wrapHandler(handler)(req, res);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
