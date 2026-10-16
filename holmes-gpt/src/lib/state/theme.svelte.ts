import { safeStorage } from "$lib/utils/storage";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const KEY = "holmes:theme";

class ThemeState {
  mode = $state<ThemeMode>("system");
  resolved = $state<ResolvedTheme>("light");

  #media?: MediaQueryList;

  /** Call once from the root layout on mount. */
  init() {
    const saved = safeStorage.get(KEY);
    this.mode = saved === "light" || saved === "dark" ? saved : "system";

    this.#media = window.matchMedia("(prefers-color-scheme: dark)");
    this.#media.addEventListener("change", () => this.apply());
    this.apply();
  }

  private apply() {
    const dark =
      this.mode === "dark" ||
      (this.mode === "system" && Boolean(this.#media?.matches));
    this.resolved = dark ? "dark" : "light";
    document.documentElement.dataset.theme = this.resolved;
  }

  set(mode: ThemeMode) {
    this.mode = mode;
    safeStorage.set(KEY, mode);
    this.apply();
  }

  toggle() {
    this.set(this.resolved === "dark" ? "light" : "dark");
  }
}

export const theme = new ThemeState();
