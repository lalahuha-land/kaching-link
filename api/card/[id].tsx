import { ImageResponse } from "@vercel/og";
import { getLinkById } from "../_lib/linkStore.js";
import { fallbackPantunIndex, getPantunByIndex } from "../_lib/pantun.js";
import { fallbackAssetIndex, getAssetPathByIndex } from "../_lib/assets.js";

function resolveBaseUrl(host?: string, proto?: string): string {
  if (host) {
    return `${proto || "https"}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method Not Allowed");
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!id) {
    return res.status(400).send("Missing link ID");
  }

  try {
    const link = await getLinkById(id);
    const pantunIndex = link && typeof link.pantun_index === "number" ? link.pantun_index : fallbackPantunIndex(id);
    const assetIndex = link && typeof link.asset_index === "number" ? link.asset_index : fallbackAssetIndex(id);

    const pantun = getPantunByIndex(pantunIndex);
    const assetPath = getAssetPathByIndex(assetIndex);
    const baseUrl = resolveBaseUrl(req.headers["x-forwarded-host"] || req.headers.host, req.headers["x-forwarded-proto"]);
    const assetUrl = `${baseUrl}${assetPath}`;

    const image = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#0f766e",
          }}
        >
          <img
            src={assetUrl}
            alt="Kad Raya"
            style={{
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "84px",
              top: "212px",
              width: "520px",
              borderRadius: "18px",
              padding: "26px 24px",
              background: "rgba(13, 113, 118, 0.88)",
              border: "2px solid rgba(255,255,255,0.18)",
              color: "#fefce8",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1.1,
                textTransform: "uppercase",
                marginBottom: 14,
                color: "#fde68a",
              }}
            >
              Pantun Raya
            </div>
            <div
              style={{
                fontSize: 44,
                lineHeight: 1.25,
                fontWeight: 700,
                textShadow: "0 2px 6px rgba(0,0,0,.35)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{pantun[0]}</span>
              <span>{pantun[1]}</span>
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 18,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#fde68a",
              }}
            >
              tap to claim your duit raya
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    if (req.method === "HEAD") {
      return res.status(200).end();
    }
    res.status(200).send(Buffer.from(await image.arrayBuffer()));
  } catch (error) {
    console.error("Error rendering OG card:", error);
    return res.status(500).send("Failed to render card image");
  }
}
