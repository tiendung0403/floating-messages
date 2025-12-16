import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "../types/message";
import { createMessage, fetchMessages } from "../api/messagesApi";
import { useToast } from "../toast/useToast";

type ConnStatus = "connecting" | "online" | "offline";

export function useMessages(pollMs = 3500) {  
  const toast = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [offlineDemo, setOfflineDemo] = useState(false);
  const [loading, setLoading] = useState(false);


  const [status, setStatus] = useState<ConnStatus>("connecting");

  const firstOkRef = useRef(false);

  const load = useCallback(async () => {
    const data = await fetchMessages(40);
    setMessages(data);
    setOfflineDemo(false);
    setStatus("online");

    if (!firstOkRef.current) {
      firstOkRef.current = true;
      toast.success("Đã kết nối server", "");
    }
  }, [toast]);  

  useEffect(() => {
    
    setStatus("connecting");
    firstOkRef.current = false;

   
    load().catch(() => {
      setOfflineDemo(true);
      setStatus("offline");
      toast.error("Không tải được dữ liệu : chắc đang chạy đó , đợi xíu nhé 1 phút là tới liền", "");
    });

    const t = setInterval(() => {
      load().catch(() => {
        setStatus((prev) => (prev === "online" ? "connecting" : prev));
      });
    }, pollMs);

    return () => clearInterval(t);
    
  }, [pollMs, load, toast]);

  async function send(sender: string, content: string) {
    const s = sender.trim() || "Anon";
    const c = content.trim();
    if (!c) return;

    setLoading(true);

    
    if (status !== "online") {
      toast.info("Đang kết nối Đợi xíu khoảng 1p nhé", "");
    }

    try {
      await createMessage(s, c);
      toast.success("Lời nhắn đã được lưu", "");
      await load();
    } catch {
      setOfflineDemo(true);
      setStatus("offline");
      toast.error("Thất bại Không kết nối được server", "");
    } finally {
      setLoading(false);
    }
  }

  return { messages, offlineDemo, loading, status, reload: load, send };
}
