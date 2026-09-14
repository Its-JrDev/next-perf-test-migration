function normalizeBaseUrl(url: string | undefined): string {
  if (!url) return 'http://localhost:3000';
  if (/^https?:\/\//i.test(url)) return url;
  return `http://${url}`;
}

export const axiosConfig = {
  baseURL: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};