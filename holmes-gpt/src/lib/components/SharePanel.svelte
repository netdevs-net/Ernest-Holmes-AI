<script lang="ts">
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import Mail from "@lucide/svelte/icons/mail";
  import { ui } from "$lib/state/ui.svelte";
  import { uid } from "$lib/utils/id";

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  /** Mail clients and browsers cap mailto: URLs; keep the body well under it. */
  const MAILTO_BODY_LIMIT = 1500;

  let address = $state("");
  let sending = $state(false);
  let error = $state("");
  let copied = $state(false);

  const valid = $derived(EMAIL.test(address.trim()));

  function mailBody(text: string): string {
    const excerpt =
      text.length > MAILTO_BODY_LIMIT ? `${text.slice(0, MAILTO_BODY_LIMIT).trimEnd()}…` : text;
    return `I wanted to share this with you from HolmesAI:\n\n${excerpt}\n\nHolmesAI · ${location.origin}`;
  }

  async function send(event: SubmitEvent) {
    event.preventDefault();
    if (!valid || sending) return;
    sending = true;
    error = "";

    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: address.trim(),
          messageContent: ui.shareText,
          messageId: uid(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}) as Record<string, string>);
        error = data.error ?? "Something went wrong. Please try again.";
        return;
      }

      const subject = encodeURIComponent("Guidance from HolmesAI");
      const body = encodeURIComponent(mailBody(ui.shareText));
      // Same-tab navigation: popup blockers silently drop window.open("mailto:").
      location.href = `mailto:${encodeURIComponent(address.trim())}?subject=${subject}&body=${body}`;
      ui.close();
      address = "";
    } catch {
      error = "We couldn't reach the server. Please try again.";
    } finally {
      sending = false;
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(ui.shareText);
      copied = true;
      setTimeout(() => (copied = false), 1600);
    } catch {
      error = "Copying isn't available in this browser.";
    }
  }
</script>

<form class="flex flex-col gap-4" onsubmit={send}>
  <p class="line-clamp-4 rounded-2xl border border-line bg-sunken p-3.5 text-sm text-ink-2">
    {ui.shareText}
  </p>

  <div>
    <label for="share-email" class="mb-1.5 block text-sm font-medium">Recipient's email</label>
    <input
      id="share-email"
      type="email"
      class="field"
      bind:value={address}
      placeholder="friend@example.com"
      autocomplete="email"
      required
    />
  </div>

  {#if error}
    <p class="text-sm text-danger" role="alert">{error}</p>
  {/if}

  <div class="flex flex-wrap gap-2">
    <button type="submit" class="btn btn-primary" disabled={!valid || sending}>
      <Mail size={16} /> {sending ? "Opening…" : "Open in email app"}
    </button>
    <button type="button" class="btn btn-soft" onclick={copy}>
      {#if copied}<Check size={16} /> Copied{:else}<Copy size={16} /> Copy full text{/if}
    </button>
  </div>
</form>
