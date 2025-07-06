#!/usr/bin/env node

/**
 * TopShelf Aquatic - Main application entry point
 * This serves as the primary entry point for deployment platforms
 * that expect a simple Node.js application structure.
 */

console.log('🐠 TopShelf Aquatic - Starting server...');

// Import and start the main server
require('./server/simpleServer.js');

console.log('✅ TopShelf Aquatic server started successfully');