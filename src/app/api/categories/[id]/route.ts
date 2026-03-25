import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { categoryUpdateSchema } from "@/lib/validators";
import { createSlug } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth";
import Category from "@/models/Category";

export type CategoryRouteProps = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: CategoryRouteProps) {
  try {
    await connectToDatabase();

    const idOrSlug = params.id;
    const category = isValidObjectId(idOrSlug)
      ? await Category.findById(idOrSlug)
      : await Category.findOne({ slug: idOrSlug });

    if (!category) {
      throw new ApiError(404, "Categoría no encontrada.");
    }

    return jsonOk({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: CategoryRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const body = categoryUpdateSchema.parse(await parseJson(request));

    const category = await Category.findById(params.id);
    if (!category) {
      throw new ApiError(404, "Categoría no encontrada.");
    }

    if (body.name) {
      category.name = body.name.trim();
      category.slug = createSlug(body.name);
    }

    if (body.description !== undefined) {
      category.description = body.description ?? "";
    }

    if (body.imageUrl !== undefined) {
      category.imageUrl = body.imageUrl ?? "";
    }

    await category.save();

    return jsonOk({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: CategoryRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      throw new ApiError(404, "Categoría no encontrada.");
    }

    return jsonOk({ id: category._id.toString() });
  } catch (error) {
    return handleApiError(error);
  }
}
