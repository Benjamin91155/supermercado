import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function jsonOk<T>(data: T, status = 200) {
  const payload: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(payload, { status });
}

export function jsonError(status: number, message: string, details?: string[]) {
  const payload: ApiResponse<never> = { ok: false, error: { message, details } };
  return NextResponse.json(payload, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.errors.map((item) => item.message);
    return jsonError(400, "Datos inválidos.", details);
  }

  if (error instanceof ApiError) {
    return jsonError(error.status, error.message, error.details);
  }

  if (error instanceof Error) {
    return jsonError(500, error.message);
  }

  return jsonError(500, "Error interno inesperado.");
}

export async function parseJson<T>(request: Request) {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "JSON inválido.");
  }
}
