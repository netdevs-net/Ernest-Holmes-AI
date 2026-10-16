<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** Small label above the title. */
    eyebrow?: string;
    title: string;
    /** One-paragraph introduction under the title. */
    lead?: string;
    /** "narrow" (default, reading width) or "wide" for card grids. */
    width?: "narrow" | "wide";
    children: Snippet;
  }

  let { eyebrow, title, lead, width = "narrow", children }: Props = $props();
</script>

<main class="mx-auto w-full px-4 pt-12 pb-20 sm:px-6 sm:pt-16 {width === 'wide' ? 'max-w-5xl' : 'max-w-3xl'}">
  <header class="rise mb-10 sm:mb-14">
    {#if eyebrow}<p class="eyebrow mb-3">{eyebrow}</p>{/if}
    <h1 class="text-display font-medium text-balance">{title}</h1>
    {#if lead}
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2 text-pretty">{lead}</p>
    {/if}
  </header>

  <div class="flex flex-col gap-12 sm:gap-16">
    {@render children()}
  </div>
</main>
