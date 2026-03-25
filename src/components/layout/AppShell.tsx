"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastStack } from "@/components/ui/ToastStack";

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 bg-white px-4 py-2 text-sm font-semibold text-brand-blue focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Saltar al contenido principal
      </a>
      {isAdminRoute ? null : <AnnouncementBar />}
      {isAdminRoute ? null : <Header />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {isAdminRoute ? null : <Footer />}
      <ToastStack />
    </div>
  );
}
