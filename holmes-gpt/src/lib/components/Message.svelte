<script lang="ts">
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import Mail from "@lucide/svelte/icons/mail";
  import RefreshCw from "@lucide/svelte/icons/refresh-cw";
  import { ui } from "$lib/state/ui.svelte";
  import type { ChatMessage } from "$lib/types/chat";
  import { renderMarkdown, stripMarkdown } from "$lib/utils/markdown";
  import Logo from "./Logo.svelte";

  interface Props {
    message: ChatMessage;
    /** Only the latest answer can be regenerated. */
    canRegenerate?: boolean;
    onregenerate?: () => void;
  }

  let { message, canRegenerate = false, onregenerate }: Props = $props();

  const isUser = $derived(message.role === "user");
  const html = $derived(isUser ? "" : renderMarkdown(message.content));
  const waiting = $derived(message.streaming && !message.content);

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    const text = stripMarkdown(message.content);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back to a hidden textarea.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1600);
  }
</script>

{#if isUser}
  <div class="rise flex justify-end">
    <p
      class="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-lg bg-(--user-bubble) px-4 py-2.5 text-(--user-ink) sm:max-w-[75%]"
    >
      {message.content}
    </p>
  </div>
{:else}
  <article class="rise flex gap-3" aria-label="Answer from Holmes AI">
    <div class="mt-1 shrink-0"><Logo size={26} /></div>

    <div class="min-w-0 flex-1">
      <p class="eyebrow mb-1">AI Practitioner</p>

      {#if waiting}
        <div class="flex h-7 items-center gap-1.5" role="status" aria-label="Holmes is thinking">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      {:else}
        <div
          class="prose-holmes text-[1.0625rem] text-ink"
          class:error={message.error}
          class:streaming={message.streaming}
        >
          <!-- Safe: renderMarkdown escapes all HTML before adding its own tags. -->
          {@html html}
        </div>
      {/if}

      {#if !message.streaming && message.content}
        <div class="-ml-2 mt-2 flex flex-wrap items-center gap-1 text-ink-3">
          <button type="button" class="btn btn-ghost btn-sm" onclick={copy}>
            {#if copied}<Check size={15} /> Copied{:else}<Copy size={15} /> Copy{/if}
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onclick={() => ui.share(stripMarkdown(message.content))}
          >
            <Mail size={15} /> Share
          </button>
          {#if canRegenerate && onregenerate}
            <button type="button" class="btn btn-ghost btn-sm" onclick={onregenerate}>
              <RefreshCw size={15} /> Regenerate
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </article>
{/if}

<style>
  .error {
    color: var(--danger);
  }

  .streaming > :global(p:last-child)::after,
  .streaming > :global(h3:last-child)::after,
  .streaming > :global(ul:last-child > li:last-child)::after,
  .streaming > :global(ol:last-child > li:last-child)::after {
    content: "";
    display: inline-block;
    width: 0.5rem;
    height: 1.05em;
    margin-left: 0.15rem;
    vertical-align: text-bottom;
    border-radius: 2px;
    background: var(--accent-bright);
    animation: blink 1s steps(2, start) infinite;
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--ink-3);
    animation: bounce 1.2s ease-in-out infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 0.15s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes blink {
    to {
      visibility: hidden;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      opacity: 0.35;
      transform: translateY(0);
    }
    40% {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
</style>
