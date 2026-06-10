export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  source?: string;
  error?: boolean;
};

export function createChatMessage(
  role: ChatMessage["role"],
  content: string,
  extra: Partial<Pick<ChatMessage, "source" | "error">> = {},
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    ...extra,
  };
}

export function messageTimestamp(message: ChatMessage): Date {
  const t = message.timestamp;
  return t instanceof Date ? t : new Date(t);
}
