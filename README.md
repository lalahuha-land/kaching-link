# Ka-ching Link

Ka-ching Link is a small web app to generate shareable Duit Raya links with rich social previews for platforms like WhatsApp, Telegram, Threads, and Facebook (probably).

The app includes:
- React + Vite frontend (`src/`)
- Vercel serverless API routes (`api/`)
- Link storage via Vercel KV (recommended) or local SQLite fallback
- Share preview page at `/k/:id` (rewritten to `/api/k/:id`)

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

- `GET /k/:id`  
  Returns an HTML page with Open Graph metadata and a clickable festive card that opens the original TNG URL.
  This route is handled by Vercel rewrite to `/api/k/:id`.

Query parameter:
- `hasGif=true` to use GIF preview image in metadata response.

## Configuration

- `metadata.json`: update default OG title/description.
- `src/server/previewPage.ts`: edit Open Graph + preview HTML.
- `src/server/linkStore.ts`: Vercel KV + SQLite fallback link storage logic.

## Data Storage

- On Vercel: configure one of these env var pairs for persistent storage:
  - `KV_REST_API_URL` + `KV_REST_API_TOKEN`
  - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- Local fallback: SQLite file `kaching.db` (created in project root).
- Links are currently set to expire 7 days after creation.

## Vercel Setup (Required)

1. Add Upstash Redis via Vercel Storage / Marketplace.
2. Ensure one full REST env var pair exists in Project Settings -> Environment Variables.
3. Apply vars to `Production` and `Preview` environments.
4. Redeploy after saving env vars.

## Troubleshooting

- Error `500` on `POST /api/links` in Vercel usually means KV is not configured or token auth failed.
- Check Function Logs for messages such as:
  - `KV is not configured...`
  - `KV set failed with status 401/403`
- If KV is not configured, verify env var names exactly and redeploy.
- If auth fails, copy fresh REST URL/token from Upstash and update Vercel env vars.

## Notes

- Local `npm run dev` still uses `server.ts` for convenience.
- Vercel production flow uses routes in `api/` and `vercel.json` rewrites.
