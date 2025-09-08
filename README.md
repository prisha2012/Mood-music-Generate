# Mood Music Generator

A mood-based music and quote generator application with a React frontend and Node.js/Express backend.

## Project Structure

```
Mood-music-Generate/
├── client/          # Frontend React application
└── server/          # Backend Node.js/Express server
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. Set up the frontend:
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

### Running Locally

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Deployment

### Backend (Render)

1. Push your code to GitHub
2. Connect your repository to Render
3. Use the `render.yaml` file for deployment configuration

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the `client` directory to Vercel
3. Configure environment variables

## License

MIT
