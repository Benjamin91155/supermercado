import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12">
      <Section
        eyebrow="Contacto"
        title="Hablemos"
        subtitle="Escribinos para consultas, reclamos o pedidos especiales."
      >
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-4">
            <Input label="Nombre" placeholder="Tu nombre" />
            <Input label="Email" type="email" placeholder="tu@email.com" />
            <Textarea label="Mensaje" placeholder="Contanos en que podemos ayudarte" />
            <Button>Enviar mensaje</Button>
          </Card>
          <Card className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Atencion directa</h3>
            <p className="text-sm text-slate-600">Telefono: +54 11 5555 0000</p>
            <p className="text-sm text-slate-600">Email: hola@supermercadoelnegro.com</p>
            <p className="text-sm text-slate-600">
              WhatsApp: +54 9 11 4444 2222
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}