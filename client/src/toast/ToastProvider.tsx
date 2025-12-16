import React, { useCallback, useMemo, useState } from "react";
import type { ToastItem, ToastKind } from "./toast";
import ToastViewport from "./ToastViewport";
import { ToastContext, type ToastCtx } from "./toastContext.ts";

type ToastInput = {
  kind?: ToastKind;
  title: string;
  message?: string;
  ttlMs?: number;
};

function id() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((toastId: string) => {
    setItems((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const push = useCallback((t: ToastInput) => {
    const toast: ToastItem = {
      id: id(),
      kind: t.kind ?? "info",
      title: t.title,
      message: t.message,
      ttlMs: t.ttlMs ?? 2600,
      createdAt: Date.now(),
    };

    setItems((prev) => [toast, ...prev].slice(0, 4));
  }, []);

  const api = useMemo<ToastCtx>(
    () => ({
      push,
      success: (title, message) => push({ kind: "success", title, message }),
      error: (title, message) => push({ kind: "error", title, message, ttlMs: 3200 }),
      info: (title, message) => push({ kind: "info", title, message }),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport items={items} onRemove={remove} />
    </ToastContext.Provider>
  );
}
