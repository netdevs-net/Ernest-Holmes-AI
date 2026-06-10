<script lang="ts">
	import { goto } from "$app/navigation";
	import { Shield } from "@lucide/svelte";

	let password = "";
	let error = "";
	let loading = false;

	async function handleLogin(event: Event) {
		event.preventDefault();
		error = "";
		loading = true;

		try {
			const response = await fetch("/api/admin/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (response.ok) {
				await goto("/admin");
				return;
			}

			const data = await response.json().catch(() => ({}));
			error = data.error || "Login failed";
		} catch {
			error = "Unable to reach the server";
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login — Holmes AI</title>
</svelte:head>

<div class="login-page">
	<form class="login-card" on:submit={handleLogin}>
		<div class="login-header">
			<Shield size={28} />
			<h1>Admin Login</h1>
		</div>
		<p class="login-copy">Enter the admin password to access the dashboard.</p>

		<label for="admin-password">Password</label>
		<input
			id="admin-password"
			type="password"
			bind:value={password}
			autocomplete="current-password"
			required
		/>

		{#if error}
			<p class="login-error" role="alert">{error}</p>
		{/if}

		<button type="submit" disabled={loading || !password}>
			{loading ? "Signing in..." : "Sign in"}
		</button>
	</form>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: var(--bg-primary);
	}

	.login-card {
		width: 100%;
		max-width: 420px;
		background: var(--glass-bg);
		border: 1px solid var(--border-primary);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.login-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-accent);
	}

	.login-header h1 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-accent);
	}

	.login-copy {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	label {
		font-weight: 600;
		color: var(--text-primary);
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		border: 1px solid var(--border-secondary);
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	button {
		padding: 0.875rem 1rem;
		border: none;
		border-radius: 10px;
		background: var(--text-accent);
		color: var(--bg-primary);
		font-weight: 600;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.login-error {
		margin: 0;
		color: #ef4444;
		font-size: 0.9rem;
	}
</style>
