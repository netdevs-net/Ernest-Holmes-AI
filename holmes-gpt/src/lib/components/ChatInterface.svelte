<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import MessageBubble from './MessageBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	import type { ChatMessage } from '$lib/types/chat';

	export let messages: ChatMessage[] = [];
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let onTreatmentClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';

	const dispatch = createEventDispatcher();
	let messagesContainer: HTMLElement;
	let shouldAutoScroll = true;
	let lastMessageCount = messages.length;

	function handleSendMessage(content: string) {
		dispatch('sendMessage', content);
	}

	function isNearBottom() {
		if (!messagesContainer) return true;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		const threshold = 100;
		return scrollHeight - scrollTop - clientHeight < threshold;
	}

	function handleScroll() {
		if (!messagesContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
		shouldAutoScroll = isAtBottom;
	}

	function scrollToBottom() {
		if (!browser || !messagesContainer || !shouldAutoScroll) return;
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	function scheduleScroll() {
		if (!browser) return;
		requestAnimationFrame(scrollToBottom);
	}

	$: if (browser && messages.length !== lastMessageCount) {
		if (lastMessageCount > 0 || isLoading) {
			scheduleScroll();
		}
		lastMessageCount = messages.length;
	}

	let wasLoading = isLoading;
	$: if (browser && wasLoading && !isLoading) {
		scheduleScroll();
	}
	$: wasLoading = isLoading;

	onMount(scheduleScroll);
</script>

<div class="mobile-chat-interface">
	<div
		bind:this={messagesContainer}
		on:scroll={handleScroll}
		class="mobile-scroll-container"
		aria-live="polite"
	>
		{#each messages as message (message.id)}
			<div class:animate-fade-in-up={message.id !== 'welcome'}>
				<MessageBubble {message} />
			</div>
		{/each}

		{#if isLoading}
			<div class="animate-fade-in-up">
				<TypingIndicator />
			</div>
		{/if}
	</div>

	<div class="mobile-input-container border-t border-primary/10 glass-effect backdrop-blur-glass">
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
	.mobile-chat-interface {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		max-width: 72rem;
		margin-inline: auto;
		width: 100%;
		overflow: hidden;
		contain: layout;
	}

	.mobile-input-container {
		flex: 0 0 auto;
		padding: 0.5rem;
		min-height: 7.5rem;
	}

	.mobile-scroll-container {
		flex: 1 1 auto;
		min-height: 12rem;
		overflow-y: auto;
		padding: 0.5rem 1rem;
		overscroll-behavior: contain;
		scroll-behavior: smooth;
		/* Hidden scrollbar — content still scrolls (wheel, trackpad, touch, swipe) */
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.mobile-scroll-container::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}

	@media (min-width: 768px) {
		.mobile-input-container {
			padding: 1rem 1.5rem;
		}

		.mobile-scroll-container {
			padding: 1rem 1.5rem;
		}
	}
</style>
