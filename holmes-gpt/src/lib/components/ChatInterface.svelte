<script lang="ts">
	import { createEventDispatcher } from 'svelte';
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
	
	function handleSendMessage(content: string) {
		dispatch('sendMessage', content);
	}
</script>

<div class="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
	<!-- Messages Container -->
	<div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
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
