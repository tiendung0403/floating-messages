import { useEffect } from "react";
import type { ToastItem } from "./toast";

function tone(kind: ToastItem["kind"]) {
  if (kind === "success") return "border-emerald-300/25 bg-emerald-200/10 text-emerald-50";
  if (kind === "error") return "border-rose-300/25 bg-rose-200/10 text-rose-50";
  return "border-sky-300/25 bg-sky-200/10 text-sky-50";
}
function bar(kind: ToastItem["kind"]) {
  if (kind === "success") return "bg-emerald-300/70";
  if (kind === "error") return "bg-rose-300/70";
  return "bg-sky-300/70";
}

export default function ToastViewport({
  items,
  onRemove,
}: {
  items: ToastItem[];
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timers = items.map((t) =>
      setTimeout(() => onRemove(t.id), t.ttlMs)
    );
    return () => timers.forEach(clearTimeout);
  }, [items, onRemove]);

  return (
    <div className="fixed right-4 top-4 z-[100] w-[min(420px,calc(100vw-2rem))] space-y-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`animate-toastIn overflow-hidden rounded-2xl border backdrop-blur-xl shadow-glow ${tone(t.kind)}`}
        >
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold leading-tight">{t.title}</div>
                {t.message && <div className="mt-1 text-xs opacity-90">{t.message}</div>}
              </div>

              <button
                onClick={() => onRemove(t.id)}
                className="rounded-lg px-2 py-1 text-xs opacity-80 hover:opacity-100 hover:bg-white/10"
                aria-label="Close toast"
              >
                ✕
              </button>
            </div>
          </div>

          {/* progress bar */}
          <div className="h-1 w-full bg-white/10">
            <div
              className={`h-full ${bar(t.kind)}`}
              style={{ animation: `shrink ${t.ttlMs}ms linear forwards` }}
            />
          </div>
        </div>
      ))}

      <style>{`@keyframes shrink{from{width:100%}to{width:0%}}`}</style>
    </div>
  );
}
