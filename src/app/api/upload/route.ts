import type { NextRequest } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { ApiError, handleApiError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError(400, "Archivo inválido.");
    }

    if (!file.type.startsWith("image/")) {
      throw new ApiError(400, "Solo se permiten imágenes.");
    }

    // Guardamos localmente solo para desarrollo; en producción se recomienda un storage externo.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, safeName), buffer);

    return jsonOk({ url: `/uploads/${safeName}` }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
