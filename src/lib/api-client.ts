import type { ApiResponse } from "@/types/api";

export type ApiClientError = {
  message: string;
  details?: string[];
  status?: number;
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();

  if (!text) {
    throw { message: "Respuesta vacia del servidor.", status: response.status } as ApiClientError;
  }

  let payload: ApiResponse<T>;
  try {
    payload = JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw { message: "Respuesta invalida del servidor.", status: response.status } as ApiClientError;
  }

  if (!payload.ok) {
    throw {
      message: payload.error.message,
      details: payload.error.details,
      status: response.status
    } as ApiClientError;
  }

  return payload.data;
}
