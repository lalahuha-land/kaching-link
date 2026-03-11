import fs from "node:fs";
import path from "node:path";
import { escapeHtml } from "./linkUtils.js";

interface PreviewMetadata {
  ogTitle: string;
  ogDescription: string;
}

function loadMetadata(): PreviewMetadata {
  const fallback: PreviewMetadata = {
    ogTitle: "Tap untuk claim Duit Raya!",
    ogDescription: "Seseorang telah menghantar Duit Raya kepada anda. Tekan kad untuk tuntut di Touch 'n Go eWallet.",
  };

  try {
    const metadataPath = path.join(process.cwd(), "metadata.json");
    const data = JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as {
      ogTitle?: string;
      ogDescription?: string;
    };

    return {
      ogTitle: data.ogTitle || fallback.ogTitle,
      ogDescription: data.ogDescription || fallback.ogDescription,
    };
  } catch {
    return fallback;
  }
}

function resolveBaseUrl(): string {
  const explicit = process.env.PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function renderExpiredPage(): string {
  return `<!DOCTYPE html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pautan Tamat Tempoh | Ka-ching Link</title>
  </head>
  <body style="margin:0;font-family:system-ui;background:#f5f2ed;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;padding:24px;">
    <div style="background:#fff;max-width:480px;border-radius:24px;padding:28px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.08)">
      <h1 style="margin:0 0 12px;font-size:28px;">Pautan Tidak Sah</h1>
      <p style="margin:0;opacity:.7;line-height:1.6;">Pautan Ka-ching ini telah tamat tempoh atau tidak wujud.</p>
      <a href="/" style="display:inline-block;margin-top:20px;background:#ff6321;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px;">Jana Pautan Baru</a>
    </div>
  </body>
</html>`;
}

export function renderCardSvg(line1: string, line2: string): string {
  const safe1 = escapeHtml(line1);
  const safe2 = escapeHtml(line2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Kad Raya Ka-ching">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f3d2e" />
      <stop offset="100%" stop-color="#1d6b50" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="58" y="58" width="1084" height="514" rx="34" fill="#f7eddc" />
  <circle cx="1050" cy="130" r="72" fill="#f4c44d" opacity="0.2" />
  <circle cx="160" cy="520" r="90" fill="#f4c44d" opacity="0.18" />

  <text x="600" y="290" font-size="44" text-anchor="middle" fill="#1f3e33" font-family="Georgia, 'Times New Roman', serif">${safe1}</text>
  <text x="600" y="350" font-size="44" text-anchor="middle" fill="#1f3e33" font-family="Georgia, 'Times New Roman', serif">${safe2}</text>

  <text x="600" y="450" font-size="28" text-anchor="middle" fill="#7a5b45" font-family="Arial, sans-serif">tap to claim your duit raya</text>
  <text x="600" y="520" font-size="24" text-anchor="middle" fill="#b2521c" font-family="Arial, sans-serif" font-weight="700">Ka-ching Link</text>
</svg>`;
}

export function buildCardPngUrl(pantun: [string, string]): string {
  const seed = `${pantun[0]}${pantun[1]}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const palettes = [
    { bg: "ff9a3c", fg: "1f2a44" },
    { bg: "27ae60", fg: "fff5d9" },
    { bg: "0f766e", fg: "fde68a" },
    { bg: "f97316", fg: "1b4332" },
  ];
  const palette = palettes[hash % palettes.length];
  const text = `🌙✨ SELAMAT HARI RAYA ✨🌙\n\n${pantun[0]}\n${pantun[1]}\n\n💸 tap to claim your duit raya 💸`;
  return `https://dummyimage.com/1200x630/${palette.bg}/${palette.fg}.png&text=${encodeURIComponent(text)}`;
}

export function renderPreviewPage(params: {
  id: string;
  tngUrl: string;
  pantun: [string, string];
  assetPath: string;
  ogGifPath: string;
  host?: string;
  proto?: string;
}): string {
  const metadata = loadMetadata();
  const baseUrl = resolveBaseUrl();
  const pageUrl = `${baseUrl}/k/${params.id}`;
  const ogImage = `${baseUrl}${params.ogGifPath}`;

  const safeTitle = escapeHtml(metadata.ogTitle);
  const safeDescription = escapeHtml(metadata.ogDescription);
  const safeOgImage = escapeHtml(ogImage);
  const safePageUrl = escapeHtml(pageUrl);
  const safeTngUrl = escapeHtml(params.tngUrl);
  const safeAssetPath = escapeHtml(params.assetPath);
  const safeLine1 = escapeHtml(params.pantun[0]);
  const safeLine2 = escapeHtml(params.pantun[1]);

  return `<!DOCTYPE html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeOgImage}" />
    <meta property="og:image:secure_url" content="${safeOgImage}" />
    <meta property="og:image:type" content="image/gif" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeOgImage}" />
    <style>
      :root { --a: #0f766e; --b: #f97316; --c: #fde68a; --ink: #1f2937; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Trebuchet MS", "Segoe UI", sans-serif;
        color: var(--ink);
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: radial-gradient(circle at 20% 10%, #fff7d6 0%, #ffe7c2 35%, #ffd6a8 100%);
      }
      .shell { max-width: 700px; width: 100%; text-align: center; position: relative; }
      .spark {
        position: absolute; width: 12px; height: 12px; border-radius: 999px; opacity: .6;
        animation: float 3.5s ease-in-out infinite;
      }
      .s1 { background: #f97316; left: 4%; top: 8%; animation-delay: .2s; }
      .s2 { background: #0f766e; right: 6%; top: 16%; animation-delay: .8s; }
      .s3 { background: #facc15; left: 10%; bottom: 20%; animation-delay: 1.2s; }
      .s4 { background: #14b8a6; right: 12%; bottom: 14%; animation-delay: .5s; }
      @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
      .title {
        margin: 0 0 10px;
        font-size: clamp(34px, 6vw, 52px);
        color: #8a2f00;
        text-shadow: 0 3px 0 rgba(255,255,255,.4);
      }
      .subtitle { margin: 0 0 20px; opacity: .78; font-size: 17px; }
      .card-wrap {
        display: block;
        text-decoration: none;
        border-radius: 28px;
        padding: 14px;
        background: linear-gradient(135deg, var(--a), #115e59 35%, #166534 100%);
        box-shadow: 0 22px 45px rgba(17,24,39,.25);
      }
      .card {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        min-height: 380px;
        background: #0f766e;
      }
      .card img {
        width: 100%;
        display: block;
      }
      .overlay {
        position: absolute;
        left: 8%;
        right: 48%;
        bottom: 18%;
      }
      .badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 999px;
        background: #fff;
        color: #0f766e;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .pantun {
        margin: 10px 0 0;
        color: #fefce8;
        font-size: clamp(16px, 2vw, 23px);
        line-height: 1.45;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 700;
        text-shadow: 0 2px 6px rgba(0,0,0,.3);
      }
      .cta {
        margin-top: 12px;
        font-size: 11px;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: #fde68a;
        font-weight: 700;
      }
      .moon { font-size: 18px; margin: 6px 0 0; }
    </style>
  </head>
  <body>
    <main class="shell">
      <span class="spark s1"></span>
      <span class="spark s2"></span>
      <span class="spark s3"></span>
      <span class="spark s4"></span>
      <h1 class="title">Selamat Hari Raya!</h1>
      <p class="subtitle">Raikan Syawal dengan senyuman, rezeki dan kasih sayang.</p>
      <a class="card-wrap" href="${safeTngUrl}" rel="noopener noreferrer">
        <div class="card">
          <img src="${safeAssetPath}" alt="Kad Raya" />
          <div class="overlay">
            <span class="badge">Pantun Raya</span>
            <p class="pantun">${safeLine1}<br/>${safeLine2}</p>
            <p class="cta">tap to claim your duit raya</p>
            <p class="moon">🌙✨💚✨🧧</p>
          </div>
        </div>
      </a>
    </main>
  </body>
</html>`;
}
