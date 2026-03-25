import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-blue text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-2 text-xs font-medium md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[11px] uppercase tracking-[0.2em]">
            Nuevo
          </span>
          <span>Envío gratis desde $18.000 y retiro en sucursal sin costo.</span>
        </div>
        <Link
          href="/offers"
          className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white/10"
        >
          Ver ofertas
        </Link>
      </div>
    </div>
  );
}
