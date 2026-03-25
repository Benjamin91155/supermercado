import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          404
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          No encontramos esta página
        </h1>
        <p className="max-w-xl text-sm text-slate-600">
          Es posible que el enlace haya cambiado o que el producto ya no esté
          disponible. Volvé al inicio o revisá nuestras ofertas destacadas.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/">
          <Button variant="primary">Volver al inicio</Button>
        </Link>
        <Link href="/offers">
          <Button variant="outline">Ver ofertas</Button>
        </Link>
      </div>
    </main>
  );
}
