<script lang="ts">
  import { onMount } from "svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Pause from "@lucide/svelte/icons/pause";
  import Play from "@lucide/svelte/icons/play";
  import RotateCw from "@lucide/svelte/icons/rotate-cw";
  import { chat } from "$lib/state/chat.svelte";
  import { ui } from "$lib/state/ui.svelte";
  import type { Quote } from "$lib/types/chat";

  let quotes = $state<Quote[]>([]);
  let index = $state(0);
  let loading = $state(true);
  let error = $state("");
  let playing = $state(false);

  const current = $derived(quotes[index]);

  async function load() {
    loading = true;
    error = "";
    try {
      const res = await fetch("/api/quotes?random=true&limit=12");
      if (!res.ok) throw new Error();
      quotes = (await res.json()).quotes;
      index = 0;
    } catch {
      error = "We couldn't load quotes right now.";
    } finally {
      loading = false;
    }
  }

  function go(delta: number) {
    if (quotes.length > 1) index = (index + delta + quotes.length) % quotes.length;
  }

  onMount(() => {
    // Autoplay only for people who haven't asked for reduced motion.
    playing = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    void load();
  });

  $effect(() => {
    if (!playing || quotes.length < 2) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  });

  function ask() {
    if (!current) return;
    ui.close();
    void chat.send(`What did you mean by: “${current.quote}”`);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="flex flex-col gap-5" {onkeydown} role="group" aria-label="Quotes from Ernest Holmes">
  {#if loading}
    <p class="py-12 text-center text-sm text-ink-3">Gathering words…</p>
  {:else if error}
    <div class="py-10 text-center">
      <p class="text-danger" role="alert">{error}</p>
      <button type="button" class="btn btn-soft btn-sm mt-3" onclick={load}>Try again</button>
    </div>
  {:else if current}
    <figure class="flex min-h-56 flex-col justify-center rounded-3xl border border-line bg-sunken px-6 py-8 sm:px-10">
      <span aria-hidden="true" class="mb-1 font-serif text-7xl leading-[0.7] text-accent">“</span>
      {#key index}
        <blockquote class="rise text-xl leading-relaxed font-medium tracking-tight text-ink sm:text-2xl" aria-live="polite">
          {current.quote}
        </blockquote>
      {/key}
      <figcaption class="mt-4 text-sm text-ink-2">Ernest Holmes, {current.source}</figcaption>
    </figure>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-1">
        <button type="button" class="btn btn-soft btn-icon" onclick={() => go(-1)} aria-label="Previous quote">
          <ChevronLeft size={18} />
        </button>
        <button type="button" class="btn btn-soft btn-icon" onclick={() => go(1)} aria-label="Next quote">
          <ChevronRight size={18} />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-icon"
          onclick={() => (playing = !playing)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {#if playing}<Pause size={18} />{:else}<Play size={18} />{/if}
        </button>
        <button type="button" class="btn btn-ghost btn-icon" onclick={load} aria-label="Load new quotes">
          <RotateCw size={18} />
        </button>
        <span class="ml-2 text-sm tabular-nums text-ink-3">{index + 1} / {quotes.length}</span>
      </div>

      <button type="button" class="btn btn-primary" onclick={ask}>Ask Holmes about this</button>
    </div>
  {:else}
    <p class="py-12 text-center text-sm text-ink-3">No quotes available.</p>
  {/if}
</div>
