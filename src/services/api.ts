import { CreateLinkResponse } from "../types";

export const api = {
  createLink: async (tngUrl: string): Promise<CreateLinkResponse> => {
    if (typeof window !== "undefined" && window.location.protocol === "file:") {
      return {
        error: "Aplikasi tidak boleh dijalankan terus dari fail.",
      };
    }

    const endpoint =
      typeof window !== "undefined" && /^https?:$/.test(window.location.protocol)
        ? `${window.location.origin}/api/links`
        : "/api/links";

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tng_url: tngUrl }),
      });
    } catch {
      return {
        error: "Tidak dapat menghubungi API.",
      };
    }

    // Dev fallback: if frontend is served from a different localhost port (e.g. 5173),
    // retry against the Express server on :3000.
    if (
      response.status === 404 &&
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
      window.location.port !== "3000"
    ) {
      try {
        response = await fetch("http://localhost:3000/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tng_url: tngUrl }),
        });
      } catch {
        return {
          error: "API tidak ditemui pada origin semasa atau localhost:3000. Jalankan `npm run dev`.",
        };
      }
    }

    const raw = await response.text();
    let data: CreateLinkResponse | null = null;

    try {
      data = raw ? (JSON.parse(raw) as CreateLinkResponse) : null;
    } catch {
      return {
        error: response.ok
          ? "Respons pelayan bukan format JSON yang sah."
          : `Gagal menghubungi API (${response.status}). Pastikan anda jalankan app menggunakan 'npm run dev'.`,
      };
    }

    if (!response.ok) {
      return {
        error: data?.error || `Permintaan gagal (${response.status}).`,
      };
    }

    return data ?? { error: "Tiada data daripada pelayan." };
  }
};
