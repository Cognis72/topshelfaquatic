const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static('.'));

// Proxy API requests to the API server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  logLevel: 'debug'
}));

// Catch-all handler for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Proxy Server running on http://0.0.0.0:${PORT}`);
  console.log('📋 Serving static files and proxying /api/* to port 3001');
});