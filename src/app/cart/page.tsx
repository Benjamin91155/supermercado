"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuantitySelector } from "@/components/store/QuantitySelector";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, removeItem, setItemQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
        <EmptyState
          title="Tu carrito esta vacio"
          description="Explora nuestras categorias y arma tu compra en minutos."
          actionLabel="Ir a productos"
          onAction={() => (window.location.href = "/products")}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Tu carrito</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
              </div>
              <QuantitySelector
                value={item.quantity}
                onChange={(value) => setItemQuantity(item.id, value)}
              />
              <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                Quitar
              </Button>
            </Card>
          ))}
        </div>
        <Card className="h-fit space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Envio</span>
            <span>Gratis</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="w-full">
              Ir al checkout
            </Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}