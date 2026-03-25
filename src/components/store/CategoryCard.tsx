import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export function CategoryCard({ category }: { category: CategorySummary }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="flex h-full flex-col gap-3 transition hover:-translate-y-1 hover:border-brand-blue/40">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {category.description ?? "Productos seleccionados para tu dia a dia."}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
          Ver productos
        </span>
      </Card>
    </Link>
  );
}
