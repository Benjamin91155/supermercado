import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { orderSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (user.role !== "admin") {
      filter.user = user._id;
    }

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    const items = orders.map((order) => {
      const userInfo = order.user as
        | { _id?: { toString?: () => string }; name?: string; email?: string; role?: string }
        | null;

      return {
        id: order._id.toString(),
        user: userInfo
          ? {
              id: userInfo._id?.toString?.() ?? "",
              name: userInfo.name ?? "",
              email: userInfo.email ?? "",
              role: userInfo.role ?? "customer"
            }
          : null,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        branch: order.branch,
        fulfillment: order.fulfillment,
        scheduledSlot: order.scheduledSlot,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt
      };
    });

    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    await connectToDatabase();

    const body = orderSchema.parse(await parseJson(request));
    const productIds = body.items.map((item) => item.productId);
    const uniqueIds = Array.from(new Set(productIds));

    const products = await Product.find({ _id: { $in: uniqueIds } });

    if (products.length !== uniqueIds.length) {
      throw new ApiError(404, "Algunos productos no existen.");
    }

    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const items = body.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new ApiError(404, "Producto no encontrado.");
      }

      if (product.stock < item.quantity) {
        throw new ApiError(400, `Stock insuficiente para ${product.name}.`);
      }

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    const fulfillment = body.fulfillment ?? "delivery";
    const scheduledSlot = body.scheduledSlot ?? "";
    const deliveryAddress = body.deliveryAddress ?? "";

    if (fulfillment === "delivery" && !deliveryAddress) {
      throw new ApiError(400, "La direccion de envio es obligatoria.");
    }

    const order = await Order.create({
      user: user._id,
      items,
      subtotal,
      total,
      paymentMethod: body.paymentMethod ?? "card",
      branch: body.branch ?? "central",
      fulfillment,
      scheduledSlot,
      deliveryAddress
    });

    await Product.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity } }
        }
      }))
    );

    return jsonOk(
      {
        id: order._id.toString(),
        status: order.status,
        total: order.total
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
