import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);

    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? 'Request failed',
      payload?.details,
    );
  }

  return payload as T;
}
