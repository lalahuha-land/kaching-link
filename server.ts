import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./src/server/db";
import { botTemplate, error404Template, humanRedirectTemplate } from "./src/server/templates";
import {
  buildKadRayaOgImagePath,
  KAD_RAYA_OG_HEIGHT,
  KAD_RAYA_OG_WIDTH,
} from "./src/server/linkUtils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Create Link
  app.post("/api/links", (req, res) => {
    try {
      const { tng_url } = req.body;
      const requiredPrefix = "https://cdn.tngdigital.com.my/s/oauth2/index.html#/moneypacket?";
      
      const isValidTngUrl = tng_url && 
                           tng_url.startsWith(requiredPrefix) && 
                           (tng_url.includes("packetId=") || tng_url.includes("p=")) &&
                           (tng_url.includes("packetId=") ? tng_url.split("packetId=")[1]?.length > 5 : tng_url.split("p=")[1]?.length > 5);

      if (!isValidTngUrl) {
        return res.status(400).json({ error: "Pautan TNG Money Packet tidak sah. Pastikan anda menyalin pautan penuh dari aplikasi TNG eWallet." });
      }

      const id = Math.random().toString(36).substring(2, 10);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const stmt = db.prepare("INSERT INTO links (id, tng_url, expires_at) VALUES (?, ?, ?)");
      stmt.run(id, tng_url, expiresAt.toISOString());

      res.json({ id });
    } catch (error: any) {
      console.error("Error creating link:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // API: Get Link
  app.get("/api/links/:id", (req, res) => {
    const stmt = db.prepare("SELECT * FROM links WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)");
    const link = stmt.get(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Pautan tidak dijumpai atau telah tamat tempoh." });
    }
    res.json(link);
  });

  // Smart Middleware / Dynamic Metadata Route
  app.get(["/g/:id", "/k/:id"], (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const isBot = /WhatsApp|TelegramBot|facebookexternalhit|Twitterbot|Slackbot|LinkedInBot|Threads|Discordbot/i.test(userAgent);

    const stmt = db.prepare("SELECT * FROM links WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)");
    const link = stmt.get(req.params.id) as any;

    if (!link) {
      return res.status(404).send(error404Template());
    }

    if (isBot) {
      let title = `Duit Raya untuk anda! 🧧`;
      let description = `Seseorang telah menghantar Duit Raya kepada anda! Klik untuk tuntut sekarang di Touch 'n Go eWallet.`;
      
      try {
        const metadataPath = path.join(__dirname, "metadata.json");
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        if (metadata.ogTitle) title = metadata.ogTitle;
        if (metadata.ogDescription) description = metadata.ogDescription;
      } catch (err) {
        console.error("Error reading metadata.json:", err);
      }

      const protoHeader = req.headers["x-forwarded-proto"];
      const proto = Array.isArray(protoHeader)
        ? protoHeader[0]
        : protoHeader?.split(",")[0];
      const host = req.get("host");
      const protocol = proto || (host?.includes("localhost") ? "http" : "https");
      const baseUrl = `${protocol}://${host}`;
      const cacheBuster = encodeURIComponent(link.created_at || link.id);
      const ogImage = `${baseUrl}/og/${link.id}.png?v=${cacheBuster}`;
      const ogImageType = "image/png";
      const ogWidth = KAD_RAYA_OG_WIDTH;
      const ogHeight = KAD_RAYA_OG_HEIGHT;

      return res.send(botTemplate(title, description, ogImage, ogImageType, ogWidth, ogHeight));
    }

    res.send(humanRedirectTemplate(link.tng_url));
  });

  // OG image proxy to ensure cache control and stable sizing
  app.get("/og/:id.png", (req, res) => {
    const id = req.params.id;
    const ogPath = buildKadRayaOgImagePath(id).replace(/^\\//, "");
    const publicRoot = path.join(process.cwd(), "public");
    const distRoot = path.join(process.cwd(), "dist");
    let filePath = path.join(publicRoot, ogPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(distRoot, ogPath);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.sendFile(filePath);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
