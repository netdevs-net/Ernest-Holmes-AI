<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import MessageBubble from './MessageBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	
	export let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean }> = [];
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let onTreatmentClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';
	
	const dispatch = createEventDispatcher();
	let messagesContainer: HTMLElement;
	let shouldAutoScroll = true;
	
	function handleSendMessage(content: string) {
		dispatch('sendMessage', content);
	}
	
	// Check if user is near the bottom of the chat
	function isNearBottom() {
		if (!messagesContainer) return true;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		const threshold = 100; // pixels from bottom
		return scrollHeight - scrollTop - clientHeight < threshold;
	}
	
	// Handle scroll events to detect user scrolling
	function handleScroll() {
		if (!messagesContainer) return;
		
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
		
		// Update auto-scroll behavior based on user position
		shouldAutoScroll = isAtBottom;
	}
	
	// Auto-scroll to bottom when messages change or loading state changes
	function scrollToBottom() {
		if (messagesContainer && shouldAutoScroll && messagesContainer.scrollHeight) {
			// Use requestAnimationFrame for smoother scrolling
			requestAnimationFrame(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			});
		}
	}
	
	// Watch for changes in messages or loading state
	$: if (messages.length > 0 || isLoading) {
		scrollToBottom();
	}
	
	// Also scroll after each update
	afterUpdate(() => {
		scrollToBottom();
	});
	
	// Ensure scrolling works on mount
	onMount(() => {
		scrollToBottom();
	});
</script>

<div class="flex flex-col h-full max-w-6xl mx-auto">
	<!-- Messages Container -->
	<div 
		bind:this={messagesContainer}
		on:scroll={handleScroll}
		class="flex-1 overflow-y-auto p-1 sm:p-2 md:p-4 lg:p-6 space-y-3 sm:space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50 min-h-0 mobile-scroll-container"
	>
		{#each messages as message (message.timestamp.getTime())}
			<div class="animate-fade-in-up">
				<MessageBubble {message} />
			</div>
		{/each}
		
		{#if isLoading}
			<div class="animate-fade-in-up">
				<TypingIndicator />
			</div>
		{/if}
	</div>
	
	<!-- Input Container -->
	<div class="border-t border-primary/10 glass-effect p-1 sm:p-2 md:p-4 lg:p-6 backdrop-blur-glass">
		<MessageInput 
			on:sendMessage={({ detail }) => handleSendMessage(detail)} 
			{isLoading}
			{onHistoryClick}
			{onQuotesClick}
			{onTreatmentClick}
			{questionCount}
			{selectedCategory}
		/>
	</div>
</div>

<style>
	/* Mobile-specific scroll optimizations */
	.mobile-scroll-container {
		/* Ensure proper height on mobile */
		height: 100%;
		max-height: 100%;
		/* Mobile touch scrolling */
		-webkit-overflow-scrolling: touch;
		scroll-behavior: smooth;
	}

	@media (max-width: 768px) {
		.mobile-scroll-container {
			/* Mobile height optimization */
			height: calc(100vh - 200px);
			max-height: calc(100vh - 200px);
			/* Ensure proper touch scrolling */
			-webkit-overflow-scrolling: touch;
			/* Prevent pull-to-refresh interference */
			overscroll-behavior: contain;
		}
	}

	@media (max-width: 480px) {
		.mobile-scroll-container {
			/* Small mobile height optimization */
			height: calc(100vh - 180px);
			max-height: calc(100vh - 180px);
			/* Enhanced touch scrolling */
			-webkit-overflow-scrolling: touch;
			/* Prevent any overflow issues */
			overflow-x: hidden;
		}
	}
</style>
