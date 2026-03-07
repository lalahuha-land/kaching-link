import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./src/server/db";
import { botTemplate, error404Template, humanRedirectTemplate } from "./src/server/templates";

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
  app.get("/g/:id", (req, res) => {
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

      const hasGif = req.query.hasGif === "true";
      let ogImage = `https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1200&h=630&auto=format&fit=crop`;
      let ogImageType = "image/jpeg";
      let ogWidth = "1200";
      let ogHeight = "630";

      if (hasGif) {
        ogImage = `https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZnd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4Znd4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKDkDbIDJieKbVm/giphy.gif`;
        ogImageType = "image/gif";
        ogWidth = "480";
        ogHeight = "480";
      }

      return res.send(botTemplate(title, description, ogImage, ogImageType, ogWidth, ogHeight));
    }

    res.send(humanRedirectTemplate(link.tng_url));
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
