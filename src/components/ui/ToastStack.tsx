"use client";

import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

const variantClasses = {
  info: "border-brand-blue/30 bg-brand-blue/10 text-brand-ink",
  success: "border-emerald-300/40 bg-emerald-50 text-emerald-700",
  error: "border-brand-red/30 bg-brand-red/10 text-brand-red"
};

export function ToastStack() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-soft animate-fade-up",
            variantClasses[item.variant]
          )}
        >
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs opacity-80">{item.message}</p>
          </div>
          <button
            className="text-xs font-semibold opacity-70 hover:opacity-100"
            onClick={() => dismiss(item.id)}
          >
            Cerrar
          </button>
        </div>
      ))}
    </div>
  );
}
