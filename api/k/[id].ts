import { getLinkById } from "../_lib/linkStore.js";
import { renderExpiredPage, renderPreviewPage } from "../_lib/previewPage.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  const hasGif = req.query?.hasGif === "true";

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

    const html = renderPreviewPage({
      id,
      tngUrl: link.tng_url,
      hasGif,
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
