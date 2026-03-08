import crypto from "node:crypto";

export const REQUIRED_TNG_PREFIX = "https://cdn.tngdigital.com.my/s/oauth2/index.html#/moneypacket?";
export const LINK_TTL_DAYS = 7;

export interface LinkRecord {
  id: string;
  tng_url: string;
  created_at: string;
  expires_at: string;
  pantun_index?: number;
}

export function isValidTngUrl(tngUrl: string): boolean {
  if (!tngUrl || !tngUrl.startsWith(REQUIRED_TNG_PREFIX)) {
    return false;
  }

  const query = tngUrl.split("?")[1] || "";
  const params = new URLSearchParams(query);
  const packetId = params.get("packetId");
  const p = params.get("p");
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
