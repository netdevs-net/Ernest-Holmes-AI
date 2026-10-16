<script lang="ts">
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";
  import Mail from "@lucide/svelte/icons/mail";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import { treatmentCategories, treatmentTemplates } from "$lib/data/treatments";
  import { ui } from "$lib/state/ui.svelte";
  import { MAX_MESSAGE_LENGTH } from "$lib/types/chat";

  type View = "choose" | "result";

  let view = $state<View>("choose");
  let selected = $state("general");
  let intention = $state("");
  let text = $state("");
  let title = $state("");
  let generating = $state(false);
  let error = $state("");
  let copied = $state(false);
  let abort: AbortController | undefined;

  const MAX_INTENTION = 600;

  /** Splits "**TITLE**\nbody" blocks into sections. */
  const sections = $derived.by(() => {
    const parts = text.split(/\*\*([A-Z ]+)\*\*/).slice(1);
    const out: { heading: string; body: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      out.push({ heading: parts[i].trim(), body: (parts[i + 1] ?? "").trim() });
    }
    return out;
  });

  function useTemplate() {
    const template = treatmentTemplates[selected];
    title = template.title;
    text = template.template;
    error = "";
    view = "result";
  }

  async function personalize() {
    const wish = intention.trim();
    if (!wish || generating) return;

    generating = true;
    error = "";
    text = "";
    title = "Your personal treatment";
    view = "result";
    abort = new AbortController();

    try {
      const res = await fetch("/api/treatment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({ intention: wish }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}) as Record<string, string>);
        error = data.error ?? `Request failed (${res.status}).`;
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        error = "The connection was interrupted. Please try again.";
      }
    } finally {
      generating = false;
    }
  }

  function back() {
    abort?.abort();
    view = "choose";
    error = "";
  }

  const plain = $derived(sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n") || text);

  async function copy() {
    try {
      await navigator.clipboard.writeText(plain);
      copied = true;
      setTimeout(() => (copied = false), 1600);
    } catch {
      error = "Copying isn't available in this browser.";
    }
  }

  $effect(() => () => abort?.abort());
</script>

{#if view === "choose"}
  <div class="flex flex-col gap-6">
    <section aria-labelledby="t-templates">
      <h3 id="t-templates" class="eyebrow mb-3">Start from a treatment</h3>
      <div class="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Treatment type">
        {#each treatmentCategories as category (category.id)}
          <button
            type="button"
            role="radio"
            aria-checked={selected === category.id}
            class="rounded-2xl border p-3.5 text-left transition-colors
              {selected === category.id
              ? 'border-ink bg-sunken'
              : 'border-line hover:border-line-strong'}"
            onclick={() => (selected = category.id)}
          >
            <span class="block font-medium">{category.name}</span>
            <span class="block text-sm text-ink-2">{category.description}</span>
          </button>
        {/each}
      </div>
      <button type="button" class="btn btn-primary mt-4 w-full sm:w-auto" onclick={useTemplate}>
        Show this treatment
      </button>
    </section>

    <hr class="border-line" />

    <section aria-labelledby="t-personal">
      <h3 id="t-personal" class="eyebrow mb-1">Or write your own</h3>
      <p class="mb-3 text-sm text-ink-3">
        Describe what you want the treatment to hold and Holmes AI will compose it in five parts.
      </p>
      <label for="intention" class="sr-only">Your intention</label>
      <textarea
        id="intention"
        class="field min-h-28 resize-y"
        bind:value={intention}
        maxlength={MAX_INTENTION}
        placeholder="e.g. I want to feel at peace about a big decision at work…"
      ></textarea>
      <div class="mt-2 flex items-center justify-between gap-3">
        <span class="text-xs tabular-nums text-ink-3">{intention.length}/{MAX_INTENTION}</span>
        <button
          type="button"
          class="btn btn-primary"
          disabled={!intention.trim() || generating}
          onclick={personalize}
        >
          <Sparkles size={16} /> Compose my treatment
        </button>
      </div>
    </section>
  </div>
{:else}
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <button type="button" class="btn btn-ghost btn-sm -ml-2" onclick={back}>
        <ArrowLeft size={16} /> Back
      </button>
      <h3 class="font-semibold">{title}</h3>
    </div>

    {#if error}
      <p class="text-danger" role="alert">{error}</p>
    {/if}

    {#if generating && !text}
      <p class="py-8 text-center text-sm text-ink-3" role="status">Composing your treatment…</p>
    {/if}

    <div class="flex flex-col gap-4" aria-live="polite" aria-busy={generating}>
      {#each sections as section (section.heading)}
        <section class="rise rounded-2xl border border-line bg-sunken p-4">
          <h4 class="eyebrow mb-1.5 text-accent">{section.heading}</h4>
          <p class="whitespace-pre-line leading-relaxed">{section.body}</p>
        </section>
      {/each}

      {#if sections.length === 0 && text}
        <p class="whitespace-pre-line leading-relaxed">{text}</p>
      {/if}
    </div>

    {#if text && !generating}
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-soft" onclick={copy}>
          {#if copied}<Check size={16} /> Copied{:else}<Copy size={16} /> Copy{/if}
        </button>
        <button type="button" class="btn btn-soft" onclick={() => ui.share(plain)}>
          <Mail size={16} /> Share by email
        </button>
      </div>
    {/if}
  </div>
{/if}
