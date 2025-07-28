<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Quote {
		quote: string;
		source: string;
	}
	
	export let searchTerm = '';
	export let limit = 5;
	export let showRandom = true;
	export let autoRefresh = true;
	
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
			📖 Wisdom from Ernest Holmes
			{#if totalQuotes > 0}
				<span class="quotes-count">({totalQuotes} quotes available)</span>
			{/if}
		</h3>
		<button 
			class="refresh-btn" 
			on:click={refreshQuotes}
			disabled={loading}
			title="Refresh quotes"
		>
			🔄
		</button>
	</div>
	
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading wisdom...</p>
		</div>
	{:else if error}
		<div class="error">
			<p>❌ {error}</p>
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
		background: rgba(255, 255, 255, 0.95);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		max-width: 100%;
	}
	
	.quotes-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #f0f0f0;
	}
	
	.quotes-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #2d3748;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.quotes-count {
		font-size: 0.875rem;
		font-weight: 400;
		color: #718096;
	}
	
	.refresh-btn {
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1rem;
	}
	
	.refresh-btn:hover:not(:disabled) {
		background: #5a67d8;
		transform: scale(1.05);
	}
	
	.refresh-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.loading, .error, .no-quotes {
		text-align: center;
		padding: 2rem;
		color: #718096;
	}
	
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.error {
		color: #e53e3e;
	}
	
	.quotes-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.quote-card {
		background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
		border-radius: 12px;
		padding: 1.5rem;
		border-left: 4px solid #667eea;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		animation: fadeInUp 0.6s ease forwards;
		opacity: 0;
		transform: translateY(20px);
	}
	
	.quote-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
		color: #2d3748;
		margin: 0 0 1rem 0;
		font-style: italic;
		font-weight: 500;
	}
	
	.quote-source {
		font-size: 0.875rem;
		color: #718096;
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