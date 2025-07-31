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
	<!-- 1st Row (Top): Icons + Category Selection -->
	<div class="top-row">
		<div class="icon-buttons">
			<button 
				type="button"
				class="icon-btn glass-effect" 
				on:click={onHistoryClick}
				title="View Question History ({questionCount})"
			>
				<span class="btn-icon">📚</span>
				<span class="btn-text">History</span>
			</button>
			<button 
				type="button"
				class="icon-btn glass-effect" 
				on:click={onQuotesClick}
				title="View Quotes Slideshow"
			>
				<span class="btn-icon">🎬</span>
				<span class="btn-text">Quotes</span>
			</button>
			<button 
				type="button"
				class="icon-btn glass-effect" 
				on:click={onTreatmentClick}
				title="Generate Spiritual Treatment"
			>
				<span class="btn-icon">🧘‍♀️</span>
				<span class="btn-text">Treatment</span>
			</button>
		</div>
		
		<div class="category-selection">
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
		</div>
	</div>
	
	<!-- 2nd Row (Bottom): Input Field + Send Icon -->
	<form on:submit|preventDefault={handleSubmit} class="bottom-row">
		<div class="input-container">
			<textarea
				bind:this={textarea}
				bind:value={message}
				on:keydown={handleKeydown}
				placeholder="Ask Ernest Holmes"
				class="message-textarea"
				rows="1"
				disabled={isLoading}
				aria-label="Enter your spiritual question"
			></textarea>
		</div>
		
		<button
			type="submit"
			disabled={!message.trim() || isLoading}
			class="send-icon-btn"
			title="Send message"
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
		</button>
	</form>
</div>

<style>
	.message-input-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	/* 1st Row (Top) */
	.top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}
	
	.icon-buttons {
		display: flex;
		gap: 8px;
		flex: 1;
		min-width: 0;
	}
	
	.icon-btn {
		padding: 8px 12px;
		background: var(--glass-bg);
		border: 1px solid var(--border-primary);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		gap: 6px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}
	
	.icon-btn:hover {
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border-color: var(--text-accent);
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 100, 72, 0.2);
	}
	
	.btn-icon {
		font-size: 14px;
		line-height: 1;
	}
	
	.btn-text {
		white-space: nowrap;
		font-size: 0.75rem;
	}
	
	.category-selection {
		flex-shrink: 0;
	}
	
	.category-select {
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 0.875rem;
		backdrop-filter: blur(4px);
		min-width: 100px;
		border: 1px solid var(--border-primary);
		background: var(--glass-bg);
		color: var(--text-primary);
	}
	
	.category-select:focus {
		outline: none;
		border-color: var(--text-accent);
		box-shadow: 0 0 0 2px var(--focus-ring);
	}
	
	/* 2nd Row (Bottom) */
	.bottom-row {
		display: flex;
		gap: 12px;
		align-items: flex-end;
	}
	
	.input-container {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: flex-end;
	}
	
	.message-textarea {
		width: 100%;
		padding: 12px 16px;
		border-radius: 12px;
		resize: none;
		outline: none;
		backdrop-filter: blur(4px);
		font-size: 16px; /* Prevent mobile zoom */
		line-height: 1.3;
		border: 1px solid var(--border-primary);
		background: var(--glass-bg);
		color: var(--text-primary);
		min-height: 44px;
		max-height: 120px;
		/* Prevent zoom while ensuring good UX */
		-webkit-user-select: text;
		user-select: text;
	}
	
	.send-icon-btn {
		padding: 12px;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border: none;
		border-radius: 12px;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
		flex-shrink: 0;
		min-width: 44px;
		min-height: 44px;
		height: 44px;
		align-self: flex-end;
	}
	
	.message-textarea:focus {
		outline: none;
		border-color: var(--text-accent);
		box-shadow: 0 0 0 2px var(--focus-ring);
	}
	
	.send-icon-btn {
		padding: 12px;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border: none;
		border-radius: 12px;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
		flex-shrink: 0;
		min-width: 44px;
		min-height: 44px;
	}
	
	.send-icon-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px var(--shadow-medium);
		background: linear-gradient(135deg, var(--text-accent-hover), var(--text-accent)) !important;
	}
	
	.send-icon-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
	
	/* Ensure proper text color in both themes */
	.message-textarea {
		color: var(--text-primary) !important;
	}
	
	.message-textarea::placeholder {
		color: var(--text-muted);
		opacity: 0.8;
	}
	
	/* Ensure select text is visible */
	.category-select {
		color: var(--text-primary) !important;
	}
	
	.category-select option {
		color: var(--text-primary);
		background: var(--bg-primary);
	}
	
	/* Mobile-first responsive design */
	@media (max-width: 640px) {
		.top-row {
			gap: 8px;
		}
		
		.icon-buttons {
			gap: 6px;
		}
		
		.icon-btn {
			padding: 6px 8px;
			font-size: 0.75rem;
		}
		
		.btn-icon {
			font-size: 12px;
		}
		
		.btn-text {
			display: none; /* Hide text on mobile, show only icons */
		}
		
		.category-select {
			padding: 6px 8px;
			font-size: 0.75rem;
			min-width: 80px;
		}
		
		.bottom-row {
			align-items: flex-end;
		}
		
		.message-textarea {
			padding: 14px 16px;
			font-size: 16px; /* Prevent mobile zoom */
			min-height: 48px;
			line-height: 1.2;
		}
		
		.send-icon-btn {
			padding: 12px;
			min-width: 48px;
			min-height: 48px;
			height: 48px;
			align-self: flex-end;
		}
	}
	
	@media (max-width: 480px) {
		.top-row {
			gap: 6px;
		}
		
		.icon-buttons {
			gap: 4px;
		}
		
		.icon-btn {
			padding: 4px 6px;
		}
		
		.category-select {
			padding: 4px 6px;
			font-size: 0.7rem;
			min-width: 70px;
		}
		
		.bottom-row {
			align-items: flex-end;
		}
		
		.message-textarea {
			padding: 12px 14px;
			font-size: 16px; /* Prevent mobile zoom */
			min-height: 44px;
			line-height: 1.2;
		}
		
		.send-icon-btn {
			padding: 10px;
			min-width: 44px;
			min-height: 44px;
			height: 44px;
			align-self: flex-end;
		}
	}
	
	@media (max-width: 360px) {
		.top-row {
			flex-direction: column;
			align-items: stretch;
			gap: 6px;
		}
		
		.icon-buttons {
			justify-content: space-between;
		}
		
		.category-selection {
			align-self: flex-end;
		}
		
		.bottom-row {
			align-items: flex-end;
		}
		
		.message-textarea {
			min-height: 44px;
			line-height: 1.2;
		}
		
		.send-icon-btn {
			align-self: flex-end;
			min-height: 44px;
			height: 44px;
		}
	}
</style> 