"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
  { href: "/offers", label: "Ofertas" },
  { href: "/about", label: "Sobre nosotros" },
  { href: "/contact", label: "Contacto" }
];

export function Header() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();
  const { items: favoriteItems } = useFavorites();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Supermercado El Negro logo"
                width={140}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
              <span className="text-lg font-semibold text-slate-900">
                Supermercado El Negro
              </span>
            </Link>
            <Badge variant="blue">2 sucursales</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {loading ? (
              <Button variant="outline" size="sm" disabled>
                Cargando...
              </Button>
            ) : user ? (
              <>
                <span className="text-sm font-semibold text-slate-700">
                  Hola, {user.name}
                </span>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    Mis pedidos
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Crear cuenta
                  </Button>
                </Link>
              </>
            )}
            <Link href="/cart">
              <Button variant="primary" size="sm">
                Carrito ({itemCount})
              </Button>
            </Link>
            <Link href="/favorites">
              <Button variant="outline" size="sm">
                Favoritos ({favoriteItems.length})
              </Button>
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1 transition hover:bg-slate-100 hover:text-slate-900",
                  isActive ? "bg-slate-100 text-slate-900" : ""
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className={cn(
                "rounded-full px-3 py-1 transition hover:bg-slate-100 hover:text-slate-900",
                pathname.startsWith("/admin") ? "bg-slate-100 text-slate-900" : ""
              )}
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
