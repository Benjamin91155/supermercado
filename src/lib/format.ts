export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatOrderStatus(status?: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    shipped: "Enviado",
    cancelled: "Cancelado"
  };

  if (!status) return "Pendiente";
  return labels[status] ?? status;
}

export function formatPaymentMethod(method?: string) {
  const labels: Record<string, string> = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia"
  };

  if (!method) return "Tarjeta";
  return labels[method] ?? method;
}

export function formatBranch(branch?: string) {
  const labels: Record<string, string> = {
    central: "Central",
    north: "Norte"
  };

  if (!branch) return "Central";
  return labels[branch] ?? branch;
}

export function formatFulfillment(type?: string) {
  const labels: Record<string, string> = {
    delivery: "Envio a domicilio",
    pickup: "Retiro en sucursal"
  };

  if (!type) return "Envio a domicilio";
  return labels[type] ?? type;
}
