import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6">
      {icon ? <div className="text-2xl text-brand-blue">{icon}</div> : null}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
