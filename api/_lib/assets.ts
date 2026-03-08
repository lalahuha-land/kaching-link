export const KAD_RAYA_ASSETS = [
  "/assets/kad-raya/Gemini_Generated_Image_u7qulou7qulou7qu.png",
  "/assets/kad-raya/Gemini_Generated_Image_x4bzqmx4bzqmx4bz.png",
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

export function getAssetMimeByPath(assetPath: string): string {
  const lower = assetPath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}
