import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { env } from "$env/dynamic/private";
import type { ResponseStyle } from "$lib/types/chat";
import { relevantQuotes } from "./knowledge";
import {
  HOLMES_COMPACT_PROMPT,
  HOLMES_SYSTEM_PROMPT,
  MODERN_COMPACT_PROMPT,
  MODERN_SYSTEM_PROMPT,
  SECURITY_BOUNDARY,
  STYLE_RULES,
  TREATMENT_PROMPT,
} from "./prompts";

export const DEFAULT_MODEL = "claude-haiku-4-5";

let client: Anthropic | undefined;
let cachedKey: string | undefined;

/** Docker secret first, then the environment. Result is cached. */
export function apiKey(): string {
  if (cachedKey !== undefined) return cachedKey;
  try {
    const secret = readFileSync(
      "/run/secrets/anthropic_api_key",
      "utf8",
    ).trim();
    if (secret && secret !== "your-anthropic-api-key-here") {
      cachedKey = secret;
      return secret;
    }
  } catch {
    // No secret mounted — fall through to the environment variable.
  }
  cachedKey = env.ANTHROPIC_API_KEY?.trim() ?? "";
  return cachedKey;
}

export function isConfigured(): boolean {
  return apiKey() !== "" && apiKey() !== "your-anthropic-api-key-here";
}

function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: apiKey(), maxRetries: 3 });
  return client;
}

export function model(): string {
  return env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

function flag(name: string, fallback: boolean): boolean {
  const v = env[name]?.trim().toLowerCase();
  return v ? ["1", "true", "yes"].includes(v) : fallback;
}

function int(name: string, fallback: number, max: number): number {
  const parsed = Number.parseInt(env[name] ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0
    ? Math.min(parsed, max)
    : fallback;
}

export interface TurnMessage {
  role: "user" | "assistant";
  content: string;
}

/** Keeps the last few turns, well-formed for the Messages API. */
export function sanitizeHistory(
  raw: unknown,
  { maxTurns = 6, maxChars = 2000 } = {},
): TurnMessage[] {
  if (!Array.isArray(raw)) return [];

  const clean: TurnMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      continue;
    }
    const text = content.trim().slice(0, maxChars);
    const last = clean[clean.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n\n${text}`.slice(0, maxChars);
    } else {
      clean.push({ role, content: text });
    }
  }

  let window = clean.slice(-maxTurns);
  // The API requires the first turn to be from the user.
  while (window.length > 0 && window[0].role !== "user")
    window = window.slice(1);
  // History is followed by the new user message, so it must end on the assistant.
  while (window.length > 0 && window[window.length - 1].role !== "assistant") {
    window = window.slice(0, -1);
  }
  return window;
}

function personaPrompt(style: ResponseStyle): string {
  const compact = flag("ANTHROPIC_COMPACT_PROMPT", true);
  if (style === "his-words") {
    return compact ? HOLMES_COMPACT_PROMPT : HOLMES_SYSTEM_PROMPT;
  }
  return compact ? MODERN_COMPACT_PROMPT : MODERN_SYSTEM_PROMPT;
}

type SystemBlocks = string | Anthropic.TextBlockParam[];

function buildSystem(base: string, dynamic: string): SystemBlocks {
  if (!flag("ANTHROPIC_PROMPT_CACHE", true)) return base + dynamic;
  return [
    { type: "text", text: base, cache_control: { type: "ephemeral" } },
    ...(dynamic ? [{ type: "text" as const, text: dynamic }] : []),
  ];
}

/**
 * Belt and braces: even if the model slips, no em or en dash reaches the page.
 * Both are single characters, so this is safe to apply chunk by chunk.
 */
export function removeDashes(text: string): string {
  return text
    .replace(/[ \t]*[\u2014\u2015][ \t]*/g, ", ")
    .replace(/(\d)[ \t]*\u2013[ \t]*(\d)/g, "$1 to $2")
    .replace(/[ \t]*\u2013[ \t]*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/,(?=\s*[.!?:;])/g, "");
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  /** USD, using Claude Haiku 4.5 list pricing ($1 / $5 per million tokens). */
  cost: number;
}

export interface ReplyStream {
  /** Resolves with the first text chunk, or throws if the request failed first. */
  first: string;
  /** The remaining chunks, as an async iterable. */
  rest: AsyncIterable<string>;
  done: Promise<{ text: string; usage: Usage }>;
}

interface ChatRequest {
  question: string;
  history: TurnMessage[];
  style: ResponseStyle;
}

function toUsage(u?: { input_tokens?: number; output_tokens?: number }): Usage {
  const inputTokens = u?.input_tokens ?? 0;
  const outputTokens = u?.output_tokens ?? 0;
  return {
    inputTokens,
    outputTokens,
    cost: inputTokens * 1e-6 + outputTokens * 5e-6,
  };
}

/**
 * Starts a streamed completion and waits for the first token, so failures
 * (auth, rate limit, overload) surface as a normal HTTP error instead of a
 * half-open stream.
 */
async function open(
  system: SystemBlocks,
  messages: TurnMessage[],
  maxTokens: number,
  signal?: AbortSignal,
): Promise<ReplyStream> {
  const stream = getClient().messages.stream(
    {
      model: model(),
      max_tokens: maxTokens,
      temperature: 0.7,
      system,
      messages,
    },
    { signal },
  );

  const queue: string[] = [];
  let wake: (() => void) | undefined;
  let finished = false;
  let failure: unknown;

  stream.on("text", (delta) => {
    queue.push(removeDashes(delta));
    wake?.();
  });

  const done = stream.finalMessage().then(
    (message) => {
      finished = true;
      wake?.();
      const text = removeDashes(
        message.content.map((b) => (b.type === "text" ? b.text : "")).join(""),
      );
      return { text, usage: toUsage(message.usage) };
    },
    (error) => {
      finished = true;
      failure = error;
      wake?.();
      throw error;
    },
  );
  // Avoid an unhandled rejection if nobody awaits `done` after a failed start.
  done.catch(() => {});

  const next = async (): Promise<string | undefined> => {
    while (queue.length === 0) {
      if (finished) {
        if (failure) throw failure;
        return undefined;
      }
      await new Promise<void>((resolve) => (wake = resolve));
    }
    return queue.shift();
  };

  const first = await next();
  if (first === undefined) {
    throw new Error("The model returned an empty response.");
  }

  async function* rest() {
    for (;;) {
      const chunk = await next();
      if (chunk === undefined) return;
      yield chunk;
    }
  }

  return { first, rest: rest(), done };
}

export async function streamChat(
  { question, history, style }: ChatRequest,
  signal?: AbortSignal,
): Promise<ReplyStream> {
  const quotes = relevantQuotes(
    question,
    int("ANTHROPIC_MAX_QUOTES", 1, 2),
  ).map((q) => (q.length > 220 ? `${q.slice(0, 219)}…` : q));

  const dynamic = quotes.length
    ? `\n\n**RELEVANT QUOTES:**\n${quotes.map((q, i) => `${i + 1}. "${q}"`).join("\n")}`
    : "";

  const system = buildSystem(
    `${personaPrompt(style)}\n\n${STYLE_RULES}\n\n${SECURITY_BOUNDARY}`,
    dynamic,
  );

  return open(
    system,
    [...history, { role: "user", content: question }],
    int("ANTHROPIC_MAX_TOKENS", 700, 4000),
    signal,
  );
}

export async function streamTreatment(
  intention: string,
  signal?: AbortSignal,
): Promise<ReplyStream> {
  const system = buildSystem(
    `${TREATMENT_PROMPT}\n\n${STYLE_RULES}\n\n${SECURITY_BOUNDARY}`,
    "",
  );
  return open(
    system,
    [
      {
        role: "user",
        content: `The intention for this treatment: ${intention}`,
      },
    ],
    1400,
    signal,
  );
}

export interface PublicError {
  status: number;
  message: string;
  /** Show an in-character fallback blessing for infrastructure failures. */
  fallback: boolean;
}

/** Maps SDK errors to a safe status/message — upstream codes are never leaked. */
export function describeError(error: unknown): PublicError {
  const status =
    error instanceof Anthropic.APIError ? (error.status ?? 0) : undefined;

  if (status === 401 || status === 403) {
    return {
      status: 503,
      message:
        "The assistant is not available right now. Please try again later.",
      fallback: true,
    };
  }
  if (status === 429) {
    return {
      status: 429,
      message:
        "We are experiencing high demand. Please wait a moment and try again.",
      fallback: false,
    };
  }
  if (status === 400 || status === 413 || status === 422) {
    return {
      status: 400,
      message:
        "That question could not be processed. Please rephrase it and try again.",
      fallback: false,
    };
  }
  return {
    status: status && status >= 500 ? 503 : 502,
    message:
      "The service is temporarily unavailable. Please try again in a few moments.",
    fallback: true,
  };
}
