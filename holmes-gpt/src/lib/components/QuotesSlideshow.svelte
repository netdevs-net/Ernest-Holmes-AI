<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	export let isVisible = false;
	export let onClose: () => void = () => {};
	export let autoPlay = true;
	export let slideDuration = 8000; // 8 seconds per quote
	
	interface Quote {
		quote: string;
		source: string;
	}
	
	let quotes: Quote[] = [];
	let currentIndex = 0;
	let loading = true;
	let error = '';
	let interval: number;
	
	onMount(async () => {
		await loadQuotes();
		if (autoPlay && isVisible) {
			startSlideshow();
		}
	});
	
	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
	
	async function loadQuotes() {
		try {
			loading = true;
			const response = await fetch('/api/quotes?limit=50&random=true');
			if (response.ok) {
				const data = await response.json();
				quotes = data.quotes || [];
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
	
	function startSlideshow() {
		if (interval) {
			clearInterval(interval);
		}
		interval = setInterval(() => {
			nextQuote();
		}, slideDuration);
	}
	
	function stopSlideshow() {
		if (interval) {
			clearInterval(interval);
			interval = 0;
		}
	}
	
	function nextQuote() {
		if (quotes.length > 0) {
			currentIndex = (currentIndex + 1) % quotes.length;
		}
	}
	
	function previousQuote() {
		if (quotes.length > 0) {
			currentIndex = currentIndex === 0 ? quotes.length - 1 : currentIndex - 1;
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (!isVisible) return;
		
		switch (event.key) {
			case 'Escape':
				onClose();
				break;
			case 'ArrowRight':
			case ' ':
				nextQuote();
				break;
			case 'ArrowLeft':
				previousQuote();
				break;
			case 'p':
			case 'P':
				if (interval) {
					stopSlideshow();
				} else {
					startSlideshow();
				}
				break;
		}
	}
	
	function formatSource(source: string): string {
		// Convert filename to readable source
		const sourceMap: Record<string, string> = {
			'science-of-mind-1938': 'The Science of Mind',
			'creative-mind-success-1919': 'Creative Mind and Success',
			'hidden-power-bible-1929': 'The Hidden Power of the Bible',
			'this-thing-called-you-1948': 'This Thing Called You',
			'words-that-heal-today-1949': 'Words That Heal Today'
		};
		
		const cleanSource = source.replace('.txt', '').replace(/-/g, '-');
		return sourceMap[cleanSource] || source;
	}
	
	function extractYear(source: string): string {
		// Extract year from source filename
		const yearMatch = source.match(/(\d{4})/);
		return yearMatch ? yearMatch[1] : '';
	}
	
	$: if (isVisible && autoPlay && !interval) {
		startSlideshow();
	}
	
	$: if (!isVisible && interval) {
		stopSlideshow();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isVisible}
	<div class="quotes-slideshow-overlay" on:click|self={onClose}>
		<div class="slideshow-container">
			{#if loading}
				<div class="loading-screen">
					<div class="loading-spinner"></div>
					<p class="loading-text">Loading wisdom...</p>
				</div>
			{:else if error}
				<div class="error-screen">
					<p class="error-text">{error}</p>
					<button class="retry-btn" on:click={loadQuotes}>Try Again</button>
				</div>
			{:else if quotes.length === 0}
				<div class="empty-screen">
					<p class="empty-text">No quotes available</p>
				</div>
			{:else}
				<div class="quote-slide" class:fade-in={true}>
					<div class="quote-content">
						<p class="quote-text">
							{quotes[currentIndex].quote}
						</p>
					</div>
					
					<div class="quote-attribution">
						<div class="author-name">Ernest Holmes</div>
						<div class="source-info">
							{formatSource(quotes[currentIndex].source)}
							{#if extractYear(quotes[currentIndex].source)}
								<span class="year">— {extractYear(quotes[currentIndex].source)}</span>
							{/if}
						</div>
					</div>
				</div>
				
				<!-- Navigation Controls -->
				<div class="navigation-controls">
					<button class="nav-btn prev-btn" on:click={previousQuote} title="Previous Quote (←)">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
						</svg>
					</button>
					
					<div class="slide-indicator">
						{currentIndex + 1} / {quotes.length}
					</div>
					
					<button class="nav-btn next-btn" on:click={nextQuote} title="Next Quote (→)">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</button>
				</div>
				
				<!-- Play/Pause Control -->
				<button 
					class="play-pause-btn" 
					on:click={() => interval ? stopSlideshow() : startSlideshow()}
					title="Play/Pause (P)"
				>
					{#if interval}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<rect x="6" y="4" width="4" height="16"/>
							<rect x="14" y="4" width="4" height="16"/>
						</svg>
					{:else}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<polygon points="5,3 19,12 5,21"/>
						</svg>
					{/if}
				</button>
				
				<!-- Close Button -->
				<button class="close-btn" on:click={onClose} title="Close (Esc)">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
				
				<!-- Help Text -->
				<div class="help-text">
					Use arrow keys or spacebar to navigate • P to pause/play • Esc to close
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.quotes-slideshow-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #000000;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	
	.slideshow-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
	}
	
	.quote-slide {
		width: 100%;
		max-width: 1200px;
		text-align: center;
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp 1s ease-out forwards;
	}
	
	.quote-content {
		margin-bottom: 3rem;
	}
	
	.quote-text {
		font-size: 90px;
		line-height: 1.2;
		font-weight: 300;
		color: #ffffff;
		margin: 0;
		font-family: 'Georgia', serif;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}
	
	.quote-attribution {
		opacity: 0.8;
	}
	
	.author-name {
		font-size: 24px;
		color: #ffffff;
		font-weight: 600;
		margin-bottom: 0.5rem;
		letter-spacing: 1px;
	}
	
	.source-info {
		font-size: 16px;
		color: #cccccc;
		font-style: italic;
	}
	
	.year {
		color: #999999;
	}
	
	.navigation-controls {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 2rem;
		background: rgba(0, 0, 0, 0.5);
		padding: 1rem 2rem;
		border-radius: 50px;
		backdrop-filter: blur(10px);
	}
	
	.nav-btn {
		background: none;
		border: none;
		color: #ffffff;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		transition: all 0.3s ease;
		opacity: 0.7;
	}
	
	.nav-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
		transform: scale(1.1);
	}
	
	.slide-indicator {
		color: #ffffff;
		font-size: 14px;
		font-weight: 500;
		opacity: 0.8;
	}
	
	.play-pause-btn {
		position: absolute;
		top: 2rem;
		right: 2rem;
		background: none;
		border: none;
		color: #ffffff;
		cursor: pointer;
		padding: 1rem;
		border-radius: 50%;
		transition: all 0.3s ease;
		opacity: 0.7;
	}
	
	.play-pause-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
	}
	
	.close-btn {
		position: absolute;
		top: 2rem;
		left: 2rem;
		background: none;
		border: none;
		color: #ffffff;
		cursor: pointer;
		padding: 1rem;
		border-radius: 50%;
		transition: all 0.3s ease;
		opacity: 0.7;
	}
	
	.close-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.1);
	}
	
	.help-text {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: #666666;
		font-size: 12px;
		opacity: 0.6;
	}
	
	.loading-screen, .error-screen, .empty-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #ffffff;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid #ffffff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}
	
	.loading-text, .error-text, .empty-text {
		font-size: 18px;
		opacity: 0.8;
	}
	
	.retry-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: #ffffff;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
		transition: all 0.3s ease;
	}
	
	.retry-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	/* Responsive Design */
	@media (max-width: 768px) {
		.quote-text {
			font-size: 48px;
		}
		
		.author-name {
			font-size: 18px;
		}
		
		.source-info {
			font-size: 14px;
		}
		
		.navigation-controls {
			bottom: 1rem;
			padding: 0.5rem 1rem;
			gap: 1rem;
		}
		
		.play-pause-btn, .close-btn {
			top: 1rem;
			padding: 0.5rem;
		}
		
		.play-pause-btn {
			right: 1rem;
		}
		
		.close-btn {
			left: 1rem;
		}
		
		.help-text {
			display: none;
		}
	}
	
	@media (max-width: 480px) {
		.quote-text {
			font-size: 36px;
		}
		
		.slideshow-container {
			padding: 1rem;
		}
	}
</style> 