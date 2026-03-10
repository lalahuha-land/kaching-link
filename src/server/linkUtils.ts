import crypto from "node:crypto";

export const REQUIRED_TNG_PREFIX = "https://cdn.tngdigital.com.my/s/oauth2/index.html#/moneypacket?";
export const LINK_TTL_DAYS = 7;

export interface LinkRecord {
  id: string;
  tng_url: string;
  created_at: string;
  expires_at: string;
}

export function isValidTngUrl(tngUrl: string): boolean {
  if (!tngUrl || !tngUrl.startsWith(REQUIRED_TNG_PREFIX)) {
    return false;
  }

  const packetId = new URLSearchParams(tngUrl.split("?")[1]).get("packetId");
  const p = new URLSearchParams(tngUrl.split("?")[1]).get("p");
  return Boolean((packetId && packetId.length > 5) || (p && p.length > 5));
}

export function generateShortId(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export function buildExpiryIso(ttlDays: number = LINK_TTL_DAYS): string {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);
  return expiresAt.toISOString();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const KAD_RAYA_IMAGE_START = 3;
export const KAD_RAYA_IMAGE_END = 12;
export const KAD_RAYA_IMAGE_WIDTH = "1748";
export const KAD_RAYA_IMAGE_HEIGHT = "1240";
export const KAD_RAYA_OG_WIDTH = "1200";
export const KAD_RAYA_OG_HEIGHT = "630";

export function pickKadRayaImageIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const range = KAD_RAYA_IMAGE_END - KAD_RAYA_IMAGE_START + 1;
  const offset = Math.abs(hash) % range;
  return KAD_RAYA_IMAGE_START + offset;
}

export function buildKadRayaImagePath(id: string, useGif: boolean): string {
  const index = pickKadRayaImageIndex(id);
  const folder = useGif ? "kad-raya-gif" : "kad-raya";
  const ext = useGif ? "gif" : "png";
  return `/assets/${folder}/${index}.${ext}`;
}

export function buildKadRayaOgImagePath(id: string): string {
  const index = pickKadRayaImageIndex(id);
  return `/assets/kad-raya-og-v2/${index}.png`;
}
