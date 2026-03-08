import { createLink } from "./_lib/linkStore";
import { isValidTngUrl } from "./_lib/linkUtils";

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

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
}
