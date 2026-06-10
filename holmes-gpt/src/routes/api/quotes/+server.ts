import { json } from "@sveltejs/kit";
import fs from "fs";
import path from "path";

interface Quote {
  quote: string;
  source: string;
}

let quotesCache: Quote[] = [];

const QUOTE_FILES = [
  "holmes_powerful_quotes.json",
  "enhanced_holmes_quotes.json",
  "holmes_quotes.json",
];

function normalizeQuotes(data: unknown): Quote[] {
  const raw = (data as { quotes?: unknown[] })?.quotes ?? [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") {
        return { quote: entry, source: "The Science of Mind" };
      }
      if (entry && typeof entry === "object") {
        const record = entry as {
          quote?: string;
          text?: string;
          source?: string;
        };
        const quote = record.quote || record.text;
        if (!quote) return null;
        return {
          quote,
          source: record.source || "The Science of Mind",
        };
      }
      return null;
    })
    .filter((entry): entry is Quote => entry !== null);
}

// Load quotes from training data JSON files
function loadQuotes(): Quote[] {
  if (quotesCache.length > 0) {
    return quotesCache;
  }

  const trainingDir = path.join(process.cwd(), "downloads", "training_data");

  for (const fileName of QUOTE_FILES) {
    try {
      const quotesPath = path.join(trainingDir, fileName);
      if (!fs.existsSync(quotesPath)) {
        continue;
      }

      const quotesData = fs.readFileSync(quotesPath, "utf-8");
      const data = JSON.parse(quotesData);
      const allQuotes = normalizeQuotes(data);

      if (allQuotes.length > 0) {
        quotesCache = allQuotes;
        console.log(`Loaded ${allQuotes.length} quotes from ${fileName}`);
        return allQuotes;
      }
    } catch (error) {
      console.error(`Error loading quotes from ${fileName}:`, error);
    }
  }

  console.error("No quote files could be loaded from downloads/training_data");
  return [];
}

export async function GET({ url }) {
  const quotes = loadQuotes();

  // Get query parameters
  const searchTerm = url.searchParams.get("search") || "";
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const random = url.searchParams.get("random") === "true";

  let filteredQuotes = quotes;

  // Filter by search term if provided
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredQuotes = quotes.filter(
      (quote) =>
        quote.quote.toLowerCase().includes(term) ||
        quote.source.toLowerCase().includes(term),
    );
  }

  // Get random quotes if requested
  if (random) {
    const shuffled = [...filteredQuotes].sort(() => 0.5 - Math.random());
    filteredQuotes = shuffled.slice(0, limit);
  } else {
    filteredQuotes = filteredQuotes.slice(0, limit);
  }

  return json({
    quotes: filteredQuotes,
    total: quotes.length,
    filtered: filteredQuotes.length,
    searchTerm,
    limit,
  });
}
