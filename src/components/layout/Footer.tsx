import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 text-sm text-slate-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-base font-semibold text-slate-900">Supermercado El Negro</p>
            <p>Compras rápidas, precios claros y entrega confiable.</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              2 sucursales en la ciudad
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Sucursales
            </p>
            <div className="space-y-2 text-sm">
              <p>Centro · Av. Libertad 123</p>
              <p>Norte · Ruta 8 km 12</p>
              <p className="text-xs text-slate-500">Lun a Sáb 8:00-21:00 · Dom 9:00-13:00</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Enlaces rápidos
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="hover:text-slate-900">
                Sobre nosotros
              </Link>
              <Link href="/contact" className="hover:text-slate-900">
                Contacto
              </Link>
              <Link href="/offers" className="hover:text-slate-900">
                Ofertas
              </Link>
              <Link href="/products" className="hover:text-slate-900">
                Productos
              </Link>
            </div>
            <p className="text-xs text-slate-500">Atención al cliente: 0800-123-ELNEGRO</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          (c) 2026 Supermercado El Negro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
