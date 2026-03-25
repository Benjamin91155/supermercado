import type { NextRequest } from "next/server";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, toPublicUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    return jsonOk({ user: toPublicUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
