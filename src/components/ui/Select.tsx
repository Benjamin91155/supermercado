import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
      {label ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
