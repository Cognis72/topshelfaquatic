#!/usr/bin/env node

/**
 * TopShelf Aquatic - Main deployment server
 * Entry point for deployment platforms that expect a server.js file
 */

console.log('🐠 TopShelf Aquatic - Deployment Server Starting...');

// Set production environment if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Start the main server
require('./server/simpleServer.js');

console.log('✅ TopShelf Aquatic deployment server is ready');