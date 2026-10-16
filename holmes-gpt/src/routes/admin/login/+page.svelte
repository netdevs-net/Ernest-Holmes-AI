<script lang="ts">
  import { goto } from "$app/navigation";
  import Shield from "@lucide/svelte/icons/shield";

  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    error = "";
    loading = true;
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        await goto("/admin", { invalidateAll: true });
        return;
      }
      error = (await res.json().catch(() => ({}))).error ?? "Sign-in failed.";
    } catch {
      error = "Unable to reach the server.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin sign-in | Holmes AI</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="flex flex-1 items-center justify-center px-4 py-16">
  <form class="glass card rise w-full max-w-sm p-7" onsubmit={submit}>
    <div class="mb-5 flex items-center gap-3">
      <Shield size={24} />
      <h1 class="text-xl font-semibold">Admin sign-in</h1>
    </div>

    <label for="admin-password" class="mb-1.5 block text-sm font-medium">Password</label>
    <input
      id="admin-password"
      type="password"
      class="field"
      bind:value={password}
      autocomplete="current-password"
      required
    />

    {#if error}<p class="mt-3 text-sm text-danger" role="alert">{error}</p>{/if}

    <button type="submit" class="btn btn-primary mt-5 w-full" disabled={loading || !password}>
      {loading ? "Signing in…" : "Sign in"}
    </button>
  </form>
</main>
