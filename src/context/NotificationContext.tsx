"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type NotificationVariant = "info" | "success" | "error";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  variant: NotificationVariant;
};

export type NotificationContextValue = {
  notifications: NotificationItem[];
  notify: (input: Omit<NotificationItem, "id">) => void;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = (input: Omit<NotificationItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: NotificationItem = { id, ...input };
    setNotifications((prev) => [...prev, item]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((entry) => entry.id !== id));
    }, 4500);
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((entry) => entry.id !== id));
  };

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      notify,
      dismiss
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider.");
  }
  return context;
}
