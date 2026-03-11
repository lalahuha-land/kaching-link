import { createLink } from "./_lib/linkStore.js";
import { isValidTngUrl } from "./_lib/linkUtils.js";

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateBucket = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: any): string {
  const forwarded = String(req.headers["x-forwarded-for"] || "");
  const first = forwarded.split(",")[0]?.trim();
  return first || req.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function parseRequestBody(req: any): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new Error("Payload too large");
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error("Payload too large");
    }
    chunks.push(buf);
  }

  if (!chunks.length) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Too Many Requests" });
    }

    const body = await parseRequestBody(req);
    const tng_url = typeof body.tng_url === "string" ? body.tng_url : "";

    if (!isValidTngUrl(tng_url)) {
      return res.status(400).json({
        error: "Pautan TNG Money Packet tidak sah. Pastikan anda menyalin pautan penuh dari aplikasi TNG eWallet.",
      });
    }

    const created = await createLink(tng_url);
    return res.status(200).json({ id: created.id });
  } catch (error: any) {
    console.error("Error creating link:", error);
    if (error?.message === "Payload too large") {
      return res.status(413).json({ error: "Payload too large" });
    }
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
}
