import type { Message } from "../types/message";

const API = import.meta.env.VITE_API_BASE || "";
const base = () => {
  if (!API) throw new Error("Missing VITE_API_BASE");
  return API;
};

export async function fetchMessages(limit = 30): Promise<Message[]> {
  const r = await fetch(`${base()}/api/messages?limit=${limit}`);
  if (!r.ok) throw new Error("Failed to load messages");
  return (await r.json()) as Message[];
}

export async function createMessage(sender: string, content: string): Promise<Message> {
  const r = await fetch(`${base()}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, content }),
  });
  if (!r.ok) throw new Error("Failed to create message");
  return (await r.json()) as Message;
}
