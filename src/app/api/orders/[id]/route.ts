import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ApiError, handleApiError, jsonOk, parseJson } from "@/lib/api";
import { orderStatusSchema } from "@/lib/validators";
import { requireAdmin, requireAuth } from "@/lib/auth";
import Order from "@/models/Order";

export type OrderRouteProps = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: OrderRouteProps) {
  try {
    const user = await requireAuth(request);
    await connectToDatabase();

    const order = await Order.findById(params.id).populate("user", "name email role");
    if (!order) {
      throw new ApiError(404, "Pedido no encontrado.");
    }

    const userInfo = order.user as
      | { _id?: { toString?: () => string }; name?: string; email?: string; role?: string }
      | null;

    if (user.role !== "admin" && userInfo?._id?.toString?.() !== user._id.toString()) {
      throw new ApiError(403, "No podés acceder a este pedido.");
    }

    return jsonOk({
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
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: OrderRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    const rawBody = (await parseJson(request)) as { status?: string; orderId?: string };
    const rawStatus = rawBody.status ?? "";
    const statusMap: Record<string, string> = {
      pendiente: "pending",
      pagado: "paid",
      enviado: "shipped",
      cancelado: "cancelled"
    };
    const normalizedStatus =
      statusMap[String(rawStatus).toLowerCase()] ?? String(rawStatus);

    const body = orderStatusSchema.parse({ status: normalizedStatus });
    const targetId = rawBody.orderId ?? params.id;

    const order = await Order.findById(targetId);
    if (!order) {
      throw new ApiError(404, "Pedido no encontrado.");
    }

    order.status = body.status;
    await order.save();

    return jsonOk({ id: order._id.toString(), status: order.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: OrderRouteProps) {
  try {
    await requireAdmin(request);
    await connectToDatabase();

    let targetId = params.id;
    try {
      const body = (await request.json()) as { orderId?: string };
      if (body?.orderId) {
        targetId = body.orderId;
      }
    } catch {
      // Si no hay body, seguimos con el ID de la URL.
    }

    const order = await Order.findByIdAndDelete(targetId);
    if (!order) {
      throw new ApiError(404, "Pedido no encontrado.");
    }

    return jsonOk({ id: order._id.toString() });
  } catch (error) {
    return handleApiError(error);
  }
}
