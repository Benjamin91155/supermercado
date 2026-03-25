import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError } from "@/lib/api";
import User, { type UserDocument } from "@/models/User";
import type { AuthTokenPayload, PublicUser } from "@/types/api";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

if (!jwtSecret) {
  throw new Error("JWT_SECRET no está definida en las variables de entorno.");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieToken = request.cookies.get("token")?.value;
  return cookieToken ?? null;
}

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function getUserFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);
    await connectToDatabase();
    return await User.findById(payload.userId);
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new ApiError(401, "No autorizado.");
  }

  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);

  if (user.role !== "admin") {
    throw new ApiError(403, "Acceso restringido a administradores.");
  }

  return user;
}
