<script lang="ts">
  import { page } from "$app/state";
  import Info from "@lucide/svelte/icons/info";
  import Heart from "@lucide/svelte/icons/heart";
  import Menu from "@lucide/svelte/icons/menu";
  import Plus from "@lucide/svelte/icons/plus";
  import Shield from "@lucide/svelte/icons/shield";
  import X from "@lucide/svelte/icons/x";
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
          class="btn btn-ghost btn-sm"
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

      {#if menuOpen}
        <button
          type="button"
          class="fixed inset-0 z-40 cursor-default"
          tabindex="-1"
          aria-hidden="true"
          onclick={() => (menuOpen = false)}
        ></button>
        <nav
          id="mobile-menu"
          aria-label="Menu"
          class="glass rise absolute right-0 top-12 z-50 w-56 rounded-2xl p-2"
        >
          {#each links as link (link.href)}
            {@const Icon = link.icon}
            <a
              href={link.href}
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] hover:bg-sunken"
              aria-current={page.url.pathname === link.href ? "page" : undefined}
            >
              <Icon size={18} class="text-ink-3" />
              {link.label}
            </a>
          {/each}
        </nav>
      {/if}
    </div>
  </div>
</header>
