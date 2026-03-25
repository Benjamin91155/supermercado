"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard, type ProductSummary } from "@/components/store/ProductCard";
import { ProductGrid } from "@/components/store/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ProductsResponse = {
  items: ProductSummary[];
};

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    apiRequest<ProductsResponse>(`/api/products?category=${slug}`)
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.items);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar la categoria.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12">
      <Section
        eyebrow="Categoria"
        title={slug ? slug.replace(/-/g, " ") : "Productos"}
        subtitle="Productos disponibles en esta seccion."
      >
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        ) : error ? (
          <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
            {error}
          </Card>
        ) : (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() =>
                  toggleFavorite({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                  })
                }
                onAdd={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                  })
                }
              />
            ))}
          </ProductGrid>
        )}
      </Section>
    </main>
  );
}
