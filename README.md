# Ka-ching Link

Ka-ching Link is a small web app to generate shareable Duit Raya links with rich social previews for platforms like WhatsApp, Telegram, Threads, and Facebook.

The app includes:
- React + Vite frontend (`src/`)
- Express server (`server.ts`)
- SQLite storage using `better-sqlite3` (`kaching.db`)
- Bot-aware preview page at `/g/:id`

## Prerequisites

- Node.js 20+ (recommended)
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` values as needed.

Note: current local app flow does not require `GEMINI_API_KEY`, but the variable is kept in `.env.example` for compatibility with the original AI Studio template.

## Run Locally

Start the app (Express + Vite middleware) on `http://localhost:3000`:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - run Express server with Vite middleware (development)
- `npm run build` - build frontend assets to `dist/`
- `npm run preview` - preview built frontend via Vite
- `npm run lint` - TypeScript type-check (`tsc --noEmit`)
- `npm run clean` - remove `dist/`

## API Endpoints

- `POST /api/links`  
  Creates a short link record from a valid TNG Money Packet URL.

- `GET /api/links/:id`  
  Returns link details if found and not expired.

- `GET /g/:id`  
  Smart route:
  - bot user-agents receive Open Graph HTML metadata
  - human users are redirected to the original TNG URL

Query parameter:
- `hasGif=true` to use GIF preview image in metadata response.

## Configuration

- `metadata.json`: update default OG title/description.
- `src/server/templates.ts`: edit HTML templates for bot previews, redirect, and 404.
- `src/server/db.ts`: SQLite schema and hourly cleanup for expired links.

## Data Storage

- SQLite file: `kaching.db` (created in project root)
- Links are currently set to expire 7 days after creation.

## Notes

- This project currently runs fully from `server.ts` in development mode.
- If you deploy to production, ensure your runtime can execute TypeScript entry files (or compile server code to JavaScript first).
