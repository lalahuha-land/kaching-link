import { getLinkById } from "../_lib/linkStore.js";
import { buildCardPngUrl } from "../_lib/previewPage.js";
import { fallbackPantunIndex, getPantunByIndex } from "../_lib/pantun.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  const fallbackPantun = getPantunByIndex(0);

  if (!id) {
    const fallbackUrl = buildCardPngUrl(fallbackPantun);
    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackBuffer = Buffer.from(await fallbackResponse.arrayBuffer());
    res.setHeader("Content-Type", "image/png");
    return res.status(400).send(fallbackBuffer);
  }

  try {
    const link = await getLinkById(id);
    const pantunIndex = link && typeof link.pantun_index === "number" ? link.pantun_index : fallbackPantunIndex(id);
    const pantun = getPantunByIndex(pantunIndex);
    const imageUrl = buildCardPngUrl(pantun);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Card image upstream failed (${imageResponse.status})`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(imageBuffer);
  } catch {
    try {
      const fallbackUrl = buildCardPngUrl(fallbackPantun);
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackBuffer = Buffer.from(await fallbackResponse.arrayBuffer());
      res.setHeader("Content-Type", "image/png");
      return res.status(500).send(fallbackBuffer);
    } catch {
      return res.status(500).send("Failed to render card image");
    }
  }
}
