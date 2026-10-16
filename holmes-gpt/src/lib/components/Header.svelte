<script lang="ts">
  import { page } from "$app/state";
  import Info from "@lucide/svelte/icons/info";
  import Heart from "@lucide/svelte/icons/heart";
  import Menu from "@lucide/svelte/icons/menu";
  import Plus from "@lucide/svelte/icons/plus";
  import Shield from "@lucide/svelte/icons/shield";
  import X from "@lucide/svelte/icons/x";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { theme } from "$lib/state/theme.svelte";
  import { chat } from "$lib/state/chat.svelte";
  import Logo from "./Logo.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  const links = [
    { href: "/about", label: "About", icon: Info },
    { href: "/support", label: "Support", icon: Heart },
    { href: "/privacy", label: "Privacy", icon: Shield },
  ];

  let menuOpen = $state(false);
  const onHome = $derived(page.url.pathname === "/");

  // Close the mobile menu whenever the route changes.
  $effect(() => {
    void page.url.pathname;
    menuOpen = false;
  });

  // Stop the page behind the open menu from scrolling.
  $effect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = previous);
  });

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Escape") menuOpen = false;
  }
</script>

<svelte:window {onkeydown} />

<header
  class="sticky top-0 z-30 h-(--header-h) border-b border-line/60 bg-glass backdrop-blur-xl"
  
>
  <div class="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-8 lg:px-12">
    <a href="/" class="flex items-center gap-2.5 rounded-lg" aria-label="HolmesAI home">
      <Logo size={34} priority />
      <span class="leading-tight">
        <span class="block text-[1.05rem] font-bold tracking-tight">HolmesAI</span>
        <span class="hidden text-xs text-ink-3 sm:block">Ernest Holmes AI Practitioner</span>
      </span>
    </a>

    <div class="flex-1"></div>

    {#if onHome && !chat.empty}
      <button type="button" class="btn btn-soft btn-sm" onclick={() => chat.reset()}>
        <Plus size={16} /> New chat
      </button>
    {/if}

    <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
      {#each links as link (link.href)}
        <a
          href={link.href}
          class="btn btn-ghost btn-sm !font-bold"
          aria-current={page.url.pathname === link.href ? "page" : undefined}
          class:text-ink={page.url.pathname === link.href}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <ThemeToggle />

    <div class="relative md:hidden">
      <button
        type="button"
        class="btn btn-ghost btn-icon"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onclick={() => (menuOpen = !menuOpen)}
      >
        {#if menuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
      </button>

    </div>
  </div>
</header>

{#if menuOpen}
  <!-- Rendered outside <header>: its backdrop-filter would otherwise trap fixed children. -->
  <nav
    id="mobile-menu"
    aria-label="Menu"
    class="menu-sheet rise fixed inset-x-0 bottom-0 z-20 flex flex-col overflow-y-auto px-5 pt-4 pb-8 md:hidden"
    style="top: var(--header-h)"
  >
    <ul class="flex flex-col">
      {#each links as link (link.href)}
        {@const Icon = link.icon}
        {@const current = page.url.pathname === link.href}
        <li class="border-b border-line">
          <a
            href={link.href}
            class="flex items-center gap-4 py-5 text-2xl font-bold tracking-tight {current ? 'text-ink' : 'text-ink-2'}"
            aria-current={current ? "page" : undefined}
          >
            <span
              class="grid size-11 shrink-0 place-items-center rounded-full {current
                ? 'bg-ink text-paper'
                : 'bg-sunken text-ink-2'}"
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <span class="flex-1">{link.label}</span>
            <ChevronRight size={22} class="text-ink-3" aria-hidden="true" />
          </a>
        </li>
      {/each}
    </ul>

    <div class="mt-8 flex flex-col gap-3">
      <a href="/" class="btn btn-primary !min-h-14 w-full text-base">Ask Ernest Holmes</a>
      <button
        type="button"
        class="btn btn-soft !min-h-12 w-full"
        onclick={() => theme.toggle()}
      >
        {#if theme.resolved === "dark"}<Sun size={18} /> Light mode{:else}<Moon size={18} /> Dark mode{/if}
      </button>
    </div>

    <p class="mt-auto pt-8 text-center text-sm text-ink-2">© {new Date().getFullYear()} HolmesAI</p>
  </nav>
{/if}

<style>
  /* Fully opaque, so page content never shows through the menu. */
  .menu-sheet {
    background: var(--backdrop);
    background-color: var(--paper);
    border-top: 1px solid var(--line);
  }
</style>
