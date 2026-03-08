import fs from "node:fs";
import path from "node:path";
import { escapeHtml } from "./linkUtils.js";

interface PreviewMetadata {
  ogTitle: string;
  ogDescription: string;
}

function loadMetadata(): PreviewMetadata {
  const fallback: PreviewMetadata = {
    ogTitle: "Duit Raya untuk anda!",
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

function resolveBaseUrl(host?: string, proto?: string): string {
  if (host) {
    return `${proto || "https"}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

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

  <text x="600" y="190" font-size="54" text-anchor="middle" fill="#b2521c" font-family="Georgia, 'Times New Roman', serif" font-weight="700">Selamat Hari Raya</text>
  <text x="600" y="290" font-size="44" text-anchor="middle" fill="#1f3e33" font-family="Georgia, 'Times New Roman', serif">${safe1}</text>
  <text x="600" y="350" font-size="44" text-anchor="middle" fill="#1f3e33" font-family="Georgia, 'Times New Roman', serif">${safe2}</text>

  <text x="600" y="450" font-size="28" text-anchor="middle" fill="#7a5b45" font-family="Arial, sans-serif">tap to claim your duit raya</text>
  <text x="600" y="520" font-size="24" text-anchor="middle" fill="#b2521c" font-family="Arial, sans-serif" font-weight="700">Ka-ching Link</text>
</svg>`;
}

export function renderPreviewPage(params: {
  id: string;
  tngUrl: string;
  pantun: [string, string];
  host?: string;
  proto?: string;
}): string {
  const metadata = loadMetadata();
  const baseUrl = resolveBaseUrl(params.host, params.proto);
  const pageUrl = `${baseUrl}/k/${params.id}`;
  const ogImage = `${baseUrl}/api/card/${params.id}`;

  const safeTitle = escapeHtml(metadata.ogTitle);
  const safeDescription = escapeHtml(metadata.ogDescription);
  const safeOgImage = escapeHtml(ogImage);
  const safePageUrl = escapeHtml(pageUrl);
  const safeTngUrl = escapeHtml(params.tngUrl);
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
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeOgImage}" />
  </head>
  <body style="margin:0;font-family:system-ui;background:#f5f2ed;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;padding:24px;">
    <main style="max-width:620px;width:100%;text-align:center;">
      <h1 style="margin:0 0 10px;font-size:34px;">Selamat Hari Raya</h1>
      <p style="margin:0 0 20px;opacity:.72;line-height:1.5;">Tekan kad di bawah untuk buka Duit Raya anda.</p>
      <a href="${safeTngUrl}" rel="noopener noreferrer" style="display:block;border-radius:20px;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,0.16);text-decoration:none;background:linear-gradient(135deg,#0f3d2e,#1d6b50);padding:18px;">
        <div style="background:#f7eddc;border-radius:14px;padding:28px 16px;">
          <p style="margin:0 0 14px;font-size:30px;color:#b2521c;font-weight:700;font-family:Georgia, 'Times New Roman', serif;">Kad Raya Ka-ching</p>
          <p style="margin:0;font-size:22px;line-height:1.6;color:#1f3e33;font-family:Georgia, 'Times New Roman', serif;">${safeLine1}<br/>${safeLine2}</p>
          <p style="margin:16px 0 0;font-size:12px;letter-spacing:.06em;color:#7a5b45;">tap to claim your duit raya</p>
        </div>
      </a>
    </main>
  </body>
</html>`;
}
