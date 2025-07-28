<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	
	export let isLoading = false;
	
	const dispatch = createEventDispatcher();
	let textarea: HTMLTextAreaElement;
	let message = '';
	
	onMount(() => {
		textarea?.focus();
	});
	
	function handleSubmit() {
		if (message.trim() && !isLoading) {
			dispatch('sendMessage', message.trim());
			message = '';
			textarea?.focus();
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="flex space-x-4">
	<div class="flex-1 relative">
		<textarea
			bind:this={textarea}
			bind:value={message}
			on:keydown={handleKeydown}
			placeholder="Ask Ernest Holmes a spiritual question..."
			class="w-full px-6 py-4 border border-gray-600/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-400 text-base"
			rows="1"
			disabled={isLoading}
		></textarea>
	</div>
	
	<button
		type="submit"
		disabled={!message.trim() || isLoading}
		class="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-medium hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
	>
		{#if isLoading}
			<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{:else}
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
			</svg>
		{/if}
		<span>Send</span>
	</button>
</form> 