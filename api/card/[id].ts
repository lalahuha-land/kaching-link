import { getLinkById } from "../_lib/linkStore.js";
import { renderCardSvg } from "../_lib/previewPage.js";
import { fallbackPantunIndex, getPantunByIndex } from "../_lib/pantun.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  const fallbackPantun = getPantunByIndex(0);

  if (!id) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(400).send(renderCardSvg(fallbackPantun[0], fallbackPantun[1]));
  }

  try {
    const link = await getLinkById(id);
    const pantunIndex = link && typeof link.pantun_index === "number" ? link.pantun_index : fallbackPantunIndex(id);
    const pantun = getPantunByIndex(pantunIndex);

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(renderCardSvg(pantun[0], pantun[1]));
  } catch {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(500).send(renderCardSvg(fallbackPantun[0], fallbackPantun[1]));
  }
}
