<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';
	
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

<div class="message-input-container">
	<div class="input-header">
		<div class="header-buttons">
			<button 
				type="button"
				class="history-btn" 
				on:click={onHistoryClick}
				title="View Question History"
			>
				📚 Question History ({questionCount})
			</button>
			<button 
				type="button"
				class="quotes-btn" 
				on:click={onQuotesClick}
				title="View Quotes Slideshow"
			>
				🎬 Quotes Slideshow
			</button>
		</div>
	</div>
	
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
		
		<div class="input-actions">
			<select 
				bind:value={selectedCategory}
				class="category-select"
				disabled={isLoading}
			>
				<option value="general">General</option>
				<option value="spiritual">Spiritual</option>
				<option value="practical">Practical</option>
				<option value="metaphysical">Metaphysical</option>
				<option value="personal">Personal</option>
			</select>
			
			<button
				type="submit"
				disabled={!message.trim() || isLoading}
				class="send-btn"
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
		</div>
	</form>
</div>

<style>
	.message-input-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.input-header {
		display: flex;
		justify-content: flex-start;
	}
	
	.header-buttons {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	
	.history-btn, .quotes-btn {
		padding: 8px 16px;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 8px;
		color: #3b82f6;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		backdrop-filter: blur(4px);
	}
	
	.history-btn:hover, .quotes-btn:hover {
		background: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.5);
	}
	
	.input-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	
	.category-select {
		padding: 8px 12px;
		border: 1px solid rgba(156, 163, 175, 0.3);
		border-radius: 8px;
		background: rgba(31, 41, 55, 0.5);
		color: #f3f4f6;
		font-size: 0.9rem;
		backdrop-filter: blur(4px);
		min-width: 120px;
	}
	
	.category-select:focus {
		outline: none;
		border-color: rgba(251, 191, 36, 0.5);
	}
	
	.send-btn {
		padding: 1rem 2rem;
		background: linear-gradient(to right, #f59e0b, #ea580c);
		color: white;
		border-radius: 1rem;
		font-weight: 500;
		opacity: 1;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border: none;
	}
	
	.send-btn:hover {
		background: linear-gradient(to right, #d97706, #c2410c);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		transform: scale(1.05);
	}
	
	.send-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
</style> 