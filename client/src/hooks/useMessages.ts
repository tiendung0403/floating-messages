import { useEffect, useState } from "react";
import type { Message } from "../types/message";
import { createMessage, fetchMessages } from "../api/messagesApi";
import { useToast } from "../toast/useToast";

export function useMessages(pollMs = 3500) {
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [offlineDemo, setOfflineDemo] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await fetchMessages(40);
    setMessages(data);
    setOfflineDemo(false);
  }

  useEffect(() => {
    load().catch(() => {
      setOfflineDemo(true);
      toast.error("Không tải được dữ liệu", "BE chưa chạy.");
    });

    const t = setInterval(() => load().catch(() => {}), pollMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  async function send(sender: string, content: string) {
    const s = sender.trim() || "Anon";
    const c = content.trim();
    if (!c) return;

    setLoading(true);
    try {
      await createMessage(s, c);
      toast.success("Thành công", "Lời nhắn đã được lưu");
      await load();
    } catch {
      setOfflineDemo(true);
      toast.error("Thất bại", "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return { messages, offlineDemo, loading, reload: load, send };
}
