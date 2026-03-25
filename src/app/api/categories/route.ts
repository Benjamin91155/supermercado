import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { createSlug } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });

    const items = categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl
    }));

    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const body = categorySchema.parse(await parseJson(request));
    const slug = createSlug(body.name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new ApiError(409, "La categoría ya existe.");
    }

    const category = await Category.create({
      name: body.name.trim(),
      slug,
      description: body.description ?? "",
      imageUrl: body.imageUrl ?? ""
    });

    return jsonOk(
      {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
