import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreProvider } from "@/context/StoreProvider";

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Supermercado El Negro",
    template: "%s | Supermercado El Negro"
  },
  description: "E-commerce minimalista para compras rápidas, seguras y confiables.",
  keywords: [
    "supermercado",
    "e-commerce",
    "compras online",
    "alimentos",
    "ofertas",
    "envío a domicilio",
    "verdulería",
    "bebidas"
  ],
  openGraph: {
    title: "Supermercado El Negro",
    description: "Compras rápidas, precios claros y entrega confiable.",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/images/logo.jpg",
        width: 600,
        height: 315,
        alt: "Logo de Supermercado El Negro"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Supermercado El Negro",
    description: "Compras rápidas, precios claros y entrega confiable.",
    images: ["/images/logo.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
