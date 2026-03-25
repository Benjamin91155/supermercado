import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
      {label ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          "min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20",
          className
        )}
        {...props}
      />
    </label>
  );
}
