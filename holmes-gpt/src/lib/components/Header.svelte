<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import ResponseStyleToggle from './ResponseStyleToggle.svelte';
	import { page } from '$app/stores';
	
	const dispatch = createEventDispatcher();
	
	let isMenuOpen = false;
	let showAdminButton = false; // Control admin button visibility
	
	// Debug: Log initial state
	console.log('Initial admin button state:', showAdminButton);
	
	function handleThemeToggle() {
		toggleTheme();
		dispatch('themeToggle');
	}
	
	function handleThemeKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleThemeToggle();
		}
	}
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	function closeMenu() {
		isMenuOpen = false;
	}
	
	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// CMD+K (or Ctrl+K on Windows/Linux) to toggle admin button
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			event.stopPropagation();
			showAdminButton = !showAdminButton;
			console.log('Admin button visibility:', showAdminButton ? 'shown' : 'hidden');
		}
	}
	
	// Add keyboard event listener
	onMount(() => {
		// Ensure we're in the browser environment
		if (typeof document !== 'undefined') {
			document.addEventListener('keydown', handleKeydown, true);
			console.log('Admin keyboard shortcut listener added');
			
			return () => {
				document.removeEventListener('keydown', handleKeydown, true);
				console.log('Admin keyboard shortcut listener removed');
			};
		}
	});
</script>

<header class="glass-effect sticky top-0 z-50 w-full" style="border-bottom: 1px solid var(--border-primary);">
	<div class="container mx-auto px-6 py-2 flex items-center justify-between max-h-screen">
		<!-- Left side - Logo -->
		<a href="/" class="flex items-center space-x-4 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl p-2 transition-all duration-300 hover:bg-white/5" aria-label="Home - Holmes AI Chat">
			<div class="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105" role="img" aria-label="HolmesGPT Logo">
				<span class="text-white font-bold text-lg">H</span>
			</div>
			<div>
				<h1 class="text-xl font-serif font-semibold gradient-text">Holmes AI</h1>
				<p class="text-xs" style="color: var(--text-secondary);">Ernest Holmes AI Practitioner</p>
			</div>
		</a>
		
		<!-- Center - Response Style Toggle -->
		<div class="flex-1 flex justify-center">
			<ResponseStyleToggle on:styleChanged={({ detail }) => dispatch('styleChanged', detail)} />
		</div>
		
		<!-- Right side - Navigation -->
		<nav class="flex items-center space-x-4" aria-label="Main navigation">
			<!-- Admin Mode Indicator -->
			{#if showAdminButton}
				<div class="admin-indicator" title="Admin mode active - Press CMD+K to hide">
					🔐
				</div>
			{/if}
			<!-- Hamburger Menu Button -->
			<button 
				on:click={toggleMenu}
				class="p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
				aria-label="Toggle navigation menu"
				aria-expanded={isMenuOpen}
			>
				<svg 
					class="w-5 h-5 transition-colors" 
					style="color: var(--text-secondary);"
					fill="none" 
					stroke="currentColor" 
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			</button>
			
			<button 
				on:click={handleThemeToggle}
				on:keydown={handleThemeKeydown}
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
	
	<!-- Navigation Menu -->
	{#if isMenuOpen}
		<nav class="mobile-nav" class:open={isMenuOpen}>
			<div class="mobile-nav-content">
				<a 
					href="/about" 
					class="mobile-nav-link" 
					class:active={$page.url.pathname === '/about'}
					on:click={closeMenu}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>About</span>
				</a>
				<a 
					href="/support" 
					class="mobile-nav-link" 
					class:active={$page.url.pathname === '/support'}
					on:click={closeMenu}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
					</svg>
					<span>Support</span>
				</a>
				<a 
					href="/privacy" 
					class="mobile-nav-link" 
					class:active={$page.url.pathname === '/privacy'}
					on:click={closeMenu}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
					</svg>
					<span>Privacy</span>
				</a>
				{#if showAdminButton}
					<a 
						href="/admin" 
						class="mobile-nav-link" 
						class:active={$page.url.pathname === '/admin'}
						on:click={closeMenu}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<span>Admin</span>
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</header>

<style>
	header {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 50;
		width: 100%;
		min-height: fit-content;
		overflow: visible;
	}
	
	.mobile-nav {
		background: var(--bg-secondary);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-top: 1px solid var(--border-primary);
		transform: translateY(-100%);
		opacity: 0;
		transition: all 0.3s ease;
	}
	
	.mobile-nav.open {
		transform: translateY(0);
		opacity: 1;
	}
	
	.mobile-nav-content {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
	}
	
	.mobile-nav-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		text-decoration: none;
		color: var(--text-primary);
		font-weight: 500;
		transition: all 0.3s ease;
	}
	
	.mobile-nav-link:hover {
		background: var(--bg-primary);
		color: var(--text-accent);
	}
	
	.mobile-nav-link.active {
		background: var(--text-accent);
		color: white;
	}
	
	.mobile-nav-link:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
	
	.admin-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
		font-size: 0.875rem;
		animation: pulse 2s infinite;
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
	
	/* Responsive adjustments for the header layout */
	@media (max-width: 1024px) {
		.container {
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.5rem;
		}
		
		.container > div {
			width: 100%;
		}
		
		.container > div:nth-child(2) {
			order: -1;
		}
		
		/* Ensure header doesn't get too tall */
		header {
			max-height: 50vh;
			overflow: visible;
		}
	}
	
	@media (max-width: 768px) {
		.container {
			padding: 0.25rem;
			gap: 0.25rem;
		}
		
		h1 {
			font-size: 1.25rem;
		}
		
		/* Further reduce height on mobile */
		header {
			max-height: 40vh;
			overflow: visible;
		}
	}
	
	@media (max-width: 480px) {
		.container {
			padding: 0.125rem;
			gap: 0.125rem;
		}
		
		h1 {
			font-size: 1rem;
		}
		
		/* Minimal height on very small screens */
		header {
			max-height: 30vh;
			overflow: visible;
		}
	}
</style> 