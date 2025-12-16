import { useState } from "react";

export default function ChatDock({
  onSend,
  loading,
}: {
  onSend: (sender: string, content: string) => Promise<void> | void;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");

  async function send() {
    const s = sender.trim() || "Anon";
    const c = content.trim();
    if (!c) return;
    await onSend(s, c);
    setContent("");
    setOpen(false);
  }

  return (
    <div className="fixed left-4 bottom-4 z-50">
      {/* icon button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,.35)]
                   hover:bg-white/15 transition"
        aria-label="Open chat"
      >
        <span className="text-white/90 text-sm font-semibold">💬</span>
      </button>

      {/* panel */}
      {open && (
        <div className="mt-3 w-[min(360px,calc(100vw-2rem))] rounded-3xl border border-white/20 bg-slate-950/40 backdrop-blur-2xl
                        shadow-[0_18px_45px_rgba(0,0,0,.45)] p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/90">Gửi lời nhắn</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl px-2 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              maxLength={40}
              placeholder="Tên người gửi"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white/90
                         outline-none placeholder:text-white/45 focus:border-white/25 focus:bg-white/15 transition"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Nhập lời nhắn…"
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white/90
                         outline-none placeholder:text-white/45 focus:border-white/25 focus:bg-white/15 transition"
            />

            <button
              onClick={send}
              disabled={!!loading}
              className="w-full rounded-2xl bg-white text-slate-900 py-2.5 font-semibold
                         hover:bg-white/90 active:scale-[0.99] transition
                         disabled:opacity-60 disabled:active:scale-100"
            >
              {loading ? "Đang gửi…" : "Gửi"}
            </button>

            <div className="text-[11px] text-white/55 flex justify-between">
              <span>{content.trim().length}/280</span>
              <span>Enter chưa????, gửi để khỏi lỡ nèo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
