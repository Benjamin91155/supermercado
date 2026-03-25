"use client";

import { Button } from "@/components/ui/Button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          Error inesperado
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Algo salió mal
        </h1>
        <p className="max-w-xl text-sm text-slate-600">
          Estamos trabajando para solucionarlo. Podés reintentar la acción o
          volver al inicio.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p className="rounded-lg bg-slate-100 px-4 py-2 text-xs text-slate-500">
            {error.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={reset}>
          Reintentar
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
