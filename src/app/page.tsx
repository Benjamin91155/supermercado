"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProductCard, type ProductSummary } from "@/components/store/ProductCard";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CategoryCard, type CategorySummary } from "@/components/store/CategoryCard";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ProductsResponse = {
  items: ProductSummary[];
};

type CategoriesResponse = {
  items: CategorySummary[];
};

const features = [
  {
    title: "Entrega puntual",
    description: "Ruteo inteligente y confirmacion en tiempo real de tu pedido."
  },
  {
    title: "Precios transparentes",
    description: "Ofertas reales y etiquetas claras, sin sorpresas."
  },
  {
    title: "Stock actualizado",
    description: "Sabes que esta disponible antes de agregarlo al carrito."
  }
];

const testimonials = [
  {
    name: "Luz M.",
    quote: "Llegan rapido y con todo lo que pedi. El carrito es super claro.",
    location: "Sucursal Central"
  },
  {
    name: "Martin P.",
    quote: "Las ofertas son reales y los precios se mantienen estables.",
    location: "Sucursal Norte"
  },
  {
    name: "Carla S.",
    quote: "Me gusta que puedo elegir retiro en tienda sin perder tiempo.",
    location: "Compra online"
  }
];

const stats = [
  { label: "Productos activos", value: "+1200" },
  { label: "Pedidos mensuales", value: "+8k" },
  { label: "Ahorro promedio", value: "18%" }
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [featured, setFeatured] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const trimmedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiRequest<ProductsResponse>("/api/products?featured=true&limit=6"),
      apiRequest<CategoriesResponse>("/api/categories")
    ])
      .then(([productsData, categoriesData]) => {
        if (!isMounted) return;
        setFeatured(productsData.items);
        setCategories(categoriesData.items.slice(0, 6));
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar la informacion inicial.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    if (!trimmedSearch) return;
    router.push(`/products?q=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-soft">
        <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 animate-fade-up">
            <Badge variant="blue">Compra inteligente</Badge>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Todo el supermercado en un solo lugar
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              Descubri productos frescos, ofertas reales y entrega rapida en nuestras dos
              sucursales.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg">Explorar productos</Button>
              </Link>
              <Link href="/offers">
                <Button size="lg" variant="outline">
                  Ver ofertas
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Input
                label="Buscar"
                placeholder="Leche, arroz, frutas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline" size="lg" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="flex flex-col gap-2 animate-fade-up">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Sucursal Central
              </p>
              <p className="text-lg font-semibold text-slate-900">Av. Siempre Viva 123</p>
              <p className="text-sm text-slate-600">Lun a Sab · 8:00 a 21:00</p>
              <Badge variant="red">Envios en 60 minutos</Badge>
            </Card>
            <Card className="flex flex-col gap-2 animate-fade-up">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Sucursal Norte
              </p>
              <p className="text-lg font-semibold text-slate-900">Ruta 8 Km 33,5</p>
              <p className="text-sm text-slate-600">Lun a Dom · 9:00 a 20:00</p>
              <Badge variant="blue">Retiro sin filas</Badge>
            </Card>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Beneficios"
        title="Compras sin friccion"
        subtitle="Optimizado para que termines tu compra en pocos minutos."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="space-y-2 hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Destacados"
        title="Productos que vuelan del stock"
        subtitle="Seleccionados por nuestro equipo para compras rapidas y seguras."
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
            {featured.map((product) => (
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

      <Section
        eyebrow="Categorias"
        title="Compra por seccion"
        subtitle="Agrupamos productos para que encuentres todo en segundos."
      >
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Section>

      <section className="rounded-3xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 via-white to-brand-red/10 p-10 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Semana de ofertas reales</h2>
            <p className="text-sm text-slate-600">
              Descuentos en bebidas, limpieza y productos frescos.
            </p>
          </div>
          <Link href="/offers">
            <Button size="lg">Ver promociones</Button>
          </Link>
        </div>
      </section>

      <Section
        eyebrow="Impacto"
        title="Nuestro compromiso en numeros"
        subtitle="Crecemos con cada compra y cada barrio."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Testimonios"
        title="Clientes que vuelven"
        subtitle="Lo que dicen quienes ya compran con nosotros."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="space-y-3">
              <p className="text-sm text-slate-600">“{item.quote}”</p>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
