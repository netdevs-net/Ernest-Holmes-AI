<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import ResponseStyleToggle from './ResponseStyleToggle.svelte';
	
	const dispatch = createEventDispatcher();
	
	function handleThemeToggle() {
		toggleTheme();
		dispatch('themeToggle');
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleThemeToggle();
		}
	}
</script>

<header class="glass-effect sticky top-0 z-50" role="banner" style="border-bottom: 1px solid var(--border-primary);">
	<div class="container mx-auto px-6 py-4 flex items-center justify-between">
		<!-- Left side - Logo -->
		<div class="flex items-center space-x-4">
			<div class="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg" role="img" aria-label="HolmesGPT Logo">
				<span class="text-white font-bold text-xl">H</span>
			</div>
			<div>
				<h1 class="text-2xl font-serif font-semibold gradient-text">HolmesGPT</h1>
				<p class="text-sm" style="color: var(--text-secondary);">Ernest Holmes AI</p>
			</div>
		</div>
		
		<!-- Center - Response Style Toggle -->
		<div class="flex-1 flex justify-center">
			<ResponseStyleToggle />
		</div>
		
		<!-- Right side - Navigation -->
		<nav class="flex items-center space-x-4" role="navigation" aria-label="Main navigation">
			<a 
				href="/admin"
				class="p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
				title="Admin Dashboard"
				aria-label="Admin Dashboard - Manage questions and view statistics"
			>
				<svg class="w-5 h-5 transition-colors" style="color: var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
			</a>
			<button 
				on:click={handleThemeToggle}
				on:keydown={handleKeydown}
				class="p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
				title="Toggle theme between dark and light mode"
				aria-label="Toggle theme - Switch between dark and light mode"
				aria-pressed={$theme === 'dark'}
			>
				{#if $theme === 'dark'}
					<!-- Sun icon for dark theme -->
					<svg class="w-5 h-5 transition-colors" style="color: var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					</svg>
				{:else}
					<!-- Moon icon for light theme -->
					<svg class="w-5 h-5 transition-colors" style="color: var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
					</svg>
				{/if}
			</button>
		</nav>
	</div>
</header>

<style>
	/* Responsive adjustments for the header layout */
	@media (max-width: 1024px) {
		.container {
			flex-direction: column;
			gap: 1rem;
		}
		
		.container > div {
			width: 100%;
		}
		
		.container > div:nth-child(2) {
			order: -1;
		}
	}
	
	@media (max-width: 768px) {
		.container {
			padding: 0.75rem;
		}
		
		h1 {
			font-size: 1.5rem;
		}
	}
</style> 