// import { useState } from "react";

// export default function MessageComposer({
//   onSend,
//   loading,
// }: {
//   onSend: (content: string) => Promise<void> | void;
//   loading?: boolean;
// }) {
//   const [content, setContent] = useState("");

//   async function send() {
//     const text = content.trim();
//     if (!text) return;
//     await onSend(text);
//     setContent("");
//   }

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-4">
//       <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/12 backdrop-blur-2xl shadow-glow p-3">
//         <div className="flex gap-2">
//           <input
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && send()}
//             maxLength={280}
//             placeholder="Nhập lời nhắn… (Enter để gửi)"
//             className="flex-1 rounded-2xl bg-slate-950/35 border border-white/10 px-4 py-3 outline-none
//                        placeholder:text-white/50 text-white/90
//                        focus:border-white/25 focus:bg-slate-950/45 transition"
//           />
//           <button
//             onClick={send}
//             disabled={!!loading}
//             className="rounded-2xl bg-white text-slate-950 px-5 py-3 font-semibold
//                        hover:bg-white/90 active:scale-[0.98] transition
//                        disabled:opacity-60 disabled:active:scale-100"
//           >
//             {loading ? "Đang gửi…" : "Gửi"}
//           </button>
//         </div>

//         <div className="mt-2 flex items-center justify-between text-xs text-white/70 px-1">
//           <span>{content.trim().length}/280</span>
//           <span className="hidden sm:block">Bong bóng sẽ lơ lửng trên màn hình ✨</span>
//         </div>
//       </div>
//     </div>
//   );
// }
