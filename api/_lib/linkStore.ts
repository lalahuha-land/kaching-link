import { buildExpiryIso, generateShortId, LINK_TTL_DAYS, type LinkRecord } from "./linkUtils.js";
import { fallbackPantunIndex, pickRandomPantunIndex } from "./pantun.js";
import { fallbackAssetIndex, pickRandomAssetIndex } from "./assets.js";

const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  throw new Error(
    "KV is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).",
  );
}

const KV_PREFIX = "kaching:link:";

function kvHeaders() {
  return {
    Authorization: `Bearer ${KV_REST_API_TOKEN}`,
  };
}

async function kvSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const encodedKey = encodeURIComponent(key);
  const encodedValue = encodeURIComponent(value);
  const url = `${KV_REST_API_URL}/set/${encodedKey}/${encodedValue}?EX=${ttlSeconds}`;
  const response = await fetch(url, { headers: kvHeaders() });
  if (!response.ok) {
    throw new Error(`KV set failed with status ${response.status}`);
  }
}

async function kvGet(key: string): Promise<string | null> {
  const encodedKey = encodeURIComponent(key);
  const url = `${KV_REST_API_URL}/get/${encodedKey}`;
  const response = await fetch(url, { headers: kvHeaders() });
  if (!response.ok) {
    throw new Error(`KV get failed with status ${response.status}`);
  }

  const data = (await response.json()) as { result?: string | null };
  return data.result ?? null;
}

export async function createLink(tngUrl: string): Promise<LinkRecord> {
  const id = generateShortId();
  const createdAt = new Date().toISOString();
  const expiresAt = buildExpiryIso(LINK_TTL_DAYS);
  const record: LinkRecord = {
    id,
    tng_url: tngUrl,
    created_at: createdAt,
    expires_at: expiresAt,
    pantun_index: pickRandomPantunIndex(),
    asset_index: pickRandomAssetIndex(),
  };

  const ttlSeconds = LINK_TTL_DAYS * 24 * 60 * 60;
  await kvSet(`${KV_PREFIX}${id}`, JSON.stringify(record), ttlSeconds);
  return record;
}

export async function getLinkById(id: string): Promise<LinkRecord | null> {
  const raw = await kvGet(`${KV_PREFIX}${id}`);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as LinkRecord;
  if (typeof parsed.pantun_index !== "number") {
    parsed.pantun_index = fallbackPantunIndex(parsed.id);
  }
  if (typeof parsed.asset_index !== "number") {
    parsed.asset_index = fallbackAssetIndex(parsed.id);
  }
  if (new Date(parsed.expires_at).getTime() <= Date.now()) {
    return null;
  }

  return parsed;
}
