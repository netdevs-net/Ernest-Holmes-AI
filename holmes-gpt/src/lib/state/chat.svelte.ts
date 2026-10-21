import type { ChatMessage, HistoryExchange } from "$lib/types/chat";
import { uid } from "$lib/utils/id";
import { history } from "./history.svelte";
import { preferences } from "./preferences.svelte";

const CONNECTION_LOST = "The connection was interrupted.";

class ChatState {
  messages = $state<ChatMessage[]>([]);
  busy = $state(false);

  /** True until the first question — drives the hero vs. conversation layout. */
  empty = $derived(this.messages.length === 0);

  #abort?: AbortController;

  #make(
    role: ChatMessage["role"],
    content: string,
    extra: Partial<ChatMessage> = {},
  ): ChatMessage {
    return { id: uid(), role, content, createdAt: Date.now(), ...extra };
  }

  /** Prior turns the model should remember (never errors or empty drafts). */
  #context(before: number) {
    return this.messages
      .slice(0, before)
      .filter((m) => !m.error && !m.streaming && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }));
  }

  async send(text: string) {
    const question = text.trim();
    if (!question || this.busy) return;

    const context = this.#context(this.messages.length);
    this.messages.push(this.#make("user", question));
    await this.#answer(question, context);
  }

  /** Re-ask the last question with the current response style. */
  async regenerate() {
    if (this.busy) return;
    const lastUser = this.messages.findLastIndex((m) => m.role === "user");
    if (lastUser === -1) return;

    const question = this.messages[lastUser].content;
    const context = this.#context(lastUser);
    this.messages.length = lastUser + 1;
    await this.#answer(question, context);
  }

  async #answer(
    question: string,
    history_: { role: string; content: string }[],
  ) {
    const reply = this.#make("assistant", "", { streaming: true });
    this.messages.push(reply);
    // Work with the reactive proxy so streamed text re-renders.
    const live = this.messages[this.messages.length - 1];

    this.busy = true;
    this.#abort = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: this.#abort.signal,
        body: JSON.stringify({
          message: question,
          history: history_,
          style: preferences.style,
          category: preferences.category,
        }),
      });

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({}) as Record<string, string>);
        live.content = [
          data.error ?? `Request failed (${res.status}).`,
          data.fallback,
        ]
          .filter(Boolean)
          .join("\n\n");
        live.error = true;
        return;
      }

      live.source = res.headers.get("X-Holmes-Model") ?? undefined;

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        live.content += decoder.decode(value, { stream: true });
      }
      live.content += decoder.decode();

      if (!live.content.trim()) {
        live.content = "I received an empty response. Please try again.";
        live.error = true;
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      live.content = live.content
        ? `${live.content}\n\n*${CONNECTION_LOST}*`
        : `${CONNECTION_LOST} Please try again.`;
      live.error = true;
    } finally {
      live.streaming = false;
      this.busy = false;
      this.#abort = undefined;
      if (!live.error) void history.load();
    }
  }

  /** Stop generating; whatever has streamed so far is kept. */
  stop() {
    this.#abort?.abort();
  }

  /** Re-open a saved exchange without spending another request. */
  restore(exchange: HistoryExchange) {
    this.stop();
    this.messages = [
      this.#make("user", exchange.question),
      this.#make("assistant", exchange.answer, {
        source: exchange.source ?? undefined,
      }),
    ];
  }

  reset() {
    this.stop();
    this.messages = [];
  }
}

export const chat = new ChatState();
