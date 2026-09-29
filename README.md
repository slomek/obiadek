# Obiadek

A modern full-stack TypeScript application for planning dinners using the Trello API. Pick your dinner options based on data stored in Trello cards and lists.

## Project Structure

This is a monorepo containing:

- **apps/frontend** - React + TypeScript + Vite frontend application
- **apps/backend** - Express + TypeScript backend API
- **packages/shared** - Shared TypeScript types and utilities

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query (React Query)

### Backend
- Node.js
- Express
- TypeScript
- Trello API integration

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Trello API credentials (API Key and Token)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd obiadek
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for all workspaces (root, frontend, backend, and shared).

### 3. Configure Trello API

1. Get your Trello API credentials:
   - Visit https://trello.com/app-key
   - Copy your API Key
   - Generate a Token

2. Create environment files:

```bash
# Root directory
cp .env.example .env

# Backend directory
cp apps/backend/.env.example apps/backend/.env
```

3. Get your Trello API credentials:
   - Go to https://trello.com/app-key
   - Copy the **API Key** at the top of the page — put it in `TRELLO_API_KEY`
   - Generate a token by opening this URL (replace `YOUR_API_KEY`):
     ```
     https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=YOUR_API_KEY
     ```
   - Click **Allow**, then copy the token shown — put it in `TRELLO_API_TOKEN`

4. Update the `.env` files with your Trello credentials:

```env
TRELLO_API_KEY=your_actual_api_key
TRELLO_API_TOKEN=your_actual_token
```

### Updating the Trello token

Trello tokens can expire. To refresh locally, run:

```bash
npm run trello:token
```

The script reads your current API key, opens the Trello auth URL, prompts you to paste the new token, and updates both `.env` files automatically. Afterwards, also update `TRELLO_API_TOKEN` in your Vercel environment variables and redeploy.

### 4. Run the development servers

```bash
npm run dev
```

This will start both frontend and backend servers concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

You can also run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all workspaces
- `npm run lint` - Lint all workspaces
- `npm run type-check` - Type check all workspaces
- `npm run clean` - Remove all node_modules and dist folders

### Frontend (`apps/frontend`)

- `npm run dev --workspace=@obiadek/frontend` - Start frontend dev server
- `npm run build --workspace=@obiadek/frontend` - Build for production
- `npm run preview --workspace=@obiadek/frontend` - Preview production build

### Backend (`apps/backend`)

- `npm run dev --workspace=@obiadek/backend` - Start backend dev server
- `npm run build --workspace=@obiadek/backend` - Build for production
- `npm run start --workspace=@obiadek/backend` - Start production server

## API Endpoints

### Backend API

- `GET /api/health` - Health check endpoint
- `GET /api/trello/boards` - Get all Trello boards
- `GET /api/trello/boards/:boardId/lists` - Get lists for a specific board
- `GET /api/trello/lists/:listId/cards` - Get cards from a specific list

## Development

### Project Architecture

```
obiadek/
├── apps/
│   ├── frontend/           # React frontend application
│   │   ├── src/
│   │   │   ├── components/ # Reusable React components
│   │   │   ├── pages/      # Page components
│   │   │   ├── services/   # API services
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   └── types/      # Frontend-specific types
│   │   └── package.json
│   └── backend/            # Express backend API
│       ├── src/
│       │   ├── controllers/# Request handlers
│       │   ├── routes/     # API routes
│       │   ├── services/   # Business logic
│       │   ├── middleware/ # Express middleware
│       │   └── types/      # Backend-specific types
│       └── package.json
└── packages/
    └── shared/             # Shared code between frontend and backend
        ├── src/
        │   └── types/      # Shared TypeScript types
        └── package.json
```

### Adding Dependencies

For workspace-specific dependencies:

```bash
# Frontend
npm install <package> --workspace=@obiadek/frontend

# Backend
npm install <package> --workspace=@obiadek/backend

# Shared
npm install <package> --workspace=@obiadek/shared
```

For root-level dev dependencies:

```bash
npm install <package> -D
```

## License

MIT
