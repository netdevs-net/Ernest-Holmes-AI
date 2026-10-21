<script lang="ts">
  import { onMount } from "svelte";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Square from "@lucide/svelte/icons/square";
  import { MAX_MESSAGE_LENGTH } from "$lib/types/chat";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import Film from "@lucide/svelte/icons/film";
  import UserCheck from "@lucide/svelte/icons/user-check";
  import { history } from "$lib/state/history.svelte";
  import { CATEGORIES, preferences } from "$lib/state/preferences.svelte";
  import { ui } from "$lib/state/ui.svelte";
  import type { Category } from "$lib/types/chat";
  import StyleToggle from "./StyleToggle.svelte";

  interface Props {
    busy?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    onsend: (text: string) => void;
    onstop?: () => void;
  }

  let {
    busy = false,
    placeholder = "Ask Ernest Holmes anything…",
    autofocus = false,
    onsend,
    onstop,
  }: Props = $props();

  let value = $state("");
  let field = $state<HTMLTextAreaElement>();
  // Prevents sending mid-composition (IME) and double submits.
  let composing = false;

  const trimmed = $derived(value.trim());
  const canSend = $derived(trimmed.length > 0 && !busy);
  const nearLimit = $derived(value.length > MAX_MESSAGE_LENGTH * 0.8);

  export function focus() {
    field?.focus();
  }

  function resize() {
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 200)}px`;
  }

  $effect(() => {
    void value;
    resize();
  });

  onMount(() => {
    // Skip autofocus on touch devices so the keyboard doesn't cover the page.
    if (autofocus && window.matchMedia("(pointer: fine)").matches) field?.focus();
  });

  function submit() {
    if (!canSend) return;
    onsend(trimmed);
    value = "";
    field?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey && !composing && !event.isComposing) {
      event.preventDefault();
      submit();
    }
  }
</script>

<form
  class="glass rounded-[1.75rem] p-3 shadow-float transition-shadow focus-within:border-line-strong"
  onsubmit={(e) => {
    e.preventDefault();
    submit();
  }}
>
  <div class="flex items-center justify-between gap-2 px-1 pb-2">
    <div class="flex gap-1.5">
      <button type="button" class="chip max-sm:!px-3" aria-label="History" title="History" onclick={() => ui.open("history")}>
        <BookOpen size={16} /> <span class="hidden sm:inline">History</span>{#if history.count > 0}<span class="hidden text-ink-3 sm:inline">({history.count})</span>{/if}
      </button>
      <button type="button" class="chip max-sm:!px-3" aria-label="Quotes" title="Quotes" onclick={() => ui.open("quotes")}>
        <Film size={16} /> <span class="hidden sm:inline">Quotes</span>
      </button>
      <button type="button" class="chip max-sm:!px-3" aria-label="Treatment" title="Treatment" onclick={() => ui.open("treatment")}>
        <UserCheck size={16} /> <span class="hidden sm:inline">Treatment</span>
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm text-ink-3">
      <span class="sr-only sm:not-sr-only">Topic</span>
      <select
        class="field !min-h-9 w-auto cursor-pointer !rounded-full !py-1 !pr-8 !pl-3 text-sm capitalize"
        value={preferences.category}
        onchange={(e) => preferences.setCategory(e.currentTarget.value as Category | "auto")}
      >
        <option value="auto">Auto</option>
        {#each CATEGORIES as c (c)}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </label>
  </div>

  <label for="composer" class="sr-only">Your question</label>
  <textarea
    id="composer"
    bind:this={field}
    bind:value
    {onkeydown}
    oncompositionstart={() => (composing = true)}
    oncompositionend={() => (composing = false)}
    rows="1"
    maxlength={MAX_MESSAGE_LENGTH}
    {placeholder}
    enterkeyhint="send"
    autocomplete="off"
    class="block max-h-[200px] w-full resize-none bg-transparent px-2 pt-1.5 pb-2 text-base leading-relaxed text-ink outline-none placeholder:text-ink-3"
  ></textarea>

  <div class="flex items-center justify-between gap-3 pt-1">
    <StyleToggle />

    <div class="flex items-center gap-3">
      {#if nearLimit}
        <span class="text-xs tabular-nums text-ink-3" aria-live="polite">
          {value.length}/{MAX_MESSAGE_LENGTH}
        </span>
      {/if}

      {#if busy && onstop}
        <button
          type="button"
          class="btn btn-primary btn-icon rounded-full"
          onclick={onstop}
          aria-label="Stop generating"
        >
          <Square size={14} fill="currentColor" />
        </button>
      {:else}
        <button
          type="submit"
          class="btn btn-primary btn-icon rounded-full"
          disabled={!canSend}
          aria-label="Send question"
        >
          <ArrowUp size={18} strokeWidth={2.4} />
        </button>
      {/if}
    </div>
  </div>
</form>
