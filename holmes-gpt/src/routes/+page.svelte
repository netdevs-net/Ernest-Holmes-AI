<script lang="ts">
  import { onMount } from "svelte";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import Clock from "@lucide/svelte/icons/clock";
  import Quote from "@lucide/svelte/icons/quote";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Composer from "$lib/components/Composer.svelte";
  import Thread from "$lib/components/Thread.svelte";
  import { chat } from "$lib/state/chat.svelte";
  import { history } from "$lib/state/history.svelte";
  import { ui } from "$lib/state/ui.svelte";
  import type { Quote as QuoteType } from "$lib/types/chat";
  import { relativeTime } from "$lib/utils/time";

  const suggestions = [
    "How do I pray in the Science of Mind way?",
    "What is a spiritual mind treatment?",
    "Help me let go of fear",
    "What is the Law of Mind?",
    "How can I find my purpose?",
  ];

  let greeting = $state("Welcome");
  let quote = $state<QuoteType | null>(null);

  const recent = $derived(history.items.slice(0, 3));

  onMount(async () => {
    const hour = new Date().getHours();
    greeting = hour < 5 ? "Good evening" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    try {
      const res = await fetch("/api/quotes?random=true&limit=1");
      if (res.ok) quote = (await res.json()).quotes[0] ?? null;
    } catch {
      // The card simply stays hidden.
    }
  });

  async function openRecent(id: string) {
    const exchange = await history.fetchOne(id);
    if (exchange) chat.restore(exchange);
  }
</script>

<svelte:head>
  <title>Holmes AI: Ask Ernest Holmes</title>
  <meta
    name="description"
    content="A conversational AI practitioner inspired by Ernest Holmes, founder of Religious Science and author of The Science of Mind."
  />
</svelte:head>

<div class="flex min-h-0 flex-col" style="height: calc(100dvh - var(--header-h))">
  {#if chat.empty}
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        <div class="rise text-center">
          <p class="eyebrow mb-4">{greeting}</p>
          <h1 class="text-display font-medium text-balance">What is on your heart today?</h1>
        </div>

        <div class="rise mx-auto w-full max-w-2xl" style="animation-delay: 80ms">
          <Composer autofocus busy={chat.busy} onsend={(t) => chat.send(t)} onstop={() => chat.stop()} />
        </div>

        <ul class="rise mx-auto flex max-w-2xl flex-wrap justify-center gap-2" style="animation-delay: 140ms">
          {#each suggestions as suggestion (suggestion)}
            <li>
              <button type="button" class="chip" onclick={() => chat.send(suggestion)}>
                {suggestion}
              </button>
            </li>
          {/each}
        </ul>

        <div class="rise grid gap-3 md:grid-cols-3" style="animation-delay: 200ms">
          <section class="glass card flex flex-col">
            <h2 class="mb-3 flex items-center gap-2 text-sm font-medium text-ink-3">
              <Clock size={16} /> Jump back in
            </h2>
            {#if recent.length}
              <ul class="-mx-2 flex flex-col">
                {#each recent as item (item.id)}
                  <li>
                    <button
                      type="button"
                      class="w-full rounded-xl px-2 py-2 text-left hover:bg-sunken"
                      onclick={() => openRecent(item.id)}
                    >
                      <span class="line-clamp-1 block text-[0.9375rem] font-medium">{item.question}</span>
                      <span class="block text-xs text-ink-3">{relativeTime(item.createdAt)}</span>
                    </button>
                  </li>
                {/each}
              </ul>
              <button type="button" class="mt-auto pt-3 text-left text-sm text-ink-3 hover:text-ink" onclick={() => ui.open("history")}>
                View all {history.count} →
              </button>
            {:else}
              <p class="text-sm text-ink-3">Questions you ask will appear here, so you can return to them.</p>
            {/if}
          </section>

          <section class="glass card flex flex-col">
            <h2 class="mb-3 flex items-center gap-2 text-sm font-medium text-ink-3">
              <Quote size={16} /> A word from Holmes
            </h2>
            {#if quote}
              <blockquote class="line-clamp-5 text-[0.9375rem] leading-relaxed">“{quote.quote}”</blockquote>
            {:else}
              <p class="text-sm text-ink-3">Words from The Science of Mind, one at a time.</p>
            {/if}
            <button type="button" class="mt-auto pt-3 text-left text-sm text-ink-3 hover:text-ink" onclick={() => ui.open("quotes")}>
              More quotes →
            </button>
          </section>

          <section class="glass card flex flex-col">
            <h2 class="mb-3 flex items-center gap-2 text-sm font-medium text-ink-3">
              <Sparkles size={16} /> Mind treatment
            </h2>
            <p class="text-[0.9375rem] leading-relaxed">
              Create a five-part spiritual treatment for healing, prosperity, peace and more.
            </p>
            <button type="button" class="btn btn-soft btn-sm mt-auto self-start" onclick={() => ui.open("treatment")}>
              <BookOpen size={15} /> Create a treatment
            </button>
          </section>
        </div>
      </div>
    </div>
  {:else}
    <Thread />

    <div class="shrink-0 px-4 pb-3 sm:px-6">
      <div class="mx-auto max-w-3xl">
        <Composer
          busy={chat.busy}
          placeholder="Ask a follow-up…"
          autofocus
          onsend={(t) => chat.send(t)}
          onstop={() => chat.stop()}
        />
        <p class="mt-2.5 text-center text-sm font-medium text-ink-2">
          Holmes AI can make mistakes and is not a substitute for medical or mental-health care.
        </p>
      </div>
    </div>
  {/if}
</div>
