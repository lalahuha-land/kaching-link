export interface LinkData {
  id: string;
  sender?: string;
  amount?: string | null;
  tng_url: string;
  created_at?: string;
  expires_at?: string;
}

export interface CreateLinkResponse {
  id?: string;
  error?: string;
}
