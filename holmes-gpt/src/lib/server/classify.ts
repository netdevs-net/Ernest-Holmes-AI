import type { Category } from "$lib/types/chat";

const TAG_RULES: Array<[RegExp, string]> = [
  [/principle/, "principle"],
  [/meditat/, "meditation"],
  [/pray/, "prayer"],
  [/heal/, "healing"],
  [/success/, "success"],
  [/oneness/, "oneness"],
  [/infinite mind/, "infinite-mind"],
  [/spiritual law/, "spiritual-law"],
  [/creative power/, "creative-power"],
  [/divine intelligence/, "divine-intelligence"],
  [/daily/, "daily-practice"],
  [/challenge/, "challenges"],
  [/problem/, "problems"],
  [/relationship/, "relationships"],
  [/\b(work|career|job)\b/, "work"],
  [/health/, "health"],
  [/money|financial|abundance|prosper/, "money"],
  [/\bfear/, "fear"],
  [/doubt/, "doubt"],
  [/confiden/, "confidence"],
  [/peace/, "peace"],
  [/\bjoy/, "joy"],
  [/\blove/, "love"],
  [/treatment/, "treatment"],
];

export function extractTags(question: string): string[] {
  const text = question.toLowerCase();
  return TAG_RULES.filter(([re]) => re.test(text)).map(([, tag]) => tag);
}

const CATEGORY_RULES: Array<[Category, RegExp]> = [
  [
    "metaphysical",
    /infinite mind|oneness|consciousness|spiritual law|principle|universe|reality|divine mind|creative power/,
  ],
  [
    "spiritual",
    /\b(god|spirit|soul|pray|prayer|meditat|faith|divine|treatment|heal)/,
  ],
  [
    "practical",
    /\b(how (do|can|to)|daily|practice|habit|work|career|money|health|steps?)\b/,
  ],
  [
    "personal",
    /\b(i feel|my (life|family|marriage|relationship|fear|anxiety)|struggl|lonely|grief|anxious)/,
  ],
];

export function categorize(question: string): Category {
  const text = question.toLowerCase();
  return CATEGORY_RULES.find(([, re]) => re.test(text))?.[0] ?? "general";
}
