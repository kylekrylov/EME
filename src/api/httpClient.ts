import { API_CONFIG } from '@/config';

interface IRequestOptions {
  query?: Record<string, number | string>;
  signal?: AbortSignal;
}

export interface IHttpResponse<T> {
  data: T;
  headers: Headers;
}

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function getJson<T>(path: string, options: IRequestOptions = {}) {
  const url = new URL(path, API_CONFIG.BASE_URL);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, { signal: options.signal });

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  return {
    data: (await response.json()) as T,
    headers: response.headers,
  } satisfies IHttpResponse<T>;
}
