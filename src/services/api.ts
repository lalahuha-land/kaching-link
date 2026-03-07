import { CreateLinkResponse } from "../types";

export const api = {
  createLink: async (tngUrl: string): Promise<CreateLinkResponse> => {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tng_url: tngUrl }),
    });
    return response.json();
  }
};
