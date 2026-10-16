import type { HistoryExchange, HistoryItem } from "$lib/types/chat";

class HistoryState {
  items = $state<HistoryItem[]>([]);
  loading = $state(false);
  error = $state("");

  count = $derived(this.items.length);
  bookmarked = $derived(this.items.filter((i) => i.isBookmarked).length);

  async load(query = "", bookmarkedOnly = false) {
    this.loading = true;
    this.error = "";
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (bookmarkedOnly) params.set("bookmarked", "1");
      const res = await fetch(`/api/history?${params}`);
      if (!res.ok) throw new Error(String(res.status));
      this.items = (await res.json()).items;
    } catch {
      this.error = "We couldn't load your saved questions.";
    } finally {
      this.loading = false;
    }
  }

  async fetchOne(id: string): Promise<HistoryExchange | null> {
    try {
      const res = await fetch(`/api/history/${id}`);
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }

  async toggleBookmark(id: string) {
    const res = await fetch(`/api/history/${id}`, { method: "PATCH" });
    if (!res.ok) return;
    const { isBookmarked } = await res.json();
    this.items = this.items.map((i) =>
      i.id === id ? { ...i, isBookmarked } : i,
    );
  }

  async remove(id: string) {
    const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
    if (res.ok) this.items = this.items.filter((i) => i.id !== id);
  }
}

export const history = new HistoryState();
