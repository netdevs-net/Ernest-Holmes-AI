<script lang="ts">
  import { tick } from "svelte";
  import ArrowDown from "@lucide/svelte/icons/arrow-down";
  import { chat } from "$lib/state/chat.svelte";
  import Message from "./Message.svelte";

  let scroller = $state<HTMLDivElement>();
  let pinned = $state(true);

  const lastAssistant = $derived(chat.messages.findLastIndex((m) => m.role === "assistant"));
  const status = $derived(
    chat.busy ? "Holmes is responding…" : chat.messages.length ? "Response complete." : "",
  );

  function distanceFromBottom() {
    if (!scroller) return 0;
    return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
  }

  function onscroll() {
    pinned = distanceFromBottom() < 80;
  }

  async function toBottom(smooth = false) {
    await tick();
    scroller?.scrollTo({
      top: scroller.scrollHeight,
      behavior: smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto",
    });
  }

  // Follow new text while the reader is at the bottom; leave them alone otherwise.
  $effect(() => {
    void chat.messages.length;
    void chat.messages.at(-1)?.content;
    if (pinned) void toBottom();
  });
</script>

<div class="relative min-h-0 flex-1">
  <div
    bind:this={scroller}
    {onscroll}
    class="h-full overflow-y-auto overscroll-contain"
    aria-busy={chat.busy}
  >
    <div class="mx-auto flex max-w-3xl flex-col gap-7 px-4 pt-6 pb-8 sm:px-6">
      {#each chat.messages as message, i (message.id)}
        <Message
          {message}
          canRegenerate={i === lastAssistant && !chat.busy}
          onregenerate={() => chat.regenerate()}
        />
      {/each}
    </div>
  </div>

  {#if !pinned}
    <button
      type="button"
      class="btn btn-soft btn-icon glass absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full"
      onclick={() => {
        pinned = true;
        void toBottom(true);
      }}
      aria-label="Jump to latest"
    >
      <ArrowDown size={18} />
    </button>
  {/if}

  <p class="sr-only" role="status" aria-live="polite">{status}</p>
</div>
