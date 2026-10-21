<script lang="ts">
  import X from "@lucide/svelte/icons/x";
  import type { Snippet } from "svelte";

  interface Props {
    open: boolean;
    title: string;
    description?: string;
    onclose: () => void;
    size?: "md" | "lg";
    children: Snippet;
  }

  let { open, title, description, onclose, size = "md", children }: Props = $props();

  let dialog = $state<HTMLDialogElement>();
  const titleId = `dialog-title-${Math.random().toString(36).slice(2, 8)}`;

  // Native <dialog> gives us focus trapping, Escape, inert background and
  // focus restoration for free.
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });

  function onbackdrop(event: MouseEvent) {
    if (event.target === dialog) onclose();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  aria-labelledby={titleId}
  onclose={onclose}
  onclick={onbackdrop}
  class="sheet glass"
  class:sheet-lg={size === "lg"}
>
  {#if open}
    <header class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div class="min-w-0">
        <h2 id={titleId} class="text-xl font-semibold tracking-tight">{title}</h2>
        {#if description}
          <p class="mt-0.5 text-sm text-ink-2">{description}</p>
        {/if}
      </div>
      <button type="button" class="btn btn-ghost btn-icon -mr-2" onclick={onclose} aria-label="Close">
        <X size={20} />
      </button>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      {@render children()}
    </div>
  {/if}
</dialog>

<style>
  .sheet {
    margin: auto;
    padding: 0;
    width: min(92vw, 36rem);
    max-height: min(85dvh, 44rem);
    border-radius: 1.75rem;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    flex-direction: column;
    background: color-mix(in srgb, var(--surface) 96%, transparent);
  }

  .sheet-lg {
    width: min(94vw, 48rem);
  }

  .sheet[open] {
    display: flex;
    animation: pop 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .sheet::backdrop {
    background: rgba(5, 12, 20, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    animation: fade 0.25s ease;
  }

  @media (max-width: 640px) {
    .sheet,
    .sheet-lg {
      width: 100vw;
      max-width: 100vw;
      max-height: 90dvh;
      margin: auto 0 0;
      border-radius: 1.75rem 1.75rem 0 0;
    }
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.98);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
  }
</style>
