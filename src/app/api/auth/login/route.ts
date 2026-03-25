import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import { signToken, toPublicUser, verifyPassword } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = loginSchema.parse(await parseJson(request));
    const email = body.email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Credenciales inválidas.");
    }

    const isValid = await verifyPassword(body.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Credenciales inválidas.");
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return jsonOk({ token, user: toPublicUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
