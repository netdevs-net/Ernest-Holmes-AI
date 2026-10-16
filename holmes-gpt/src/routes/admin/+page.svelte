<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import LogOut from "@lucide/svelte/icons/log-out";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import PageShell from "$lib/components/PageShell.svelte";
  import { relativeTime } from "$lib/utils/time";

  let { data } = $props();

  const categories = ["all", "spiritual", "practical", "metaphysical", "personal", "general"];
  let answers = $state<Record<string, string>>({});
  let error = $state("");

  const tiles = $derived([
    { label: "Questions", value: data.stats.total },
    { label: "Last 24 hours", value: data.stats.last24h },
    { label: "Visitor sessions", value: data.stats.sessions },
    { label: "Bookmarked", value: data.stats.bookmarked },
    { label: "Emails shared", value: data.emails.total },
    { label: "Unique recipients", value: data.emails.unique },
  ]);

  const security = $derived([
    { label: "Requests since start", value: data.metrics.totalRequests },
    { label: "Rate-limit hits", value: data.metrics.rateLimitHits },
    { label: "Bots blocked", value: data.metrics.botDetections },
    { label: "Daily limit hits", value: data.metrics.dailyUsageExceeded },
    { label: "Avg tokens / answer", value: data.metrics.averageTokensPerRequest },
    { label: "Model spend", value: `$${data.metrics.totalCost.toFixed(4)}` },
  ]);

  async function loadAnswer(id: string, open: boolean) {
    if (!open || id in answers) return;
    const res = await fetch(`/api/admin/questions/${id}`);
    answers[id] = res.ok ? (await res.json()).answer || "(no saved answer)" : "Could not load the answer.";
  }

  async function remove(id: string) {
    if (!confirm("Delete this question and its answer permanently?")) return;
    error = "";
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      error = "Could not delete that question.";
      return;
    }
    await invalidateAll();
  }

  async function signOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    await goto("/admin/login");
  }
</script>

<svelte:head>
  <title>Admin | HolmesAI</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<PageShell eyebrow="Admin" title="Dashboard" width="wide">
  <div class="-mt-6 flex justify-end">
    <button type="button" class="btn btn-soft btn-sm" onclick={signOut}>
      <LogOut size={15} /> Sign out
    </button>
  </div>

  <section aria-labelledby="usage-h">
    <h2 id="usage-h" class="eyebrow mb-3">Usage</h2>
    <dl class="grid grid-cols-2 gap-3 md:grid-cols-3">
      {#each tiles as tile (tile.label)}
        <div class="glass card">
          <dt class="text-sm text-ink-3">{tile.label}</dt>
          <dd class="mt-1 text-3xl font-medium tabular-nums">{tile.value}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section aria-labelledby="sec-h">
    <h2 id="sec-h" class="eyebrow mb-3">Safeguards (since last restart)</h2>
    <dl class="grid grid-cols-2 gap-3 md:grid-cols-3">
      {#each security as tile (tile.label)}
        <div class="glass card">
          <dt class="text-sm text-ink-3">{tile.label}</dt>
          <dd class="mt-1 text-2xl font-medium tabular-nums">{tile.value}</dd>
        </div>
      {/each}
    </dl>
    <p class="mt-3 text-sm text-ink-3">
      Limits per visitor: {data.limits.requestsPer15Min} questions / 15 min, {data.limits.requestsPerDay}
      per day, {data.limits.tokensPerDay.toLocaleString()} tokens per day.
    </p>
  </section>

  <section aria-labelledby="q-h">
    <h2 id="q-h" class="eyebrow mb-3">Questions</h2>

    <form method="GET" class="mb-4 flex flex-wrap gap-2">
      <label class="sr-only" for="admin-q">Search</label>
      <input id="admin-q" name="q" type="search" class="field max-w-sm" placeholder="Search questions" value={data.search} />
      <label class="sr-only" for="admin-cat">Category</label>
      <select id="admin-cat" name="category" class="field w-auto">
        {#each categories as c (c)}
          <option value={c} selected={c === data.category}>{c === "all" ? "All categories" : c}</option>
        {/each}
      </select>
      <button type="submit" class="btn btn-primary">Filter</button>
    </form>

    {#if error}<p class="mb-3 text-danger" role="alert">{error}</p>{/if}

    {#if data.questions.length === 0}
      <p class="py-10 text-center text-ink-3">No questions match.</p>
    {:else}
      <ul class="flex flex-col gap-2">
        {#each data.questions as q (q.id)}
          <li class="glass rounded-2xl">
            <details ontoggle={(e) => loadAnswer(q.id, e.currentTarget.open)}>
              <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-4">
                <span class="min-w-0">
                  <span class="block font-medium">{q.question}</span>
                  <span class="mt-1 block text-xs text-ink-3">
                    {relativeTime(q.createdAt)} · {q.category}
                    {#if q.ip}· {q.ip}{/if}
                  </span>
                </span>
              </summary>
              <div class="border-t border-line px-4 py-4">
                <p class="whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                  {answers[q.id] ?? "Loading…"}
                </p>
                <button type="button" class="btn btn-danger btn-sm mt-4" onclick={() => remove(q.id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </details>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</PageShell>
