<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import Header from "$lib/components/Header.svelte";
  import Panels from "$lib/components/Panels.svelte";
  import { history } from "$lib/state/history.svelte";
  import { preferences } from "$lib/state/preferences.svelte";
  import { theme } from "$lib/state/theme.svelte";

  let { children } = $props();

  const onHome = $derived(page.url.pathname === "/");

  onMount(() => {
    theme.init();
    preferences.init();
    void history.load();
  });
</script>

<svelte:head>
  <link
    rel="preload"
    href="/fonts/Satoshi-Variable.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="backdrop" aria-hidden="true"></div>

<div class="flex min-h-dvh flex-col">
  <Header />

  <div class="flex flex-1 flex-col">
    {@render children()}
  </div>

  {#if !onHome}
    <footer class="border-t border-line/60 py-8 text-center text-sm text-ink-3">
      <nav class="mb-2 flex justify-center gap-5" aria-label="Footer">
        <a href="/about" class="hover:text-ink">About</a>
        <a href="/support" class="hover:text-ink">Support</a>
        <a href="/privacy" class="hover:text-ink">Privacy</a>
      </nav>
      <p>© {new Date().getFullYear()} HolmesAI</p>
    </footer>
  {/if}
</div>

<Panels />
