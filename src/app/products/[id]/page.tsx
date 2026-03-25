"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { QuantitySelector } from "@/components/store/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ProductDetail = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  description: string;
  isFeatured?: boolean;
  isOffer?: boolean;
  category?: { name: string; slug: string } | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;
    setLoading(true);
    setError("");

    apiRequest<ProductDetail>(`/api/products/${productId}`)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar el producto.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64" />
        <Skeleton className="h-10 w-1/3" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
          {error || "Producto no encontrado."}
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          ) : null}
        </div>
        <Card className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {product.category?.name ?? "Categoria"}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
              <p className="text-sm text-slate-600">{product.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {product.isOffer ? <Badge variant="red">Oferta</Badge> : null}
              {product.isFeatured ? <Badge variant="blue">Destacado</Badge> : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-slate-500">Stock: {product.stock}</span>
          </div>
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                addItem(
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                  },
                  quantity
                )
              }
            >
              Agregar al carrito
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toggleFavorite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl
                })
              }
            >
              {isFavorite(product.id) ? "Quitar favorito" : "Guardar favorito"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
