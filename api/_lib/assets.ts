export const KAD_RAYA_ASSETS = [
  "/assets/kad-raya/6989180.jpg",
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
