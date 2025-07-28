import { json } from "@sveltejs/kit";
import fs from "fs";
import path from "path";

interface Quote {
  quote: string;
  source: string;
}

let quotesCache: Quote[] = [];

// Load quotes from the JSON file
function loadQuotes(): Quote[] {
  if (quotesCache.length > 0) {
    return quotesCache;
  }

  try {
    const quotesPath = path.join(
      process.cwd(),
      "downloads",
      "training_data",
      "holmes_quotes.json",
    );
    const quotesData = fs.readFileSync(quotesPath, "utf-8");
    const allQuotes: Quote[] = JSON.parse(quotesData);

    // Filter for strong, meaningful quotes under 100 characters
    const meaningfulQuotes = allQuotes.filter(
      (quote) => {
        const cleanQuote = quote.quote.trim();
        
        // Length filter: between 30 and 100 characters
        if (cleanQuote.length < 30 || cleanQuote.length > 100) {
          return false;
        }
        
        // Quality filters: exclude metadata, corrections, etc.
        const excludePatterns = [
          "***", "Transcriber", "GUTENBERG", "correction", "printer",
          "page", "chapter", "section", "footnote", "endnote",
          "ibid", "op cit", "et al", "vol", "ed", "p.", "pp.",
          "©", "copyright", "all rights reserved", "public domain"
        ];
        
        const lowerQuote = cleanQuote.toLowerCase();
        for (const pattern of excludePatterns) {
          if (lowerQuote.includes(pattern.toLowerCase())) {
            return false;
          }
        }
        
        // Strength filters: look for powerful words and concepts
        const strengthWords = [
          "power", "divine", "spirit", "mind", "consciousness", "truth",
          "love", "wisdom", "faith", "belief", "reality", "creation",
          "infinite", "eternal", "perfect", "harmony", "peace", "joy",
          "abundance", "healing", "transformation", "awakening",
          "presence", "essence", "nature", "principle", "law"
        ];
        
        const hasStrengthWord = strengthWords.some(word => 
          lowerQuote.includes(word.toLowerCase())
        );
        
        // Must have at least one strength word or be a complete thought
        return hasStrengthWord || 
               (cleanQuote.includes(".") && cleanQuote.length > 40) ||
               (cleanQuote.includes("!") && cleanQuote.length > 30) ||
               (cleanQuote.includes("?") && cleanQuote.length > 35);
      }
    );

    quotesCache = meaningfulQuotes;
    return meaningfulQuotes;
  } catch (error) {
    console.error("Error loading quotes:", error);
    return [];
  }
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
    // Get latest quotes (assuming they're in chronological order)
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
