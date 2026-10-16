import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Quote } from "$lib/types/chat";

const TRAINING_DIR = join(process.cwd(), "downloads", "training_data");

const QUOTE_FILES = [
  "holmes_powerful_quotes.json",
  "enhanced_holmes_quotes.json",
  "holmes_quotes.json",
];

const DEFAULT_SOURCE = "The Science of Mind";

let quotes: Quote[] | undefined;

function normalize(data: unknown): Quote[] {
  const raw = (data as { quotes?: unknown[] })?.quotes ?? [];
  const out: Quote[] = [];
  for (const entry of raw) {
    if (typeof entry === "string") {
      out.push({ quote: entry, source: DEFAULT_SOURCE });
    } else if (entry && typeof entry === "object") {
      const r = entry as { quote?: string; text?: string; source?: string };
      const text = r.quote || r.text;
      if (text) out.push({ quote: text, source: r.source || DEFAULT_SOURCE });
    }
  }
  return out;
}

/** Loaded once and cached for the life of the process. */
export function allQuotes(): Quote[] {
  if (quotes) return quotes;

  for (const file of QUOTE_FILES) {
    const path = join(TRAINING_DIR, file);
    if (!existsSync(path)) continue;
    try {
      const parsed = normalize(JSON.parse(readFileSync(path, "utf-8")));
      if (parsed.length > 0) {
        quotes = parsed;
        return parsed;
      }
    } catch (error) {
      console.error(`Could not read quotes from ${file}:`, error);
    }
  }

  console.warn("No quote files found in downloads/training_data");
  quotes = [];
  return quotes;
}

/** Fisher–Yates; the old `sort(() => 0.5 - Math.random())` is biased. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const STOP_WORDS = new Set([
  "that",
  "this",
  "with",
  "have",
  "from",
  "what",
  "does",
  "about",
  "would",
  "could",
  "should",
  "there",
  "their",
  "which",
  "when",
  "your",
  "into",
  "than",
  "then",
  "them",
  "were",
  "been",
  "being",
  "will",
  "just",
  "like",
  "really",
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z']+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

/** Picks the quotes that share the most vocabulary with the question. */
export function relevantQuotes(question: string, max: number): string[] {
  if (max <= 0) return [];
  const pool = allQuotes();
  if (pool.length === 0) return [];

  const terms = new Set(words(question));
  const scored = pool
    .map((q) => {
      const text = q.quote.toLowerCase();
      let score = 0;
      for (const term of terms) if (text.includes(term)) score += 2;
      return { quote: q.quote, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.quote);

  return scored.length > 0
    ? scored
    : shuffle(pool)
        .slice(0, max)
        .map((q) => q.quote);
}
