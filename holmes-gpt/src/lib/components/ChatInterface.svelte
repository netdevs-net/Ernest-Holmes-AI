<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MessageBubble from './MessageBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	
	export let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean }> = [];
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';
	
	const dispatch = createEventDispatcher();
	
	function handleSendMessage(content: string) {
		dispatch('sendMessage', content);
	}
</script>

<div class="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
	<!-- Messages Container -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each messages as message (message.timestamp.getTime())}
			<MessageBubble {message} />
		{/each}
		
		{#if isLoading}
			<TypingIndicator />
		{/if}
	</div>
	
	<!-- Input Container -->
	<div class="border-t border-holmes-gold/20 bg-white/50 backdrop-blur-sm p-4">
		<MessageInput 
			on:sendMessage={({ detail }) => handleSendMessage(detail)} 
			{isLoading}
			{onHistoryClick}
			{onQuotesClick}
			{questionCount}
			{selectedCategory}
		/>
	</div>
</div> 