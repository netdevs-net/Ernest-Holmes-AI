import type { Category, ResponseStyle } from "$lib/types/chat";
import { safeStorage } from "$lib/utils/storage";

const KEY = "holmes:style";
const CATEGORY_KEY = "holmes:category";

export const CATEGORIES = [
  "spiritual",
  "practical",
  "metaphysical",
  "personal",
  "general",
] as const;

class Preferences {
  style = $state<ResponseStyle>("modern");
  /** "auto" lets the server infer a topic from the question. */
  category = $state<Category | "auto">("auto");

  init() {
    const saved = safeStorage.get(KEY);
    if (saved === "modern" || saved === "his-words") this.style = saved;

    const cat = safeStorage.get(CATEGORY_KEY);
    if (
      cat &&
      (cat === "auto" || (CATEGORIES as readonly string[]).includes(cat))
    ) {
      this.category = cat as Category | "auto";
    }
  }

  setCategory(category: Category | "auto") {
    this.category = category;
    safeStorage.set(CATEGORY_KEY, category);
  }

  setStyle(style: ResponseStyle) {
    this.style = style;
    safeStorage.set(KEY, style);
  }
}

export const preferences = new Preferences();
