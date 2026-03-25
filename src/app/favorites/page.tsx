"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";

export default function FavoritesPage() {
  const { items, toggleFavorite, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
        <EmptyState
          title="Todavia no guardaste favoritos"
          description="Elegi productos y agregalos a tu lista para comprarlos mas rapido."
          actionLabel="Ver productos"
          onAction={() => (window.location.href = "/products")}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Tus favoritos</h1>
        <Button variant="ghost" size="sm" onClick={clearFavorites}>
          Limpiar lista
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-lg font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl
                  })
                }
              >
                Agregar al carrito
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item)}>
                Quitar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Link href="/products">
        <Button variant="outline">Seguir comprando</Button>
      </Link>
    </main>
  );
}
