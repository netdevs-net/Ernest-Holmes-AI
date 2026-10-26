<script lang="ts">
  import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
  import LogIn from "@lucide/svelte/icons/log-in";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { ui } from "$lib/state/ui.svelte";

  const items = [
    {
      href: "/admin",
      label: "Admin dashboard",
      hint: "Saved questions, answers and security metrics",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/login",
      label: "Admin sign-in",
      hint: "Sign in with the admin password",
      icon: LogIn,
    },
  ];
</script>

<ul class="flex flex-col gap-2">
  {#each items as item (item.href)}
    {@const Icon = item.icon}
    <li>
      <a
        href={item.href}
        class="flex items-center gap-3 rounded-2xl border border-line p-3.5 transition-colors hover:border-line-strong hover:bg-sunken"
        onclick={() => ui.close()}
      >
        <Icon size={20} aria-hidden="true" class="text-accent" />
        <span class="min-w-0 flex-1">
          <span class="block font-medium">{item.label}</span>
          <span class="block text-sm text-ink-2">{item.hint}</span>
        </span>
        <ChevronRight size={18} aria-hidden="true" class="text-ink-3" />
      </a>
    </li>
  {/each}
</ul>
