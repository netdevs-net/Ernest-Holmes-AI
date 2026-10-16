<script lang="ts">
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { theme } from "$lib/state/theme.svelte";

  const dark = $derived(theme.resolved === "dark");
</script>

<button
  type="button"
  class="btn btn-ghost btn-icon"
  onclick={() => theme.toggle()}
  aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
  title={dark ? "Light mode" : "Dark mode"}
>
  {#if dark}<Sun size={20} />{:else}<Moon size={20} />{/if}
</button>
