<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { BookOpen, RotateCcw, X, Play, Pause, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-svelte';
	
	interface Quote {
		quote: string;
		source: string;
	}
	
	export let searchTerm = '';
	export let limit = 10;
	export let showRandom = true;
	export let autoRotate = true;
	export let rotationInterval = 5000; // 5 seconds
	export let onClose: () => void = () => {};
	
	let quotes: Quote[] = [];
	let currentIndex = 0;
	let loading = false;
	let error = '';
	let totalQuotes = 0;
	let rotationTimer: ReturnType<typeof setInterval>;
	let isPaused = false;
	
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
				currentIndex = 0;
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
	
	function nextQuote() {
		if (quotes.length > 1) {
			currentIndex = (currentIndex + 1) % quotes.length;
		}
	}
	
	function previousQuote() {
		if (quotes.length > 1) {
			currentIndex = currentIndex === 0 ? quotes.length - 1 : currentIndex - 1;
		}
	}
	
	function goToQuote(index: number) {
		if (index >= 0 && index < quotes.length) {
			currentIndex = index;
		}
	}
	
	function togglePause() {
		isPaused = !isPaused;
		if (isPaused) {
			clearInterval(rotationTimer);
		} else {
			startRotation();
		}
	}
	
	function startRotation() {
		if (autoRotate && quotes.length > 1) {
			rotationTimer = setInterval(nextQuote, rotationInterval);
		}
	}
	
	function stopRotation() {
		clearInterval(rotationTimer);
	}
	
	function refreshQuotes() {
		loadQuotes();
	}
	
	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowRight':
			case ' ':
				event.preventDefault();
				nextQuote();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				previousQuote();
				break;
			case 'Escape':
				event.preventDefault();
				onClose();
				break;
			case 'p':
			case 'P':
				event.preventDefault();
				togglePause();
				break;
		}
	}
	
	onMount(() => {
		loadQuotes();
		document.addEventListener('keydown', handleKeydown);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
			stopRotation();
		};
	});
	
	onDestroy(() => {
		stopRotation();
	});
	
	// Watch for prop changes
	$: if (searchTerm || limit || showRandom) {
		loadQuotes();
	}
	
	// Start rotation when quotes are loaded
	$: if (quotes.length > 1 && autoRotate && !isPaused) {
		stopRotation();
		startRotation();
	}
</script>

<div class="quotes-slideshow-container" tabindex="-1">
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
				class="control-btn pause-btn" 
				on:click={togglePause}
				title="Pause/Resume slideshow"
				aria-label="Pause slideshow"
			>
				{#if isPaused}
					<Play size={16} />
				{:else}
					<Pause size={16} />
				{/if}
			</button>
			<button 
				class="control-btn refresh-btn" 
				on:click={refreshQuotes}
				disabled={loading}
				title="Refresh quotes"
				aria-label="Refresh quotes"
			>
				<RotateCcw size={16} />
			</button>
			<button 
				class="control-btn close-btn" 
				on:click={onClose}
				title="Close slideshow"
				aria-label="Close quotes slideshow"
			>
				<X size={16} />
			</button>
		</div>
	</div>
	
	{#if loading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Loading wisdom...</p>
		</div>
	{:else if error}
		<div class="error-container">
			<AlertCircle size={24} class="error-icon" />
			<p>{error}</p>
			<button class="retry-btn" on:click={loadQuotes}>Try Again</button>
		</div>
	{:else if quotes.length === 0}
		<div class="empty-container">
			<p>No quotes found. Try adjusting your search.</p>
		</div>
	{:else}
		<div class="slideshow-content">
			<!-- Navigation Buttons -->
			<button 
				class="nav-btn prev-btn" 
				on:click={previousQuote}
				disabled={quotes.length <= 1}
				title="Previous quote"
				aria-label="Previous quote"
			>
				<ChevronLeft size={24} />
			</button>
			
			<!-- Quote Display -->
			<div class="quote-display">
				<div class="quote-content" transition:slide={{ duration: 300 }}>
					<blockquote class="quote-text">
						"{quotes[currentIndex].quote}"
					</blockquote>
					<cite class="quote-source">
						— {formatSource(quotes[currentIndex].source)}
					</cite>
				</div>
			</div>
			
			<button 
				class="nav-btn next-btn" 
				on:click={nextQuote}
				disabled={quotes.length <= 1}
				title="Next quote"
				aria-label="Next quote"
			>
				<ChevronRight size={24} />
			</button>
		</div>
		
		<!-- Progress Indicators -->
		{#if quotes.length > 1}
			<div class="progress-container">
				<div class="progress-dots">
					{#each quotes as _, index}
						<button 
							class="progress-dot" 
							class:active={index === currentIndex}
							on:click={() => goToQuote(index)}
							title="Go to quote {index + 1}"
							aria-label="Go to quote {index + 1}"
						></button>
					{/each}
				</div>
				<div class="progress-text">
					{currentIndex + 1} of {quotes.length}
				</div>
			</div>
		{/if}
		
		<!-- Controls Info -->
		<div class="controls-info">
			<p>Use arrow keys or click to navigate • Press P to pause • Press ESC to close</p>
		</div>
	{/if}
</div>

<style>
	.quotes-slideshow-container {
		background: var(--glass-bg);
		border-radius: 20px;
		padding: 2rem;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 25px 50px var(--shadow-medium);
		border: 1px solid var(--border-primary);
		backdrop-filter: blur(20px);
		position: relative;
	}

	.quotes-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-primary);
	}

	.quotes-title {
		color: var(--text-accent);
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0;
		text-shadow: 0 2px 4px var(--shadow-light);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}


	.quotes-count {
		font-size: 1rem;
		color: var(--text-secondary);
		font-weight: 400;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.control-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 8px;
		padding: 0.5rem;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1.2rem;
	}

	.control-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading-container,
	.error-container,
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		color: var(--text-primary);
		text-align: center;
		gap: 0.5rem;
	}


	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-secondary);
		border-top: 3px solid var(--text-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.retry-btn {
		background: linear-gradient(135deg, var(--text-accent) 0%, var(--text-accent-hover) 100%);
		border: none;
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		color: var(--bg-primary);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 1rem;
	}

	.retry-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--shadow-light);
	}

	.slideshow-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-height: 300px;
	}

	.nav-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		color: var(--text-primary);
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-btn:hover:not(:disabled) {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		transform: scale(1.1);
	}

	.nav-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.quote-display {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}

	.quote-content {
		text-align: center;
		max-width: 600px;
	}

	.quote-text {
		font-size: 1.4rem;
		line-height: 1.6;
		color: var(--text-primary);
		margin: 0 0 1rem 0;
		font-style: italic;
		text-shadow: 0 2px 4px var(--shadow-light);
	}

	.quote-source {
		font-size: 1rem;
		color: var(--text-accent);
		font-weight: 600;
		font-style: normal;
		display: block;
		margin-top: 1rem;
	}

	.progress-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
		gap: 1rem;
	}

	.progress-dots {
		display: flex;
		gap: 0.5rem;
	}

	.progress-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--border-secondary);
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.progress-dot.active {
		background: var(--text-accent);
		transform: scale(1.2);
	}

	.progress-dot:hover:not(.active) {
		background: var(--border-primary);
	}

	.progress-text {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.controls-info {
		text-align: center;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-primary);
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.quotes-slideshow-container {
			padding: 1rem;
			margin: 0.5rem;
		}

		.quotes-title {
			font-size: 1.4rem;
		}

		.quote-text {
			font-size: 1.2rem;
		}

		.nav-btn {
			width: 40px;
			height: 40px;
			font-size: 1.2rem;
		}

		.slideshow-content {
			gap: 0.5rem;
		}
	}
</style> 