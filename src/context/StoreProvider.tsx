"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { NotificationProvider } from "@/context/NotificationContext";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
