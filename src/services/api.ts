import { CreateLinkResponse } from "../types";

export const api = {
  createLink: async (tngUrl: string): Promise<CreateLinkResponse> => {
    if (typeof window !== "undefined" && window.location.protocol === "file:") {
      return {
        error: "Aplikasi tidak boleh dijalankan terus dari fail. Sila guna `npm run dev` dan buka http://localhost:3000.",
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
        error: "Tidak dapat menghubungi API. Sila pastikan app berjalan melalui `npm run dev`.",
      };
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
