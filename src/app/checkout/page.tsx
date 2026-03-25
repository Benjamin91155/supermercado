"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

const defaultSlots = [
  "Hoy 10:00 - 12:00",
  "Hoy 12:00 - 14:00",
  "Hoy 18:00 - 20:00",
  "Mañana 10:00 - 12:00",
  "Mañana 18:00 - 20:00"
];

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { notify } = useNotifications();
  const [branch, setBranch] = useState("central");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [fulfillment, setFulfillment] = useState("delivery");
  const [scheduledSlot, setScheduledSlot] = useState(defaultSlots[0]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const summaryItems = useMemo(() => items, [items]);

  const handleSubmit = async () => {
    if (!token) {
      setError("Necesitas iniciar sesion para continuar.");
      return;
    }

    if (fulfillment === "delivery" && deliveryAddress.trim().length < 5) {
      setError("La direccion de envio es obligatoria.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await apiRequest<{ id: string }>(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity
            })),
            branch,
            paymentMethod,
            fulfillment,
            scheduledSlot,
            deliveryAddress
          })
        },
        token
      );

      clearCart();
      setMessage("Pedido confirmado. Te avisaremos cuando salga a reparto.");
      notify({
        title: "Pedido confirmado",
        message: "Ya estamos preparando tu compra.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos confirmar tu pedido.";
      const errorMessage =
        typeof requestError === "object" && requestError && "message" in requestError
          ? String(requestError.message)
          : fallback;
      setError(errorMessage);
      notify({
        title: "Error en el pedido",
        message: errorMessage,
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <Card className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-600">Inicia sesion para completar tu compra.</p>
          <Link href="/login">
            <Button>Ir a login</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
        <p className="text-sm text-slate-600">
          Hola {user.name}, revisa el resumen antes de confirmar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <Select label="Modalidad" value={fulfillment} onChange={(event) => setFulfillment(event.target.value)}>
            <option value="delivery">Envio a domicilio</option>
            <option value="pickup">Retiro en sucursal</option>
          </Select>
          {fulfillment === "delivery" ? (
            <Input
              label="Direccion de envio"
              placeholder="Calle y numero"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
            />
          ) : null}
          <Select label="Horario" value={scheduledSlot} onChange={(event) => setScheduledSlot(event.target.value)}>
            {defaultSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
          <Select label="Sucursal" value={branch} onChange={(event) => setBranch(event.target.value)}>
            <option value="central">Sucursal Central</option>
            <option value="north">Sucursal Norte</option>
          </Select>
          <Select
            label="Metodo de pago"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="card">Tarjeta</option>
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia</option>
          </Select>
          {message ? (
            <Card className="border-brand-blue/30 bg-brand-blue/5 text-sm text-brand-blue">
              {message}
            </Card>
          ) : null}
          {error ? (
            <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
              {error}
            </Card>
          ) : null}
          <Button size="lg" onClick={handleSubmit} disabled={loading || items.length === 0}>
            {loading ? "Confirmando..." : "Confirmar pedido"}
          </Button>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
          <div className="space-y-2 text-sm text-slate-600">
            {summaryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </Card>
      </div>
    </main>
  );
}