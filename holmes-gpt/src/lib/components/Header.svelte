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
  <button
    type="button"
    class="scrim fixed inset-0 z-40 cursor-default md:hidden"
    tabindex="-1"
    aria-hidden="true"
    onclick={() => (menuOpen = false)}
  ></button>

  <nav
    id="mobile-menu"
    aria-label="Menu"
    class="drawer fixed top-0 right-0 bottom-0 z-50 flex w-1/2 min-w-48 max-w-xs flex-col overflow-y-auto rounded-l-[1.75rem] md:hidden"
  >
    <div class="flex h-(--header-h) shrink-0 items-center justify-between border-b border-line pr-3 pl-4">
      <span class="text-base font-bold tracking-tight">Menu</span>
      <button
        type="button"
        class="btn btn-ghost btn-icon"
        aria-label="Close menu"
        onclick={() => (menuOpen = false)}
        {@attach (node) => node.focus()}
      >
        <X size={22} />
      </button>
    </div>

    <ul class="flex flex-col px-2 py-2">
      {#each links as link (link.href)}
        {@const Icon = link.icon}
        {@const current = page.url.pathname === link.href}
        <li>
          <a
            href={link.href}
            class="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold tracking-tight {current
              ? 'bg-sunken text-ink'
              : 'text-ink-2 hover:bg-sunken hover:text-ink'}"
            aria-current={current ? "page" : undefined}
          >
            <Icon size={18} aria-hidden="true" class={current ? "text-accent" : "text-ink-3"} />
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="mt-auto flex flex-col gap-2 border-t border-line p-3 pb-6">
      <a href="/" class="btn btn-primary btn-sm !min-h-11 w-full">Ask Holmes</a>
      <button type="button" class="btn btn-soft btn-sm !min-h-11 w-full" onclick={() => theme.toggle()}>
        {#if theme.resolved === "dark"}<Sun size={16} /> Light{:else}<Moon size={16} /> Dark{/if}
      </button>
    </div>
  </nav>
{/if}

<style>
  /* Solid, never see-through. */
  .drawer {
    background: var(--backdrop);
    background-color: var(--paper);
    border-left: 1px solid var(--line-strong);
    border-bottom: 1px solid var(--line-strong);
    box-shadow: var(--shadow-lg);
    animation: slide-in 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .scrim {
    background: rgba(5, 12, 20, 0.5);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    animation: fade-in 0.25s ease;
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }
</style>
