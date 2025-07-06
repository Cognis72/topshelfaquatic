# TopShelf Aquatic - Deployment Guide

## Deployment Options

This application provides multiple entry points for deployment compatibility:

### 1. Primary Entry Points
- `server/simpleServer.js` - Main server file (recommended)
- `server.js` - Deployment wrapper (alternative)
- `app.js` - Application wrapper (alternative)
- `index.js` - Node.js default entry point
- `start.js` - Startup script

### 2. For Platforms Requiring npm Scripts

If your deployment platform requires npm scripts, you can run the server directly:

```bash
# Direct server start
node server/simpleServer.js

# Or use any of the wrapper files
node server.js
node app.js
node index.js
node start.js
```

### 3. Environment Variables

The application uses the following environment variables:

- `PORT` - Server port (defaults to 5000)
- `NODE_ENV` - Environment (production/development)
- `DATABASE_URL` - PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (optional)
- `TELEGRAM_CHAT_ID` - Telegram chat ID (optional)

### 4. Health Check

The server provides a health check endpoint at the root:

```
GET /
Response: {"status":"OK","message":"TopShelf Aquatic API Server is running","timestamp":"...","version":"1.0.0"}
```

### 5. Deployment Commands

#### Option A: Direct Node.js
```bash
node server/simpleServer.js
```

#### Option B: Using wrapper
```bash
node server.js
```

#### Option C: With environment
```bash
NODE_ENV=production PORT=5000 node server/simpleServer.js
```

### 6. Features

- ✅ Static file serving (HTML, CSS, JS, images)
- ✅ REST API endpoints
- ✅ PostgreSQL database support
- ✅ Telegram notifications
- ✅ CORS configured for deployment
- ✅ Health check endpoint
- ✅ Environment-aware port configuration

### 7. Troubleshooting

If deployment fails with "npm run build" or "npm run start" errors:

1. Use direct Node.js commands instead
2. Point deployment to `server/simpleServer.js`
3. Use the provided wrapper files as entry points
4. Ensure environment variables are set correctly

The application is designed to work without build steps as it serves static files directly.