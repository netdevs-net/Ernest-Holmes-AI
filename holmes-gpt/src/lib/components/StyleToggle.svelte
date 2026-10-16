<script lang="ts">
  import { preferences } from "$lib/state/preferences.svelte";
  import type { ResponseStyle } from "$lib/types/chat";

  const options: { value: ResponseStyle; label: string; hint: string }[] = [
    { value: "modern", label: "Modern", hint: "Contemporary, conversational language" },
    { value: "his-words", label: "His words", hint: "In Ernest Holmes' own voice" },
  ];
</script>

<div
  role="radiogroup"
  aria-label="Response style"
  class="inline-flex rounded-full border border-line bg-sunken p-0.5 text-[0.8125rem]"
>
  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={preferences.style === option.value}
      title={option.hint}
      class="rounded-full px-3 py-1.5 font-medium transition-colors
        {preferences.style === option.value
        ? 'bg-ink text-paper shadow-sm'
        : 'text-ink-3 hover:text-ink'}"
      onclick={() => preferences.setStyle(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
