export type Role = "user" | "assistant";

export type ResponseStyle = "modern" | "his-words";

export type Category =
  "spiritual" | "practical" | "metaphysical" | "personal" | "general";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  /** Model that produced an assistant message. */
  source?: string;
  error?: boolean;
  /** True while tokens are still arriving. */
  streaming?: boolean;
  createdAt: number;
}

/** One saved exchange as returned by the history API. */
export interface HistoryItem {
  id: string;
  question: string;
  category: Category;
  tags: string[];
  isBookmarked: boolean;
  preview: string;
  source: string | null;
  createdAt: string;
}

export interface HistoryExchange extends HistoryItem {
  answer: string;
}

export interface Quote {
  quote: string;
  source: string;
}

export const MAX_MESSAGE_LENGTH = 1000;
