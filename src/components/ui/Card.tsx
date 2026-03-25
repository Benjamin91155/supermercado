import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur transition",
        className
      )}
      {...props}
    />
  );
}
