import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "red" | "neutral";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  blue: "bg-brand-blue/10 text-brand-blue",
  red: "bg-brand-red/10 text-brand-red",
  neutral: "bg-slate-100 text-slate-600"
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
