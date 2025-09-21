import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// API proxy configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Middleware for parsing JSON (for API proxy)
app.use(express.json());

// Proxy API requests to backend
app.use('/api', async (req, res) => {
  try {
    const targetUrl = `${API_URL}${req.originalUrl}`;
    
    // Forward the request to backend
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        host: undefined, // Remove host header to avoid conflicts
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Forward response headers
    response.headers.forEach((value, key) => {
      res.set(key, value);
    });

    // Forward response status and body
    res.status(response.status);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Backend API unavailable' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌐 Frontend server running on port ${port}`);
  console.log(`🔗 API proxy forwarding to ${API_URL}`);
});
