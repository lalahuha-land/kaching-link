import { getLinkById } from "../_lib/linkStore.js";
import { renderExpiredPage, renderPreviewPage } from "../_lib/previewPage.js";
import { fallbackPantunIndex, getPantunByIndex } from "../_lib/pantun.js";

function isPreviewCrawler(userAgent: string): boolean {
  return /facebookexternalhit|facebot|twitterbot|slackbot|telegrambot|whatsapp|linkedinbot|discordbot|pinterestbot/i.test(
    userAgent,
  );
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!id) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(400).send(renderExpiredPage());
  }

  try {
    const link = await getLinkById(id);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

    if (!link) {
      return res.status(404).send(renderExpiredPage());
    }

    const userAgent = String(req.headers["user-agent"] || "");
    if (!isPreviewCrawler(userAgent)) {
      return res.redirect(302, link.tng_url);
    }

    const pantunIndex = typeof link.pantun_index === "number" ? link.pantun_index : fallbackPantunIndex(link.id);
    const pantun = getPantunByIndex(pantunIndex);

    const html = renderPreviewPage({
      id,
      tngUrl: link.tng_url,
      pantun,
      host: req.headers["x-forwarded-host"] || req.headers.host,
      proto: req.headers["x-forwarded-proto"],
    });

    return res.status(200).send(html);
  } catch (error) {
    console.error("Error serving preview:", error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(renderExpiredPage());
  }
}
