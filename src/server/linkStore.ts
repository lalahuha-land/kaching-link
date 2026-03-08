import { buildExpiryIso, generateShortId, LINK_TTL_DAYS, type LinkRecord } from "./linkUtils";

const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_ENABLED = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
const IS_VERCEL = Boolean(process.env.VERCEL);

const KV_PREFIX = "kaching:link:";
let sqliteDb: { prepare: (sql: string) => { run: (...args: unknown[]) => unknown; get: (id: string) => unknown } } | null = null;

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
  };

  if (KV_ENABLED) {
    const ttlSeconds = LINK_TTL_DAYS * 24 * 60 * 60;
    await kvSet(`${KV_PREFIX}${id}`, JSON.stringify(record), ttlSeconds);
    return record;
  }

  if (IS_VERCEL) {
    throw new Error(
      "KV is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) in Vercel Environment Variables.",
    );
  }

  if (!sqliteDb) {
    const mod = await import("./db");
    sqliteDb = mod.default;
  }

  const stmt = sqliteDb.prepare("INSERT INTO links (id, tng_url, created_at, expires_at) VALUES (?, ?, ?, ?)");
  stmt.run(record.id, record.tng_url, record.created_at, record.expires_at);
  return record;
}

export async function getLinkById(id: string): Promise<LinkRecord | null> {
  if (KV_ENABLED) {
    const raw = await kvGet(`${KV_PREFIX}${id}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as LinkRecord;
    if (new Date(parsed.expires_at).getTime() <= Date.now()) {
      return null;
    }

    return parsed;
  }

  if (IS_VERCEL) {
    throw new Error(
      "KV is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) in Vercel Environment Variables.",
    );
  }

  if (!sqliteDb) {
    const mod = await import("./db");
    sqliteDb = mod.default;
  }

  const stmt = sqliteDb.prepare(
    "SELECT id, tng_url, created_at, expires_at FROM links WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)",
  );
  const link = stmt.get(id) as LinkRecord | undefined;
  return link ?? null;
}
