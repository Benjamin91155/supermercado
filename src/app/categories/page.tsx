"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { CategoryCard, type CategorySummary } from "@/components/store/CategoryCard";

type CategoriesResponse = {
  items: CategorySummary[];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest<CategoriesResponse>("/api/categories")
      .then((data) => {
        if (!isMounted) return;
        setCategories(data.items);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar las categorias.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12">
      <Section
        eyebrow="Categorias"
        title="Cada pasillo en la palma de tu mano"
        subtitle="Selecciona una categoria para explorar su stock actualizado."
      >
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40" />
            ))}
          </div>
        ) : error ? (
          <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
            {error}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}