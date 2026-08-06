<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { theme, toggleTheme } from '$lib/stores/themeStore';
	import ResponseStyleToggle from './ResponseStyleToggle.svelte';
	import { page } from '$app/stores';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Menu from '@lucide/svelte/icons/menu';
	import Info from '@lucide/svelte/icons/info';
	import Heart from '@lucide/svelte/icons/heart';
	import Shield from '@lucide/svelte/icons/shield';
	import BarChart3 from '@lucide/svelte/icons/chart-column';
	import Lock from '@lucide/svelte/icons/lock';
	import X from '@lucide/svelte/icons/x';
	import HolmesLogo from './HolmesLogo.svelte';
	
	const dispatch = createEventDispatcher();
	
	let isMenuOpen = false;
	let isProfileMenuOpen = false;
	let showAdminButton = false;
	let menuDropdown: HTMLElement | undefined;
	let profileDropdown: HTMLElement | undefined;
	
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
		isProfileMenuOpen = false;
		
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
		isMenuOpen = false;
	}
	
	function closeAllMenus() {
		isMenuOpen = false;
		isProfileMenuOpen = false;
		
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}
	
	function handleClickOutside(event: MouseEvent) {
		if (menuDropdown && !menuDropdown.contains(event.target as Node) && 
			profileDropdown && !profileDropdown.contains(event.target as Node)) {
			closeAllMenus();
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeAllMenus();
		}
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			event.stopPropagation();
			showAdminButton = !showAdminButton;
		}
	}
	
	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('keydown', handleKeydown, true);
			document.addEventListener('click', handleClickOutside);
			
			return () => {
				document.removeEventListener('keydown', handleKeydown, true);
				document.removeEventListener('click', handleClickOutside);
				document.body.style.overflow = '';
			};
		}
	});
</script>

<header class="modern-header">
	<div class="header-container">
		<!-- Logo Section -->
		<a href="/" class="logo-section" aria-label="Home - HolmesAI Chat">
			<HolmesLogo priority alt="HolmesAI Logo" />
			<div class="logo-text">
				<h1 class="logo-title">HolmesAI</h1>
				<p class="logo-subtitle">Ernest Holmes AI Practitioner</p>
			</div>
		</a>
		
		<!-- Desktop Response Style Toggle -->
		<div class="desktop-toggle">
			<ResponseStyleToggle on:styleChanged={({ detail }) => dispatch('styleChanged', detail)} />
		</div>
		
		<!-- Navigation Section -->
		<nav class="nav-section">
			<!-- Admin Indicator -->
			{#if showAdminButton}
				<div class="admin-indicator" title="Admin mode active - Press CMD+K to hide">
					🔐
				</div>
			{/if}

			<!-- Theme Toggle -->
			<button 
				on:click={handleThemeToggle}
				on:keydown={handleThemeKeydown}
				class="theme-button"
				title="Toggle theme"
				aria-label="Toggle theme"
				aria-pressed={$theme === 'dark'}
			>
				{#if $theme === 'dark'}
					<Sun size={20} />
				{:else}
					<Moon size={20} />
				{/if}
			</button>

			<!-- Menu Button -->
			<div class="menu-container" bind:this={menuDropdown}>
				<button 
					on:click={toggleMenu}
					class="menu-button"
					aria-label="Navigation menu"
					aria-expanded={isMenuOpen}
				>
					{#if isMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>

				<!-- Mobile Navigation -->
				{#if isMenuOpen}
					<button
						type="button"
						class="mobile-overlay"
						on:click={closeAllMenus}
						aria-label="Close menu"
					></button>
					<div class="mobile-menu">
						<div class="mobile-menu-header">
							<div class="mobile-menu-logo">
								<HolmesLogo size="sm" alt="" />
								<span class="mobile-logo-text">HolmesAI</span>
							</div>
							<button 
								on:click={closeAllMenus}
								class="mobile-menu-close"
								aria-label="Close menu"
							>
								<X size={24} />
							</button>
						</div>
						
						<div class="mobile-menu-content">
							<!-- Mobile Response Style Toggle -->
							<div class="mobile-style-toggle">
								<span class="toggle-label">Response Style</span>
								<ResponseStyleToggle on:styleChanged={({ detail }) => dispatch('styleChanged', detail)} />
							</div>
							
							<div class="mobile-menu-divider"></div>
							
							<!-- Navigation Links -->
							<div class="mobile-nav-links">
								<a href="/about" class="mobile-nav-link" class:active={$page.url.pathname === '/about'} on:click={closeAllMenus}>
									<Info size={20} />
									<span>About</span>
								</a>
								<a href="/support" class="mobile-nav-link" class:active={$page.url.pathname === '/support'} on:click={closeAllMenus}>
									<Heart size={20} />
									<span>Support</span>
								</a>
								<a href="/privacy" class="mobile-nav-link" class:active={$page.url.pathname === '/privacy'} on:click={closeAllMenus}>
									<Shield size={20} />
									<span>Privacy</span>
								</a>
								{#if showAdminButton}
									<a href="/admin" class="mobile-nav-link" class:active={$page.url.pathname === '/admin'} on:click={closeAllMenus}>
										<BarChart3 size={20} />
										<span>Admin</span>
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</nav>
	</div>
</header>

<style>
	/* Modern Header Base Styles */
	.modern-header {
		position: sticky;
		top: 0;
		z-index: 1001;
		width: 100%;
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border-primary);
		transition: all 0.3s ease;
	}

	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	/* Logo Section */
	.logo-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 0.75rem;
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;
	}

	.logo-section:hover {
		background: rgba(255, 255, 255, 0.05);
		transform: translateY(-1px);
	}

	.logo-section :global(.logo-image) {
		transition: transform 0.3s ease;
	}

	.logo-section:hover :global(.logo-image) {
		transform: scale(1.05);
	}

	.logo-text {
		display: flex;
		flex-direction: column;
	}

	.logo-title {
		font-size: 1.5rem;
		font-weight: 600;
		font-family: serif;
		margin: 0;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo-subtitle {
		font-size: 0.75rem;
		color: var(--text-primary);
		opacity: 0.85;
		margin: 0;
	}

	/* Desktop Toggle */
	.desktop-toggle {
		display: flex;
		align-items: center;
	}

	/* Navigation Section */
	.nav-section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Admin Indicator */
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
		opacity: 0.95;
	}

	/* Theme Button */
	.theme-button {
		padding: 0.5rem;
		border-radius: 0.5rem;
		background: var(--glass-bg);
		border: 1px solid var(--border-primary);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.theme-button:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		transform: translateY(-1px);
	}

	/* Menu Container */
	.menu-container {
		position: relative;
	}

	.menu-button {
		padding: 0.5rem;
		border-radius: 0.5rem;
		background: var(--glass-bg);
		border: 1px solid var(--border-primary);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-button:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		transform: translateY(-1px);
	}

	/* Desktop Dropdown - Hidden on all screens */
	.desktop-dropdown {
		display: none !important;
	}

	/* Mobile Navigation */
	.mobile-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0;
		padding: 0;
		border: none;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 999;
		animation: fadeIn 0.3s ease-out;
		pointer-events: auto;
	}

	/* Ensure header stays above overlay */
	.modern-header {
		position: sticky;
		top: 0;
		z-index: 1001;
		width: 100%;
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border-primary);
		transition: all 0.3s ease;
	}

	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		max-width: 320px;
		height: 100vh;
		height: 100dvh;
		background: var(--bg-primary);
		backdrop-filter: blur(16px);
		border-left: 1px solid var(--border-primary);
		z-index: 1002;
		transform: translateX(100%);
		animation: slideIn 0.3s ease-out forwards;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
	}
	
	.mobile-menu-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-primary);
		background: var(--glass-bg);
	}
	
	.mobile-menu-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.mobile-menu-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.mobile-logo-image {
		width: 1.5rem;
		height: 1.5rem;
	}

	.mobile-logo-text {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.mobile-menu-close {
		padding: 0.5rem;
		border-radius: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.mobile-menu-close:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
	}
	
	.mobile-menu-content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mobile-style-toggle {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.75rem;
		background: rgba(239, 100, 72, 0.05);
		border: 1px solid rgba(239, 100, 72, 0.1);
		text-align: center;
	}

	.toggle-label {
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0;
	}

	.mobile-menu-divider {
		height: 1px;
		background: var(--border-primary);
		margin: 0.5rem 0;
		opacity: 0.3;
	}
	
	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.mobile-nav-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.75rem;
		text-decoration: none;
		color: var(--text-primary);
		font-weight: 500;
		font-size: 1rem;
		transition: all 0.2s ease;
		cursor: pointer;
	}
	
	.mobile-nav-link:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		transform: translateX(4px);
	}
	
	.mobile-nav-link.active {
		background: var(--text-accent);
		color: white;
	}
	
	@keyframes slideIn {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Modern Responsive Design */
	@media (max-width: 1024px) {
		.desktop-toggle {
			display: none;
		}
		
		.mobile-overlay {
			display: block;
		}
		
		.mobile-menu {
			display: flex;
		}
	}
	
	@media (max-width: 768px) {
		.header-container {
			padding: 0.5rem 1rem;
			gap: 0.5rem;
		}

		.logo-title {
			font-size: 1.25rem;
		}

		.logo-subtitle {
			font-size: 0.7rem;
		}

		.logo-image {
			width: 2rem;
			height: 2rem;
		}

		.mobile-menu {
			max-width: 280px;
		}

		.mobile-menu-header {
			padding: 0.75rem 1rem;
		}
		
		.mobile-menu-content {
			padding: 1rem;
		}
		
		.mobile-nav-link {
			padding: 0.75rem;
			font-size: 0.875rem;
		}
		
		.mobile-style-toggle {
			padding: 0.75rem;
			gap: 0.5rem;
		}
		
		.toggle-label {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.header-container {
			padding: 0.375rem 0.75rem;
			gap: 0.375rem;
		}

		.logo-title {
			font-size: 1.125rem;
		}
		
		.logo-subtitle {
			font-size: 0.65rem;
		}

		.logo-image {
			width: 1.75rem;
			height: 1.75rem;
		}

		.mobile-menu {
			max-width: 260px;
		}

		.mobile-menu-header {
			padding: 0.5rem 0.75rem;
		}
		
		.mobile-menu-content {
			padding: 0.75rem;
		}
		
		.mobile-nav-link {
			padding: 0.5rem 0.75rem;
			font-size: 0.8rem;
		}
		
		.mobile-style-toggle {
			padding: 0.5rem;
			gap: 0.4rem;
		}
		
		.toggle-label {
			font-size: 0.7rem;
		}
	}

	@media (max-width: 320px) {
		.header-container {
			padding: 0.25rem 0.5rem;
		}

		.logo-title {
			font-size: 1rem;
		}

		.logo-subtitle {
			font-size: 0.6rem;
		}

		.logo-image {
			width: 1.5rem;
			height: 1.5rem;
		}

		.mobile-menu {
			max-width: 240px;
		}
	}
</style> 