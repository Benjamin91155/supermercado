"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { apiRequest } from "@/lib/api-client";
import type { PublicUser } from "@/types/api";

export type AuthContextValue = {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "supermercado_token_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    setToken(stored);
    apiRequest<{ user: PublicUser }>("/api/auth/me", {}, stored)
      .then((data) => setUser(data.user))
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: PublicUser }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password })
      }
    );

    setToken(data.token);
    setUser(data.user);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, data.token);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: PublicUser }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      }
    );

    setToken(data.token);
    setUser(data.user);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, data.token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
