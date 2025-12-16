import { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "../types/message";
import { fmtTime } from "../utils/format";
import { hashStr, rand01 } from "../utils/random";

type Size = { w: number; h: number };
type Pos = { x: number; y: number; dx: number; dy: number; dur: number };

function intersects(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

export default function BubbleLayer({ messages }: { messages: Message[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [sizes, setSizes] = useState<Map<string, Size>>(new Map());
  const [positions, setPositions] = useState<Map<string, Pos>>(new Map());
  const [bounds, setBounds] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const visible = useMemo(() => messages.slice(0, 16), [messages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setBounds({ w: r.width, h: r.height });
    });
    ro.observe(el);

    const r0 = el.getBoundingClientRect();
    setBounds({ w: r0.width, h: r0.height });

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const next = new Map<string, Size>();
      for (const [id, el] of itemRefs.current.entries()) {
        const r = el.getBoundingClientRect();
        next.set(id, { w: Math.ceil(r.width), h: Math.ceil(r.height) });
      }
      setSizes(next);
    });

    for (const el of itemRefs.current.values()) ro.observe(el);

    const init = new Map<string, Size>();
    for (const [id, el] of itemRefs.current.entries()) {
      const r = el.getBoundingClientRect();
      init.set(id, { w: Math.ceil(r.width), h: Math.ceil(r.height) });
    }
    setSizes(init);

    return () => ro.disconnect();
  }, [visible.length]);

  useEffect(() => {
    if (!bounds.w || !bounds.h) return;
    if (visible.length === 0) return;

    const pad = 14;
    const placed: { id: string; x: number; y: number; w: number; h: number }[] = [];

    const safeRects = [
      { x: 12, y: bounds.h - 12 - 72, w: 72, h: 72 },
    ].map((r) => ({
      x: Math.max(0, Math.min(bounds.w - r.w, r.x)),
      y: Math.max(0, Math.min(bounds.h - r.h, r.y)),
      w: r.w,
      h: r.h,
    }));

    const posMap = new Map<string, Pos>();

    for (const msg of visible) {
      const sz = sizes.get(msg.id) ?? { w: 220, h: 90 };

      const maxX = Math.max(pad, bounds.w - sz.w - pad);
      const maxY = Math.max(pad, bounds.h - sz.h - pad);

      let found = false;

      const seed = hashStr(msg.id);
      const tries = 140;

      for (let t = 0; t < tries; t++) {
        const rx = rand01(seed + t * 7 + 1);
        const ry = rand01(seed + t * 7 + 2);

        const x = pad + Math.floor(rx * (maxX - pad + 1));
        const y = pad + Math.floor(ry * (maxY - pad + 1));

        const rect = { x, y, w: sz.w, h: sz.h };

        if (safeRects.some((s) => intersects(rect, s))) continue;
        if (placed.some((p) => intersects(rect, p))) continue;

        placed.push({ id: msg.id, ...rect });
        found = true;

        const dx = Math.floor((rand01(seed + 999) - 0.5) * 12); // -6..6
        const dy = Math.floor((rand01(seed + 1999) - 0.5) * 10); // -5..5
        const dur = 5 + Math.floor(rand01(seed + 2999) * 5); // 5..9s

        posMap.set(msg.id, { x, y, dx, dy, dur });
        break;
      }

      if (!found) {
        const idx = placed.length;
        const cols = Math.max(1, Math.floor(bounds.w / 260));
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const x = Math.min(maxX, pad + col * 260);
        const y = Math.min(maxY, pad + row * 140);

        placed.push({ id: msg.id, x, y, w: sz.w, h: sz.h });
        posMap.set(msg.id, { x, y, dx: 4, dy: -3, dur: 7 });
      }
    }

    setPositions(posMap);
  }, [visible, sizes, bounds]);
  
  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {visible.map((msg) => {
        const p = positions.get(msg.id) ?? { x: 20, y: 80, dx: 4, dy: -3, dur: 7 };
        const styleVars = {
                ["--dx" as `--${string}`]: `${p.dx}px`,
                ["--dy" as `--${string}`]: `${p.dy}px`,
                ["--dur" as `--${string}`]: `${p.dur}s`,
              } satisfies React.CSSProperties;
        return (
          <div
            key={msg.id}
            className="absolute"
            style={{ transform: `translate3d(${p.x}px, ${p.y}px, 0)` }}
          >
            <div
              ref={(el) => {
                if (!el) itemRefs.current.delete(msg.id);
                else itemRefs.current.set(msg.id, el);
              }}
              className={[
                "w-fit max-w-[min(320px,calc(100vw-36px))]",
                "rounded-full px-6 py-4",
                "border border-white/25",
                "bg-white/20 backdrop-blur-2xl",
                "shadow-[0_0_0_1px_rgba(255,255,255,.08),0_18px_45px_rgba(0,0,0,.45),0_0_30px_rgba(125,211,252,.22)]",
                "relative",
                "animate-floaty",
              ].join(" ")}
              style={styleVars}
            >
              <span className="pointer-events-none absolute left-4 top-3 h-8 w-12 rounded-full bg-white/25 blur-sm" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/80 font-medium">{fmtTime(msg.createdAt)}</span>
                  <span className="text-[11px] text-white/70">{msg.sender ?? "Anon"}</span>
                </div>
                <div className="mt-1 text-[15px] leading-snug text-white/92 break-words">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
