import type { ReactNode } from "react";

export type SectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
