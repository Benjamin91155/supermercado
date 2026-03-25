import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { registerSchema } from "@/lib/validators";
import { hashPassword, signToken, toPublicUser } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = registerSchema.parse(await parseJson(request));
    const email = body.email.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "El email ya está registrado.");
    }

    const passwordHash = await hashPassword(body.password);

    // Forzamos el rol de cliente por seguridad.
    const user = await User.create({
      name: body.name.trim(),
      email,
      passwordHash,
      role: "customer"
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return jsonOk({ token, user: toPublicUser(user) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
