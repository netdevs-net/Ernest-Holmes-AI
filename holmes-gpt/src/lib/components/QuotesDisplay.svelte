<script lang="ts">
	import { onMount } from 'svelte';
	import { BookOpen, RotateCcw, X, AlertCircle } from 'lucide-svelte';
	
	interface Quote {
		quote: string;
		source: string;
	}
	
	export let searchTerm = '';
	export let limit = 5;
	export let showRandom = true;
	export let autoRefresh = true;
	export let onClose: () => void = () => {};
	
	let quotes: Quote[] = [];
	let loading = false;
	let error = '';
	let totalQuotes = 0;
	
	async function loadQuotes() {
		loading = true;
		error = '';
		
		try {
			const params = new URLSearchParams();
			if (searchTerm) params.append('search', searchTerm);
			if (limit) params.append('limit', limit.toString());
			if (showRandom) params.append('random', 'true');
			
			const response = await fetch(`/api/quotes?${params.toString()}`);
			if (response.ok) {
				const data = await response.json();
				quotes = data.quotes;
				totalQuotes = data.total;
			} else {
				error = 'Failed to load quotes';
			}
		} catch (err) {
			error = 'Error loading quotes';
			console.error('Error loading quotes:', err);
		} finally {
			loading = false;
		}
	}
	
	function formatSource(source: string): string {
		// Convert filename to readable title
		return source
			.replace('.html', '')
			.replace(/-/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	
	function refreshQuotes() {
		loadQuotes();
	}
	
	onMount(() => {
		loadQuotes();
		
		// Auto-refresh every 30 seconds if enabled
		if (autoRefresh) {
			const interval = setInterval(loadQuotes, 30000);
			return () => clearInterval(interval);
		}
	});
	
	// Watch for prop changes
	$: if (searchTerm || limit || showRandom) {
		loadQuotes();
	}
</script>

	<div class="quotes-container">
		<div class="quotes-header">
			<h3 class="quotes-title">
				<BookOpen size={20} class="book-icon" />
				Wisdom from Ernest Holmes
				{#if totalQuotes > 0}
					<span class="quotes-count">({totalQuotes} quotes available)</span>
				{/if}
			</h3>
			<div class="header-actions">
				<button 
					class="refresh-btn" 
					on:click={refreshQuotes}
					disabled={loading}
					title="Refresh quotes"
				>
					<RotateCcw size={16} />
				</button>
				<button 
					class="close-btn" 
					on:click={onClose}
					title="Close quotes"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading wisdom...</p>
		</div>
	{:else if error}
		<div class="error">
			<AlertCircle size={24} class="error-icon" />
			<p>{error}</p>
		</div>
	{:else if quotes.length === 0}
		<div class="no-quotes">
			<p>No quotes found. Try a different search term.</p>
		</div>
	{:else}
		<div class="quotes-list">
			{#each quotes as quote, index}
				<div class="quote-card" style="animation-delay: {index * 0.1}s">
					<blockquote class="quote-text">
						"{quote.quote}"
					</blockquote>
					<cite class="quote-source">
						— {formatSource(quote.source)}
					</cite>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.quotes-container {
		background: var(--glass-bg);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 8px 32px var(--shadow-medium);
		backdrop-filter: blur(10px);
		border: 1px solid var(--border-primary);
		max-width: 100%;
		width: 600px;
		max-height: 80vh;
		overflow-y: auto;
	}
	
	.quotes-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--border-primary);
	}
	
	.quotes-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-accent);
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.book-icon {
		color: var(--text-accent);
		flexShrink: 0;
	}
	
	.quotes-count {
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--text-secondary);
	}
	
	.header-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	
	.refresh-btn, .close-btn {
		background: var(--text-accent);
		color: var(--bg-primary);
		border: none;
		border-radius: 8px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1rem;
	}
	
	.refresh-btn:hover:not(:disabled), .close-btn:hover {
		background: var(--text-accent-hover);
		transform: scale(1.05);
	}
	
	.refresh-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.close-btn {
		background: var(--text-error);
	}
	
	.close-btn:hover {
		background: var(--text-error);
		opacity: 0.8;
	}
	
	.loading, .error, .no-quotes {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}
	
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--border-secondary);
		border-top: 4px solid var(--text-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.error {
		color: var(--text-error);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.error-icon {
		color: var(--text-error);
	}
	
	.quotes-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.quote-card {
		background: var(--bg-secondary);
		border-radius: 12px;
		padding: 1.5rem;
		border-left: 4px solid var(--text-accent);
		box-shadow: 0 4px 16px var(--shadow-light);
		transition: all 0.3s ease;
		animation: fadeInUp 0.6s ease forwards;
		opacity: 0;
		transform: translateY(20px);
	}
	
	.quote-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px var(--shadow-medium);
	}
	
	@keyframes fadeInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.quote-text {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-primary);
		margin: 0 0 1rem 0;
		font-style: italic;
		font-weight: 500;
	}
	
	.quote-source {
		font-size: 0.875rem;
		color: var(--text-accent);
		font-weight: 500;
		text-align: right;
		display: block;
	}
	
	/* Responsive design */
	@media (max-width: 768px) {
		.quotes-container {
			padding: 1rem;
			margin: 0.5rem;
		}
		
		.quotes-title {
			font-size: 1.1rem;
		}
		
		.quote-text {
			font-size: 1rem;
		}
		
		.quotes-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}
	}
</style> 