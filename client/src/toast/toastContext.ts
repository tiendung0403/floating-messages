import { createContext } from "react";
import type { ToastKind } from "./toast";

export type ToastInput = {
  kind?: ToastKind;
  title: string;
  message?: string;
  ttlMs?: number;
};

export type ToastCtx = {
  push: (t: ToastInput) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

export const ToastContext = createContext<ToastCtx | null>(null);
