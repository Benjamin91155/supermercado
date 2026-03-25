import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { productSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q");
    const categoryParam = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const offer = searchParams.get("offer") === "true";
    const inStock = searchParams.get("inStock") === "true";
    const sortParam = searchParams.get("sort") ?? "newest";
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPrice = minPriceParam !== null ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : undefined;

    const limit = Math.min(Number(searchParams.get("limit") ?? 24), 100);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (categoryParam) {
      const category = isValidObjectId(categoryParam)
        ? await Category.findById(categoryParam)
        : await Category.findOne({ slug: categoryParam });

      if (!category) {
        return jsonOk({ items: [], total: 0, page, pages: 0 });
      }

      filter.category = category._id;
    }

    const hasMinPrice = minPrice !== undefined && !Number.isNaN(minPrice);
    const hasMaxPrice = maxPrice !== undefined && !Number.isNaN(maxPrice);

    if (hasMinPrice || hasMaxPrice) {
      filter.price = {
        ...(hasMinPrice ? { $gte: minPrice } : {}),
        ...(hasMaxPrice ? { $lte: maxPrice } : {})
      };
    }

    if (featured) {
      filter.isFeatured = true;
    }

    if (offer) {
      filter.isOffer = true;
    }

    if (inStock) {
      filter.stock = { $gt: 0 };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 }
    };
    const sort = sortMap[sortParam] ?? sortMap.newest;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    const items = products.map((product) => {
      const category = product.category as
        | { _id?: { toString?: () => string }; name?: string; slug?: string }
        | null;

      return {
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
      };
    });

    return jsonOk({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const body = productSchema.parse(await parseJson(request));

    const category = await Category.findById(body.categoryId);
    if (!category) {
      throw new ApiError(404, "Categoría no encontrada.");
    }

    const product = await Product.create({
      name: body.name.trim(),
      price: body.price,
      category: category._id,
      stock: body.stock,
      imageUrl: body.imageUrl ?? "",
      description: body.description,
      isFeatured: body.isFeatured ?? false,
      isOffer: body.isOffer ?? false
    });

    return jsonOk(
      {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        description: product.description,
        isFeatured: product.isFeatured,
        isOffer: product.isOffer,
        category: {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug
        }
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
