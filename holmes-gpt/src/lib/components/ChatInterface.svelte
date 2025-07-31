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
		if (messagesContainer && shouldAutoScroll) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100); // Small delay to ensure content is rendered
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
</script>

<div class="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
	<!-- Messages Container -->
	<div 
		bind:this={messagesContainer}
		on:scroll={handleScroll}
		class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
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
	<div class="border-t border-primary/10 glass-effect p-4 md:p-6 backdrop-blur-glass">
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
