<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import ResponseStyleToggle from './ResponseStyleToggle.svelte';
	import { page } from '$app/stores';
	import { Sun, Moon, Menu, Info, Heart, Shield, BarChart3, Lock } from 'lucide-svelte';
	
	const dispatch = createEventDispatcher();
	
	let isMenuOpen = false;
	let isProfileMenuOpen = false;
	let showAdminButton = false; // Control admin button visibility
	let menuDropdown: HTMLElement;
	let profileDropdown: HTMLElement;
	
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
		isProfileMenuOpen = false; // Close profile menu when opening main menu
	}
	
	function toggleProfileMenu() {
		isProfileMenuOpen = !isProfileMenuOpen;
		isMenuOpen = false; // Close main menu when opening profile menu
	}
	
	function closeAllMenus() {
		isMenuOpen = false;
		isProfileMenuOpen = false;
	}
	
	// Handle clicks outside of dropdowns
	function handleClickOutside(event: MouseEvent) {
		if (menuDropdown && !menuDropdown.contains(event.target as Node) && 
			profileDropdown && !profileDropdown.contains(event.target as Node)) {
			closeAllMenus();
		}
	}
	
	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Escape key to close menus
		if (event.key === 'Escape') {
			closeAllMenus();
		}
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
			document.addEventListener('click', handleClickOutside);
			console.log('Admin keyboard shortcut listener added');
			
			return () => {
				document.removeEventListener('keydown', handleKeydown, true);
				document.removeEventListener('click', handleClickOutside);
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
		<nav class="flex items-center space-x-2" aria-label="Main navigation">
			<!-- Admin Mode Indicator -->
			{#if showAdminButton}
				<div class="admin-indicator" title="Admin mode active - Press CMD+K to hide">
					🔐
				</div>
			{/if}

			<!-- Theme Toggle -->
			<button 
				on:click={handleThemeToggle}
				on:keydown={handleThemeKeydown}
				class="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
				title="Toggle theme"
				aria-label="Toggle theme"
				aria-pressed={$theme === 'dark'}
			>
				{#if $theme === 'dark'}
					<Sun size={20} class="theme-icon" />
				{:else}
					<Moon size={20} class="theme-icon" />
				{/if}
			</button>

			<!-- Navigation Menu Dropdown -->
			<div class="relative" bind:this={menuDropdown}>
				<button 
					on:click={toggleMenu}
					class="p-2 rounded-lg glass-effect hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
					aria-label="Navigation menu"
					aria-expanded={isMenuOpen}
				>
					<Menu size={20} class="menu-icon" />
				</button>

				<!-- Navigation Dropdown -->
				{#if isMenuOpen}
					<div class="nav-dropdown">
						<a href="/about" class="nav-dropdown-item" class:active={$page.url.pathname === '/about'} on:click={closeAllMenus}>
							<Info size={16} class="dropdown-icon" />
							<span>About</span>
						</a>
						<a href="/support" class="nav-dropdown-item" class:active={$page.url.pathname === '/support'} on:click={closeAllMenus}>
							<Heart size={16} class="dropdown-icon" />
							<span>Support</span>
						</a>
						<a href="/privacy" class="nav-dropdown-item" class:active={$page.url.pathname === '/privacy'} on:click={closeAllMenus}>
							<Shield size={16} class="dropdown-icon" />
							<span>Privacy</span>
						</a>
						{#if showAdminButton}
							<a href="/admin" class="nav-dropdown-item" class:active={$page.url.pathname === '/admin'} on:click={closeAllMenus}>
								<BarChart3 size={16} class="dropdown-icon" />
								<span>Admin</span>
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</nav>
	</div>
	
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
	
	/* Modern Dropdown Styles */
	.nav-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 200px;
		background: var(--glass-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--border-primary);
		border-radius: 12px;
		padding: 0.5rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		z-index: 1000;
		animation: dropdownIn 0.15s ease-out;
		transform-origin: top right;
	}

	.nav-dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 0.875rem;
		transition: all 0.15s ease;
		border: none;
		background: transparent;
		width: 100%;
		text-align: left;
		cursor: pointer;
	}

	.nav-dropdown-item:hover {
		background: var(--bg-primary);
		color: var(--text-accent);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.nav-dropdown-item.active {
		background: var(--text-accent);
		color: white;
		box-shadow: 0 2px 8px rgba(128, 90, 213, 0.3);
	}

	.nav-dropdown-item:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}


	@keyframes dropdownIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
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
			flex-direction: row;
			justify-content: space-between;
			gap: 1rem;
			padding: 0.5rem;
		}
		
		/* Hide center content on tablet and mobile */
		.container > div:nth-child(2) {
			display: none;
		}
		
		/* Logo stays on left */
		.container > a {
			flex: 0 0 auto;
		}
		
		/* Navigation stays on right */
		.container > nav {
			flex: 0 0 auto;
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
			gap: 0.5rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		
		h1 {
			font-size: 1.25rem;
		}
		
		/* Keep logo and navigation on same line */
		.container > div:nth-child(2) {
			display: none;
		}
		
		/* Further reduce height on mobile */
		header {
			max-height: 40vh;
			overflow: visible;
		}
	}
	
@media (max-width: 320px) {
  h1 {
    font-size: 1rem;
  }

  header {
    max-height: 25vh;
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