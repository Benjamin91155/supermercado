"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard, type ProductSummary } from "@/components/store/ProductCard";
import { ProductGrid } from "@/components/store/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import type { CategorySummary } from "@/components/store/CategoryCard";

type ProductsResponse = {
  items: ProductSummary[];
  total: number;
  page: number;
  pages: number;
};

type CategoriesResponse = {
  items: CategorySummary[];
};

export default function ProductsPage() {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSummary[]>([]);

  useEffect(() => {
    apiRequest<CategoriesResponse>("/api/categories")
      .then((data) => setCategories(data.items))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      apiRequest<ProductsResponse>(`/api/products?q=${encodeURIComponent(search)}&limit=5`)
        .then((data) => setSuggestions(data.items))
        .catch(() => setSuggestions([]));
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (category !== "all") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (onlyFeatured) params.set("featured", "true");
    if (onlyOffers) params.set("offer", "true");
    if (inStock) params.set("inStock", "true");
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");
    return params.toString();
  }, [search, category, minPrice, maxPrice, onlyFeatured, onlyOffers, inStock, sort, page]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      apiRequest<ProductsResponse>(`/api/products?${query}`)
        .then((data) => {
          if (!isMounted) return;
          setProducts(data.items);
          setPages(data.pages);
        })
        .catch(() => {
          if (!isMounted) return;
          setError("No pudimos cargar los productos.");
        })
        .finally(() => {
          if (!isMounted) return;
          setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12">
      <Section
        eyebrow="Productos"
        title="Encuentra todo lo que necesitas"
        subtitle="Busca por categoria, precio o palabras clave."
      >
        <Card className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Input
              label="Buscar"
              placeholder="Leche, arroz, frutas..."
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
            {suggestions.length > 0 ? (
              <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Sugerencias
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className="rounded-xl px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Select
            label="Categoria"
            value={category}
            onChange={(event) => {
              setPage(1);
              setCategory(event.target.value);
            }}
          >
            <option value="all">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input
            label="Precio minimo"
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => {
              setPage(1);
              setMinPrice(event.target.value);
            }}
          />
          <Input
            label="Precio maximo"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => {
              setPage(1);
              setMaxPrice(event.target.value);
            }}
          />
          <Select
            label="Ordenar"
            value={sort}
            onChange={(event) => {
              setPage(1);
              setSort(event.target.value);
            }}
          >
            <option value="newest">Mas nuevos</option>
            <option value="price_asc">Precio menor</option>
            <option value="price_desc">Precio mayor</option>
            <option value="name_asc">Nombre A-Z</option>
            <option value="name_desc">Nombre Z-A</option>
          </Select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(event) => {
                setPage(1);
                setOnlyFeatured(event.target.checked);
              }}
            />
            Destacados
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={onlyOffers}
              onChange={(event) => {
                setPage(1);
                setOnlyOffers(event.target.checked);
              }}
            />
            Ofertas
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => {
                setPage(1);
                setInStock(event.target.checked);
              }}
            />
            Con stock
          </label>
        </Card>
      </Section>

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
        <>
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
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </Button>
            <span className="text-sm text-slate-600">
              Pagina {page} de {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages}
              onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </main>
  );
}