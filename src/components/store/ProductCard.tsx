import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

export type ProductSummary = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isOffer?: boolean;
  isFeatured?: boolean;
  category?: {
    name: string;
    slug: string;
  } | null;
};

export type ProductCardProps = {
  product: ProductSummary;
  onAdd?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function ProductCard({ product, onAdd, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          {product.category?.name ? (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {product.category.name}
            </p>
          ) : null}
          <Link href={`/products/${product.id}`} className="text-lg font-semibold text-slate-900">
            {product.name}
          </Link>
        </div>
        <div className="flex flex-col items-end gap-2">
          {onToggleFavorite ? (
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={Boolean(isFavorite)}
              onClick={onToggleFavorite}
            >
              {isFavorite ? "Favorito" : "Guardar"}
            </Button>
          ) : null}
          {product.isOffer ? <Badge variant="red">Oferta</Badge> : null}
          {product.isFeatured ? <Badge variant="blue">Destacado</Badge> : null}
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : null}
      </div>
      <p className="text-sm text-slate-600 line-clamp-2">
        {product.description ?? "Producto fresco y listo para agregar al carrito."}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-lg font-semibold text-slate-900">
          {formatCurrency(product.price)}
        </span>
        <Button size="sm" onClick={onAdd}>
          Agregar
        </Button>
      </div>
    </Card>
  );
}
