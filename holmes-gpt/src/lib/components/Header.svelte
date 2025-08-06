<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import ResponseStyleToggle from './ResponseStyleToggle.svelte';
	import { page } from '$app/stores';
	import { Sun, Moon, Menu, Info, Heart, Shield, BarChart3, Lock, X } from 'lucide-svelte';
	
	const dispatch = createEventDispatcher();
	
	let isMenuOpen = false;
	let isProfileMenuOpen = false;
	let showAdminButton = false; // Control admin button visibility
	let menuDropdown: HTMLElement | undefined;
	let profileDropdown: HTMLElement | undefined;
	
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
		
		// Prevent body scroll when menu is open on mobile
		if (typeof document !== 'undefined') {
			if (isMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	}
	
	function toggleProfileMenu() {
		isProfileMenuOpen = !isProfileMenuOpen;
		isMenuOpen = false; // Close main menu when opening profile menu
	}
	
	function closeAllMenus() {
		isMenuOpen = false;
		isProfileMenuOpen = false;
		
		// Restore body scroll
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
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
				// Clean up body overflow
				document.body.style.overflow = '';
				console.log('Admin keyboard shortcut listener removed');
			};
		}
	});
</script>

<header class="glass-effect sticky top-0 z-50 w-full" style="border-bottom: 1px solid var(--border-primary);">
	<div class="container mx-auto px-6 py-2 flex items-center justify-between max-h-screen">
		<!-- Left side - Logo -->
		<a href="/" class="flex items-center space-x-4 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl p-2 transition-all duration-300 hover:bg-white/5" aria-label="Home - Holmes AI Chat">
							<img src="/images/Holmes-AI-logo.png" alt="Holmes AI Logo" class="w-10 h-10 transition-transform group-hover:scale-105" />
			<div>
				<h1 class="text-2xl font-serif font-semibold gradient-text">Holmes AI</h1>
				<p class="text-xs" style="color: var(--text-secondary);">Ernest Holmes AI Practitioner</p>
			</div>
		</a>
		
		<!-- Center - Response Style Toggle (Desktop) -->
		<div class="flex-1 flex justify-center desktop-only">
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
					{#if isMenuOpen}
						<X size={20} class="menu-icon" />
					{:else}
						<Menu size={20} class="menu-icon" />
					{/if}
				</button>

				<!-- Mobile Navigation Overlay -->
				{#if isMenuOpen}
					<!-- Mobile Backdrop -->
					<div class="mobile-nav-backdrop" on:click={closeAllMenus}></div>
					
					<!-- Mobile Navigation Panel -->
					<div class="mobile-nav-panel">
						<div class="mobile-nav-header">
							<h2 class="mobile-nav-title">Explore</h2>
							<button 
								on:click={closeAllMenus}
								class="mobile-nav-close"
								aria-label="Close explore menu"
							>
								<X size={24} />
							</button>
						</div>
						
						<div class="mobile-nav-content">
							<!-- Mobile Response Style Toggle -->
							<div class="mobile-toggle-container">
								<span class="toggle-label">Response Style</span>
								<ResponseStyleToggle on:styleChanged={({ detail }) => dispatch('styleChanged', detail)} />
							</div>
							
							<div class="mobile-nav-divider"></div>
							
							<!-- Navigation Links -->
							<div class="mobile-nav-links">
								<a href="/about" class="mobile-nav-item" class:active={$page.url.pathname === '/about'} on:click={closeAllMenus}>
									<Info size={20} class="mobile-nav-icon" />
									<span>About</span>
								</a>
								<a href="/support" class="mobile-nav-item" class:active={$page.url.pathname === '/support'} on:click={closeAllMenus}>
									<Heart size={20} class="mobile-nav-icon" />
									<span>Support</span>
								</a>
								<a href="/privacy" class="mobile-nav-item" class:active={$page.url.pathname === '/privacy'} on:click={closeAllMenus}>
									<Shield size={20} class="mobile-nav-icon" />
									<span>Privacy</span>
								</a>
								{#if showAdminButton}
									<a href="/admin" class="mobile-nav-item" class:active={$page.url.pathname === '/admin'} on:click={closeAllMenus}>
										<BarChart3 size={20} class="mobile-nav-icon" />
										<span>Admin</span>
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- Desktop Navigation Dropdown -->
				{#if isMenuOpen}
					<div class="nav-dropdown desktop-only">
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
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
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
	
	/* Mobile Toggle Container */
	.mobile-toggle-container {
		display: none; /* Hidden by default (desktop) */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 12px;
		background: rgba(239, 100, 72, 0.05);
		border: 1px solid rgba(239, 100, 72, 0.1);
		margin-bottom: 0.5rem;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
	}
	


	.toggle-label {
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: center;
		margin: 0;
		width: 100%;
		line-height: 1.2;
	}

	.dropdown-divider {
		height: 1px;
		background: var(--border-primary);
		margin: 0.25rem 0;
		opacity: 0.5;
		width: 100%;
	}

	/* Desktop only class */
	.desktop-only {
		display: flex;
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
	
	/* Mobile Navigation Styles */
	.mobile-nav-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 9998;
		animation: backdropIn 0.3s ease-out;
		display: none; /* Hidden by default on desktop */
	}
	
	.mobile-nav-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 50%;
		max-width: 280px;
		height: 100vh;
		height: 100dvh;
		background: var(--bg-primary);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-left: 1px solid var(--border-primary);
		z-index: 9999;
		transform: translateX(100%);
		animation: slideIn 0.3s ease-out forwards;
		display: none; /* Hidden by default on desktop */
		flex-direction: column;
		overflow: hidden;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
	}
	
	.mobile-nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-primary);
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.mobile-nav-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}
	
	.mobile-nav-close {
		padding: 0.5rem;
		border-radius: 8px;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.mobile-nav-close:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
	}
	
	.mobile-nav-content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
	
	.mobile-nav-divider {
		height: 1px;
		background: var(--border-primary);
		margin: 1rem 0;
		opacity: 0.3;
	}
	
	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		align-items: center;
	}
	
	.mobile-nav-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 12px;
		text-decoration: none;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 1rem;
		transition: all 0.2s ease;
		border: none;
		background: transparent;
		width: 100%;
		max-width: 200px;
		text-align: center;
		cursor: pointer;
	}
	
	.mobile-nav-item:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		transform: translateX(4px);
	}
	
	.mobile-nav-item.active {
		background: var(--text-accent);
		color: white;
		box-shadow: 0 4px 12px rgba(128, 90, 213, 0.3);
	}
	
	.mobile-nav-icon {
		flex-shrink: 0;
	}
	
	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
	
	@keyframes backdropIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
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
		
		/* Hide desktop-only elements on tablet and mobile */
		.desktop-only {
			display: none !important;
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
		
		/* Show mobile navigation on smaller screens */
		.mobile-nav-backdrop {
			display: block;
		}
		
		.mobile-nav-panel {
			display: flex;
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
			font-size: 1.5rem;
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
		
		/* Mobile navigation panel adjustments */
		.mobile-nav-panel {
			width: 50%;
			max-width: 250px;
		}
		
		.mobile-nav-header {
			padding: 0.75rem 1rem;
		}
		
		.mobile-nav-content {
			padding: 1rem;
			align-items: center;
		}
		
		.mobile-nav-item {
			padding: 0.75rem;
			font-size: 0.875rem;
			max-width: 180px;
		}
		
		.mobile-toggle-container {
			padding: 0.75rem;
			gap: 0.5rem;
		}
		
		.toggle-label {
			font-size: 0.75rem;
		}
		
		/* Mobile response style toggle adjustments */
		.mobile-toggle-container :global(.response-style-toggle-container) {
			gap: 0.4rem;
		}
		
		.mobile-toggle-container :global(.label) {
			font-size: 0.65rem;
			padding: 0.15rem 0.3rem;
		}
	}

	/* Show mobile toggle container on small screens */
	@media (max-width: 1024px) {
		.mobile-toggle-container {
			display: flex;
		}
	}
	
	@media (max-width: 320px) {
		h1 {
			font-size: 1.25rem;
		}

		header {
			max-height: 25vh;
		}
		
		.mobile-nav-panel {
			width: 60%;
			max-width: 200px;
		}
	}

	/* Mobile-specific header optimizations */
	@media (max-width: 768px) {
		header {
			/* Ensure proper mobile positioning */
			position: relative;
			/* Prevent mobile browser UI interference */
			z-index: 100;
			/* Mobile touch optimizations */
			-webkit-tap-highlight-color: transparent;
		}
  
		.container {
			/* Ensure proper mobile layout */
			position: relative;
			/* Mobile touch feedback */
			-webkit-tap-highlight-color: transparent;
		}
	}

	@media (max-width: 480px) {
		header {
			/* Small mobile header optimization */
			position: relative;
			/* Prevent any overflow issues */
			overflow: hidden;
			/* Mobile touch handling */
			-webkit-tap-highlight-color: transparent;
		}
  
		.container {
			/* Small mobile layout optimization */
			position: relative;
			/* Prevent any overflow */
			overflow: hidden;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0.125rem;
			gap: 0.125rem;
		}
		
		h1 {
			font-size: 1.125rem;
		}
		
		/* Minimal height on very small screens */
		header {
			max-height: 30vh;
			overflow: visible;
		}
		
		.mobile-nav-panel {
			width: 60%;
			max-width: 200px;
		}
		
		.mobile-nav-header {
			padding: 0.5rem 0.75rem;
		}
		
		.mobile-nav-content {
			padding: 0.75rem;
			align-items: center;
		}
		
		.mobile-nav-item {
			padding: 0.5rem 0.75rem;
			font-size: 0.8rem;
			max-width: 160px;
		}
		
		.mobile-toggle-container {
			padding: 0.5rem;
			gap: 0.4rem;
		}
		
		.toggle-label {
			font-size: 0.7rem;
		}
		
		/* Small mobile response style toggle adjustments */
		.mobile-toggle-container :global(.response-style-toggle-container) {
			gap: 0.3rem;
		}
		
		.mobile-toggle-container :global(.label) {
			font-size: 0.6rem;
			padding: 0.1rem 0.25rem;
		}
	}

	/* Mobile-specific dropdown positioning */
	@media (max-width: 768px) {
		.nav-dropdown {
			/* Hide desktop dropdown on mobile */
			display: none !important;
		}
	}

	@media (max-width: 480px) {
		.nav-dropdown {
			/* Hide desktop dropdown on small mobile */
			display: none !important;
		}
	}
</style> 