"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export type FavoritesContextValue = {
  items: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
const STORAGE_KEY = "supermercado_favorites_v1";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as FavoriteItem[];
      setItems(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isFavorite = (id: string) => items.some((item) => item.id === id);

  const toggleFavorite = (item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.some((entry) => entry.id === item.id);
      if (exists) {
        return prev.filter((entry) => entry.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const clearFavorites = () => setItems([]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      items,
      isFavorite,
      toggleFavorite,
      clearFavorites
    }),
    [items]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider.");
  }
  return context;
}
