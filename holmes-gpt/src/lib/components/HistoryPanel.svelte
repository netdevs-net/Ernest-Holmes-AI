<script lang="ts">
  import Bookmark from "@lucide/svelte/icons/bookmark";
  import Search from "@lucide/svelte/icons/search";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import { chat } from "$lib/state/chat.svelte";
  import { history } from "$lib/state/history.svelte";
  import { ui } from "$lib/state/ui.svelte";
  import { relativeTime } from "$lib/utils/time";

  let query = $state("");
  let onlyBookmarked = $state(false);
  let opening = $state<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;

  // Reload when the filter changes; debounce typing.
  $effect(() => {
    const q = query;
    const b = onlyBookmarked;
    clearTimeout(timer);
    timer = setTimeout(() => void history.load(q, b), q ? 250 : 0);
    return () => clearTimeout(timer);
  });

  async function open(id: string) {
    opening = id;
    const exchange = await history.fetchOne(id);
    opening = null;
    if (!exchange) return;
    chat.restore(exchange);
    ui.close();
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-wrap items-center gap-2">
    <div class="relative min-w-0 flex-1">
      <Search size={16} class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
      <label for="history-search" class="sr-only">Search your questions</label>
      <input
        id="history-search"
        type="search"
        class="field pl-10"
        placeholder="Search your questions"
        bind:value={query}
      />
    </div>
    <button
      type="button"
      class="btn btn-sm {onlyBookmarked ? 'btn-primary' : 'btn-soft'}"
      aria-pressed={onlyBookmarked}
      onclick={() => (onlyBookmarked = !onlyBookmarked)}
    >
      <Bookmark size={15} fill={onlyBookmarked ? "currentColor" : "none"} /> Saved
    </button>
  </div>

  {#if history.error}
    <p class="text-sm text-danger" role="alert">{history.error}</p>
  {:else if history.loading && history.items.length === 0}
    <p class="py-8 text-center text-sm text-ink-3">Loading…</p>
  {:else if history.items.length === 0}
    <div class="py-10 text-center">
      <p class="font-medium">
        {query || onlyBookmarked ? "Nothing matches that." : "No questions yet."}
      </p>
      <p class="mt-1 text-sm text-ink-3">
        {query || onlyBookmarked
          ? "Try a different search."
          : "Your conversations are saved here, on this device's browser session."}
      </p>
    </div>
  {:else}
    <ul class="flex flex-col gap-2">
      {#each history.items as item (item.id)}
        <li class="group relative rounded-2xl border border-line bg-sunken transition-colors hover:border-line-strong">
          <button
            type="button"
            class="block w-full rounded-2xl p-4 pr-24 text-left"
            onclick={() => open(item.id)}
            disabled={opening === item.id}
          >
            <span class="block font-medium leading-snug">{item.question}</span>
            {#if item.preview}
              <span class="mt-1 line-clamp-2 block text-sm text-ink-2">{item.preview}</span>
            {/if}
            <span class="mt-2 block text-xs text-ink-3">
              {relativeTime(item.createdAt)}
              {#if item.tags.length}· {item.tags.slice(0, 3).join(", ")}{/if}
            </span>
          </button>

          <div class="absolute right-2 top-2 flex gap-0.5">
            <button
              type="button"
              class="btn btn-ghost btn-icon btn-sm !h-9 !w-9 !min-h-0"
              aria-label={item.isBookmarked ? "Remove bookmark" : "Bookmark"}
              aria-pressed={item.isBookmarked}
              onclick={() => history.toggleBookmark(item.id)}
            >
              <Bookmark
                size={16}
                fill={item.isBookmarked ? "currentColor" : "none"}
                class={item.isBookmarked ? "text-accent" : ""}
              />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-icon btn-sm !h-9 !w-9 !min-h-0"
              aria-label="Delete question"
              onclick={() => history.remove(item.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
