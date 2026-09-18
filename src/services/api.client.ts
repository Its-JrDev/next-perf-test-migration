function normalizeBaseUrl(url: string | undefined): string {
  if (!url) return 'http://localhost:3000';
  if (/^https?:\/\//i.test(url)) return url;
  return `http://${url}`;
}

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
const TOKEN_KEY = 'accessToken';
const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
  timeout?: number;
}

interface ApiErrorResponse {
  message?: string;
  field?: string;
  details?: Array<{ message: string; field?: string }>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<{ data: T }> {
  const { params, timeout = 10000, headers: headersInput, ...init } = options;

  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
  }

  const token =
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...(headersInput as Record<string, string> || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      ...init,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const body = isJson ? await response.json() : (await response.text()) as T;

    if (!response.ok) {
      const payload = body as ApiErrorResponse | undefined;
      const error = new Error(
        payload?.message || `HTTP ${response.status}`,
      ) as Error & {
        status: number;
        response?: { data: unknown };
        kind?: string;
        details?: Array<{ message: string; field?: string }>;
      };
      error.status = response.status;
      error.response = { data: body };

      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      } else if (response.status === 403) {
        console.warn(
          'Forbidden: You are not authorized to perform this action.',
        );
      }

      throw error;
    }

    return { data: body as T };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      );
    }
    throw error;
  }
}

const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};

export { TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT };
export default api;
