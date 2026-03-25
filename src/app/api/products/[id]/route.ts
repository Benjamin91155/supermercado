import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { productUpdateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Category from "@/models/Category";

export type ProductRouteProps = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: ProductRouteProps) {
  try {
    await connectToDatabase();

    const product = await Product.findById(params.id).populate("category");
    if (!product) {
      throw new ApiError(404, "Producto no encontrado.");
    }

    const category = product.category as
      | { _id?: { toString?: () => string }; name?: string; slug?: string }
      | null;

    return jsonOk({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      description: product.description,
      isFeatured: product.isFeatured,
      isOffer: product.isOffer,
      category: category
        ? {
            id: category._id?.toString?.() ?? "",
            name: category.name ?? "",
            slug: category.slug ?? ""
          }
        : null,
      createdAt: product.createdAt
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: ProductRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const body = productUpdateSchema.parse(await parseJson(request));

    const product = await Product.findById(params.id);
    if (!product) {
      throw new ApiError(404, "Producto no encontrado.");
    }

    if (body.name) {
      product.name = body.name.trim();
    }

    if (body.price !== undefined) {
      product.price = body.price;
    }

    if (body.stock !== undefined) {
      product.stock = body.stock;
    }

    if (body.imageUrl !== undefined) {
      product.imageUrl = body.imageUrl ?? "";
    }

    if (body.description !== undefined) {
      product.description = body.description;
    }

    if (body.isFeatured !== undefined) {
      product.isFeatured = body.isFeatured;
    }

    if (body.isOffer !== undefined) {
      product.isOffer = body.isOffer;
    }

    if (body.categoryId) {
      const category = await Category.findById(body.categoryId);
      if (!category) {
        throw new ApiError(404, "Categoría no encontrada.");
      }
      product.category = category._id;
    }

    await product.save();

    const populated = await product.populate("category");
    const populatedCategory = populated.category as
      | { _id?: { toString?: () => string }; name?: string; slug?: string }
      | null;

    return jsonOk({
      id: populated._id.toString(),
      name: populated.name,
      price: populated.price,
      stock: populated.stock,
      imageUrl: populated.imageUrl,
      description: populated.description,
      isFeatured: populated.isFeatured,
      isOffer: populated.isOffer,
      category: populatedCategory
        ? {
            id: populatedCategory._id?.toString?.() ?? "",
            name: populatedCategory.name ?? "",
            slug: populatedCategory.slug ?? ""
          }
        : null
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: ProductRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      throw new ApiError(404, "Producto no encontrado.");
    }

    return jsonOk({ id: product._id.toString() });
  } catch (error) {
    return handleApiError(error);
  }
}
