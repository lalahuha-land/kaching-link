import fs from "node:fs";
import path from "node:path";
import {
  buildKadRayaImagePath,
  escapeHtml,
  KAD_RAYA_IMAGE_HEIGHT,
  KAD_RAYA_IMAGE_WIDTH,
} from "./linkUtils";

interface PreviewMetadata {
  ogTitle: string;
  ogDescription: string;
}

function loadMetadata(): PreviewMetadata {
  const fallback: PreviewMetadata = {
    ogTitle: "Tap untuk claim Duit Raya!",
    ogDescription: "Seseorang telah menghantar Duit Raya kepada anda. Tekan imej untuk tuntut di Touch 'n Go eWallet.",
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

export function renderPreviewPage(params: {
  id: string;
  tngUrl: string;
  hasGif: boolean;
  host?: string;
  proto?: string;
}): string {
  const metadata = loadMetadata();
  const baseUrl = resolveBaseUrl(params.host, params.proto);
  const pageUrl = `${baseUrl}/k/${params.id}${params.hasGif ? "?hasGif=true" : ""}`;
  const ogImage = `${baseUrl}${buildKadRayaImagePath(params.id, params.hasGif)}`;

  const safeTitle = escapeHtml(metadata.ogTitle);
  const safeDescription = escapeHtml(metadata.ogDescription);
  const safeOgImage = escapeHtml(ogImage);
  const safePageUrl = escapeHtml(pageUrl);
  const safeTngUrl = escapeHtml(params.tngUrl);

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
    <meta property="og:image:type" content="${params.hasGif ? "image/gif" : "image/png"}" />
    <meta property="og:image:width" content="${KAD_RAYA_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${KAD_RAYA_IMAGE_HEIGHT}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeOgImage}" />
  </head>
  <body style="margin:0;font-family:system-ui;background:#f5f2ed;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;padding:24px;">
    <main style="max-width:520px;width:100%;text-align:center;">
      <h1 style="margin:0 0 10px;font-size:34px;">Selamat Hari Raya</h1>
      <p style="margin:0 0 20px;opacity:.72;line-height:1.5;">Tekan kad di bawah untuk buka Duit Raya anda.</p>
      <a href="${safeTngUrl}" rel="noopener noreferrer" style="display:block;border-radius:20px;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,0.16);text-decoration:none;background:#fff;">
        <img src="${safeOgImage}" alt="Kad Raya Ka-ching" style="width:100%;display:block;" />
      </a>
      <a href="${safeTngUrl}" rel="noopener noreferrer" style="display:inline-block;margin-top:18px;background:#ff6321;color:#fff;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:12px;">Tuntut Duit Raya</a>
    </main>
  </body>
</html>`;
}
