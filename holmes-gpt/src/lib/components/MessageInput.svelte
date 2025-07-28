<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let onTreatmentClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';
	
	const dispatch = createEventDispatcher();
	let textarea: HTMLTextAreaElement | undefined;
	let message = '';
	
	onMount(() => {
		if (textarea) {
			textarea.focus();
		}
	});
	
	function handleSubmit() {
		if (message.trim() && !isLoading) {
			dispatch('sendMessage', message.trim());
			message = '';
			if (textarea) {
				textarea.focus();
			}
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
			<button 
				type="button"
				class="treatment-btn" 
				on:click={onTreatmentClick}
				title="Generate Spiritual Treatment"
			>
				🧘‍♀️ Treatment Generator
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
				class="w-full px-6 py-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 backdrop-blur-sm text-base"
				style="border-color: var(--border-primary); background: var(--glass-bg);"
				rows="1"
				disabled={isLoading}
				aria-label="Enter your spiritual question"
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
	
	.history-btn, .quotes-btn, .treatment-btn {
		padding: 8px 16px;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 8px;
		color: #3b82f6;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(4px);
		position: relative;
		overflow: hidden;
	}
	
	.history-btn:hover, .quotes-btn:hover, .treatment-btn:hover {
		background: rgba(59, 130, 246, 0.4) !important;
		border-color: rgba(59, 130, 246, 0.7) !important;
		color: #ffffff !important;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}
	
	.input-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	
	.category-select {
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 0.9rem;
		backdrop-filter: blur(4px);
		min-width: 120px;
		border: 1px solid var(--border-primary);
		background: var(--glass-bg);
		color: var(--text-primary);
	}
	
	.category-select:focus {
		outline: none;
		border-color: var(--text-accent);
	}
	
	.send-btn {
		padding: 8px 16px;
		background: linear-gradient(135deg, var(--text-accent), #f59e0b);
		border: none;
		border-radius: 8px;
		color: white;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 8px;
		backdrop-filter: blur(4px);
	}
	
	.send-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
		background: linear-gradient(135deg, #f59e0b, #d97706) !important;
	}
	
	.send-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
	
	/* Ensure proper text color in both themes */
	textarea {
		color: #0f172a !important; /* Dark text for readability */
	}
	
	textarea::placeholder {
		color: #64748b;
		opacity: 0.8;
	}
	
	/* Ensure select text is visible */
	select {
		color: #0f172a !important; /* Dark text for readability */
	}
	
	select option {
		color: #0f172a;
		background: #ffffff;
	}
</style> 