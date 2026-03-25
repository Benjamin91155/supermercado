"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SidePanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function SidePanel({ open, title, onClose, children }: SidePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/20 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            )}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="mt-4 space-y-4">{children}</div>
      </div>
    </div>
  );
}
