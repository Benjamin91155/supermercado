import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12">
      <Section
        eyebrow="Sobre nosotros"
        title="Una familia, dos sucursales, miles de compras"
        subtitle="Desde 1998 trabajamos para acercar productos frescos con una atencion cercana."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Calidad diaria</h3>
            <p className="text-sm text-slate-600">
              Seleccionamos proveedores locales para asegurar frescura en cada compra.
            </p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Atencion humana</h3>
            <p className="text-sm text-slate-600">
              Nuestro equipo acompana cada pedido para que llegue perfecto.
            </p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Precios claros</h3>
            <p className="text-sm text-slate-600">
              Ofertas reales y transparencia en cada ticket.
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}