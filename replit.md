# TopShelf Aquatic - Thai Balloon Fish Website

## Overview

TopShelf Aquatic is a responsive Thai-language website for selling premium balloon fish (ปลาบอลลูน). The website is built using vanilla HTML, CSS, and JavaScript without any frameworks or backend dependencies. It features a modern, mobile-friendly design with dynamic content loading from JSON data.

## System Architecture

### Frontend Architecture
- **Pure Client-Side Application**: Built with vanilla HTML5, CSS3, and ES6+ JavaScript
- **Responsive Design**: Mobile-first approach using CSS Flexbox and Grid
- **Component-Based Structure**: Modular JavaScript functions for different features
- **Static Asset Management**: Images and data stored locally in the project

### Backend Architecture (Added July 5, 2025)
- **API Server**: Node.js Express server running on port 3001
- **Order Management**: Complete order processing system with status tracking
- **Telegram Integration**: Automatic notifications to shop owner via Telegram bot
- **Fish Catalog Management**: API endpoints for adding/editing/deleting fish products

### Data Management
- **JSON-Based Data Storage**: Fish product data stored in `fish-data.json`
- **Dynamic Content Loading**: Fish cards generated dynamically from JSON data
- **Order Processing**: Full shopping cart and checkout system
- **Real-time Notifications**: Telegram bot sends order alerts to shop owner

## Key Components

### 1. Product Display System
- **Fish Gallery**: Dynamic card generation from JSON data
- **Image Management**: Local image storage in `/images/` directory
- **Product Information**: Thai descriptions, pricing, and contact integration

### 2. Navigation System
- **Fixed Header**: Persistent navigation with smooth scrolling
- **Mobile Menu**: Hamburger menu for mobile devices
- **Section Navigation**: Links to Home, About, How to Order, and Contact sections

### 3. Contact Integration
- **LINE Official Account**: Direct integration with LINE OA (@834wrclo)
- **Multiple Contact Methods**: LINE buttons, optional QR codes, and Google Maps

### 4. UI/UX Features
- **Thai Typography**: Google Fonts (Prompt) for proper Thai text rendering
- **Smooth Animations**: CSS transitions and JavaScript intersection observers
- **Loading States**: User feedback during data loading
- **Error Handling**: Graceful fallbacks for failed data loading

## Data Flow

1. **Page Load**: HTML structure loads with static header and sections
2. **Data Fetching**: JavaScript fetches fish data from `fish-data.json`
3. **Content Rendering**: Fish cards dynamically generated and inserted into DOM
4. **User Interaction**: Navigation, mobile menu, and contact actions handled by JavaScript
5. **Error Handling**: Failed data loads display appropriate error messages

## External Dependencies

### CDN Resources
- **Google Fonts**: Prompt font family for Thai language support
- **Font Awesome**: Icons for UI elements (fish logo, navigation icons)

### Third-Party Integrations
- **LINE Official Account**: Direct links to LINE chat (@834wrclo)
- **Google Maps**: Optional iframe integration for store location
- **Social Media**: Open Graph meta tags for sharing

## Deployment Strategy

### Node.js Server Deployment
- **Main Server**: `server/simpleServer.js` - Primary entry point for deployment
- **Multiple Entry Points**: Comprehensive deployment compatibility with multiple wrappers:
  - `server.js` - Deployment wrapper for platforms expecting server.js
  - `app.js` - Application wrapper for Node.js deployments
  - `index.js` - Default Node.js entry point
  - `start.js` - Startup script wrapper
- **Deployment Strategy**: Works without npm scripts by using direct Node.js commands
- **Health Check**: Root endpoint (`/`) returns JSON health status for deployment monitoring
- **Port Configuration**: Environment-aware port configuration (process.env.PORT || 5000)
- **CORS Configuration**: Dynamic origin handling for replit.app domains and deployment
- **Static Assets**: Serves website files alongside API endpoints
- **Database**: PostgreSQL integration with Drizzle ORM
- **Procfile Support**: Heroku-style Procfile for platform compatibility

### File Structure
```
/
├── index.html          # Main website file
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── fish-data.json      # Product data
└── images/             # Fish product images
    ├── fish1.jpg
    ├── fish2.jpg
    └── ...
```

### Performance Considerations
- Images should be optimized for web (JPEG format recommended)
- Preconnect hints for external font resources
- Lazy loading potential for images
- Minification recommended for production

## Key Features

### Product Display System  
- **Fish Gallery**: Dynamic card generation from JSON data
- **Video Integration**: Each fish card includes video playback functionality
- **LINE Contact**: Direct LINE integration for customer inquiries

### Content Management
- **Fish Catalog Admin**: Add new fish with photos, videos, prices, and descriptions
- **Dynamic Product Display**: Automatically updates website when new fish are added
- **Media Support**: Upload and display images and videos for each fish product
- **Inventory Management**: Edit or delete existing fish products

### Communication System
- **Telegram Bot Integration**: Instant notifications when customers place orders
- **Thai Language Support**: All notifications and interfaces in Thai language
- **Status Updates**: Notify customers of order status changes
- **LINE Integration**: Direct contact buttons for customer inquiries

## Available Pages

1. **Main Website** (`/`) - Customer-facing fish catalog with LINE contact integration
2. **Fish Management** (`/add-fish.html`) - Add, edit, and delete fish products

## API Endpoints

- `GET /api/fish` - Get fish catalog
- `POST /api/fish` - Update fish catalog
- `DELETE /api/fish/:id` - Delete fish from catalog

## Changelog

- July 05, 2025: Initial setup with responsive Thai website
- July 05, 2025: Successfully integrated 5 MP4 video files from user uploads
- July 05, 2025: Added video modal with back button functionality
- July 05, 2025: Completed video-to-fish card linking system
- July 05, 2025: Built complete e-commerce system with shopping cart and checkout
- July 05, 2025: Added Telegram bot integration for order notifications
- July 05, 2025: Created admin panels for order management and fish catalog management
- July 05, 2025: Fixed deployment configuration - added health check endpoint at root path, removed workflow conflicts, optimized server for deployment
- July 05, 2025: Resolved npm scripts deployment issue - created multiple entry points (server.js, app.js, index.js, start.js), added Procfile support, comprehensive deployment documentation
- July 05, 2025: Fixed package.json deployment issue - added required "build" and "start" scripts for deployment platform compatibility
- July 06, 2025: Removed shopping cart functionality and admin panels - simplified to product display with LINE contact integration only
- July 06, 2025: Added fish management system - created add-fish.html for adding, editing, and deleting fish products

## User Preferences

Preferred communication style: Simple, everyday language.