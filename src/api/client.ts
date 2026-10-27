// src/api/client.ts

import type { ApiError } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = new URL(path, BASE_URL || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return BASE_URL ? url.toString() : `${path}${url.search}`;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...rest } = options;

  const token = localStorage.getItem("token");

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `Ошибка ${response.status}`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // тело не JSON — оставляем стандартное сообщение
    }
    const error: ApiError = { message, status: response.status };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
