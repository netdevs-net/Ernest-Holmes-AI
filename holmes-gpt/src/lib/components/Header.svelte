<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	function toggleTheme() {
		dispatch('themeToggle');
	}
</script>

<header class="glass-effect sticky top-0 z-50 border-b border-white/10">
	<div class="container mx-auto px-6 py-4 flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<div class="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
				<span class="text-white font-bold text-xl">H</span>
			</div>
			<div>
				<h1 class="text-2xl font-serif font-semibold gradient-text">HolmesGPT</h1>
				<p class="text-sm text-gray-400">Ernest Holmes AI</p>
			</div>
		</div>
		
		<nav class="flex items-center space-x-4">
			<a 
				href="/admin"
				class="p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group"
				title="Admin Dashboard"
				aria-label="Admin Dashboard"
			>
				<svg class="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
			</a>
			<button 
				on:click={toggleTheme}
				class="p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group"
				title="Toggle theme"
				aria-label="Toggle theme"
			>
				<svg class="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
				</svg>
			</button>
		</nav>
	</div>
</header> 