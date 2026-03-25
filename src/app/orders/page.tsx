"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import {
  formatBranch,
  formatCurrency,
  formatFulfillment,
  formatOrderStatus,
  formatPaymentMethod
} from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

type OrderItem = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  branch: string;
  fulfillment?: string;
  scheduledSlot?: string;
  deliveryAddress?: string;
  createdAt: string;
};

type OrdersResponse = {
  items: OrderItem[];
};

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    apiRequest<OrdersResponse>("/api/orders", {}, token)
      .then((data) => {
        if (!isMounted) return;
        setOrders(data.items);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar tus pedidos.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <Card className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">Mis pedidos</h1>
          <p className="text-sm text-slate-600">Inicia sesion para ver tu historial.</p>
          <Link href="/login">
            <Button>Ir a login</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Mis pedidos</h1>
        <p className="text-sm text-slate-600">Seguimiento y estado de tus ultimas compras.</p>
      </div>

      {loading ? (
        <Skeleton className="h-32" />
      ) : error ? (
        <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
          {error}
        </Card>
      ) : orders.length === 0 ? (
        <Card className="text-sm text-slate-600">Todavia no registramos pedidos.</Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  Pedido #{order.id.slice(-6)}
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {formatCurrency(order.total)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Estado: {formatOrderStatus(order.status)}</span>
                <span>Pago: {formatPaymentMethod(order.paymentMethod)}</span>
                <span>Sucursal: {formatBranch(order.branch)}</span>
              </div>
              <div className="text-xs text-slate-500">
                {formatFulfillment(order.fulfillment)}
                {order.scheduledSlot ? ` - ${order.scheduledSlot}` : ""}
              </div>
              {order.deliveryAddress ? (
                <div className="text-xs text-slate-500">Direccion: {order.deliveryAddress}</div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
