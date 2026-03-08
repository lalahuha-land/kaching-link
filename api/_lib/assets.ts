export const KAD_RAYA_ASSETS = [
  "/assets/kad-raya/Gemini_Generated_Image_x4bzqmx4bzqmx4bz.png",
];

export const KAD_RAYA_GIFS = [
  "/assets/kad-raya-gif/pantun-0.gif",
  "/assets/kad-raya-gif/pantun-1.gif",
  "/assets/kad-raya-gif/pantun-2.gif",
  "/assets/kad-raya-gif/pantun-3.gif",
  "/assets/kad-raya-gif/pantun-4.gif",
  "/assets/kad-raya-gif/pantun-5.gif",
  "/assets/kad-raya-gif/pantun-6.gif",
  "/assets/kad-raya-gif/pantun-7.gif",
  "/assets/kad-raya-gif/pantun-8.gif",
  "/assets/kad-raya-gif/pantun-9.gif",
];

export function pickRandomAssetIndex(): number {
  return Math.floor(Math.random() * KAD_RAYA_ASSETS.length);
}

export function fallbackAssetIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  }
  return hash % KAD_RAYA_ASSETS.length;
}

export function getAssetPathByIndex(index: number): string {
  return KAD_RAYA_ASSETS[index % KAD_RAYA_ASSETS.length] || KAD_RAYA_ASSETS[0];
}

export function getGifPathByPantunIndex(index: number): string {
  return KAD_RAYA_GIFS[index % KAD_RAYA_GIFS.length] || KAD_RAYA_GIFS[0];
}

export function getAssetMimeByPath(assetPath: string): string {
  const lower = assetPath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}
