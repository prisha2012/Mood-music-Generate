# Mood Music Backend

Backend API for the Mood-Based Music & Quote Generator application. Built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT and Google OAuth
- Mood-based music playlists
- Inspirational quotes by mood
- Favorites system for songs and quotes
- YouTube video integration
- RESTful API design

## Prerequisites

- Node.js 14.x or higher
- MongoDB 4.4 or higher
- npm or yarn
- YouTube Data API v3 key
- Google OAuth credentials (optional)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mood-music/server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure environment variables (see [Configuration](#configuration))

4. Start the development server
   ```bash
   npm run dev
   ```

## Configuration

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

### Required Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `YOUTUBE_API_KEY` - YouTube Data API v3 key

### Optional Environment Variables

- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRE` - JWT expiration time (default: 30d)
- `JWT_COOKIE_EXPIRE` - JWT cookie expiration in days (default: 30)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_OAUTH_REDIRECT_URI` - Google OAuth redirect URI
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Login user |
| `/auth/me` | GET | Get current user |
| `/auth/logout` | GET | Logout user |
| `/auth/google/url` | GET | Get Google OAuth URL |
| `/auth/google/callback` | GET | Google OAuth callback |

### Playlists

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/playlist/:mood/:language` | GET | Get songs by mood and language |
| `/playlist/add` | POST | Add a song to playlist |
| `/playlist/:id` | DELETE | Delete a song from playlist |

### Search

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Search YouTube for videos |
| `/search/video/:id` | GET | Get YouTube video details |

### Quotes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quotes/random/:mood` | GET | Get random quote by mood |
| `/quotes/:mood` | GET | Get all quotes by mood |
| `/quotes` | POST | Add a new quote |
| `/quotes/:id/like` | POST | Like a quote |
| `/quotes/:id/like` | DELETE | Unlike a quote |

### Favorites

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/favorites` | GET | Get user's favorites |
| `/favorites` | POST | Add to favorites |
| `/favorites/check` | GET | Check if item is favorited |
| `/favorites/:id` | DELETE | Remove from favorites |

## Database Seeding

To seed the database with sample data:

```bash
npm run seed
```

To destroy all data:

```bash
npm run seed -d
```

## Deployment

### Render

1. Push your code to a Git repository
2. Connect your repository to Render
3. Create a new Web Service and select your repository
4. Configure the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - Other required environment variables

### Environment Variables

Make sure to set up all required environment variables in your production environment.

## Development

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Seed the database with sample data
- `npm test` - Run tests (coming soon)

### Linting

```bash
npm run lint
```

## License

MIT
