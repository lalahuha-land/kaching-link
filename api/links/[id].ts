import { getLinkById } from "../_lib/linkStore";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!id) {
    return res.status(400).json({ error: "Missing link ID." });
  }

  try {
    const link = await getLinkById(id);
    if (!link) {
      return res.status(404).json({ error: "Pautan tidak dijumpai atau telah tamat tempoh." });
    }

    return res.status(200).json(link);
  } catch (error: any) {
    console.error("Error reading link:", error);
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
}
