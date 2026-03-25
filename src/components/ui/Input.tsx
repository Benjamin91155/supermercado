import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
      {label ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20",
          error ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20" : "",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs text-brand-red">{error}</span> : null}
    </label>
  );
}
