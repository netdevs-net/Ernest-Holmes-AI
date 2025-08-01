<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { BookOpen, Film, UserCheck, Send, Loader2 } from 'lucide-svelte';
	
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
				<BookOpen size={16} class="btn-icon" />
				<span class="btn-text">History</span>
			</button>
			<button 
				type="button"
				class="icon-btn glass-effect" 
				on:click={onQuotesClick}
				title="View Quotes Slideshow"
			>
				<Film size={16} class="btn-icon" />
				<span class="btn-text">Quotes</span>
			</button>
			<button 
				type="button"
				class="icon-btn glass-effect" 
				on:click={onTreatmentClick}
				title="Generate Spiritual Treatment"
			>
				<UserCheck size={16} class="btn-icon" />
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
				<Loader2 size={20} class="animate-spin" />
			{:else}
				<Send size={20} />
			{/if}
		</button>
	</form>
</div>

<style>
	.message-input-container {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	
	/* 1st Row (Top) */
	.top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		flex-wrap: wrap;
	}
	
	.icon-buttons {
		display: flex;
		gap: 4px;
		flex: 1;
		min-width: 0;
	}
	
	.icon-btn {
		padding: 8px 12px;
		background: var(--glass-bg);
		border: 0.5px solid var(--border-primary);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		gap: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}
	
	.icon-btn:hover {
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border-color: var(--text-accent);
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 100, 72, 0.2);
	}
	
	
	.btn-text {
		white-space: nowrap;
		font-size: 0.65rem;
	}
	
	.category-selection {
		flex-shrink: 0;
	}
	
	.category-select {
		padding: 4px 6px;
		border-radius: 4px;
		font-size: 0.7rem;
		backdrop-filter: blur(4px);
		min-width: 70px;
		border: 0.5px solid var(--border-primary);
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
		gap: 6px;
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
		padding: 8px 10px;
		border-radius: 8px;
		resize: none;
		outline: none;
		backdrop-filter: blur(4px);
		font-size: 16px; /* Prevent mobile zoom */
		line-height: 1.3;
		border: 0.5px solid var(--border-primary);
		background: var(--glass-bg);
		color: var(--text-primary);
		min-height: 44px;
		max-height: 120px;
		/* Prevent zoom while ensuring good UX */
		-webkit-user-select: text;
		user-select: text;
	}
	
	.send-icon-btn {
		padding: 8px;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border: none;
		border-radius: 8px;
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
		.message-input-container {
			gap: 4px;
		}
		
		.top-row {
			gap: 4px;
		}
		
		.icon-buttons {
			gap: 3px;
		}
		
		.icon-btn {
			padding: 6px 8px;
			font-size: 0.75rem;
			border-radius: 6px;
		}
		
		
		.btn-text {
			display: none; /* Hide text on mobile, show only icons */
		}
		
		.category-select {
			padding: 4px 6px;
			font-size: 0.7rem;
			min-width: 70px;
			border-radius: 4px;
		}
		
		.bottom-row {
			align-items: flex-end;
			gap: 4px;
		}
		
		.message-textarea {
			padding: 10px 12px;
			font-size: 16px; /* Prevent mobile zoom */
			min-height: 48px;
			line-height: 1.2;
			border-radius: 6px;
		}
		
		.send-icon-btn {
			padding: 12px;
			min-width: 48px;
			min-height: 48px;
			height: 48px;
			align-self: flex-end;
			border-radius: 6px;
		}
	}
	
	@media (max-width: 480px) {
		.message-input-container {
			gap: 3px;
		}
		
		.top-row {
			gap: 3px;
		}
		
		.icon-buttons {
			gap: 2px;
		}
		
		.icon-btn {
			padding: 5px 6px;
			border-radius: 5px;
		}
		
		
		.category-select {
			padding: 3px 4px;
			font-size: 0.65rem;
			min-width: 60px;
			border-radius: 3px;
		}
		
		.bottom-row {
			align-items: flex-end;
			gap: 3px;
		}
		
		.message-textarea {
			padding: 8px 10px;
			font-size: 16px; /* Prevent mobile zoom */
			min-height: 44px;
			line-height: 1.2;
			border-radius: 4px;
		}
		
		.send-icon-btn {
			padding: 8px;
			min-width: 44px;
			min-height: 44px;
			height: 44px;
			align-self: flex-end;
			border-radius: 4px;
		}
	}
	
	@media (max-width: 360px) {
		.top-row {
			flex-direction: column;
			align-items: stretch;
			gap: 3px;
		}
		
		.icon-buttons {
			justify-content: space-between;
		}
		
		.icon-btn {
			padding: 4px 5px;
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

	/* Mobile-specific input optimizations */
	@media (max-width: 768px) {
		.message-input-container {
			/* Ensure proper mobile layout */
			position: relative;
			/* Prevent mobile keyboard interference */
			bottom: 0;
			/* Mobile touch optimizations */
			-webkit-tap-highlight-color: transparent;
		}
		
		.message-textarea {
			/* Prevent mobile zoom on focus */
			font-size: 16px;
			/* Ensure proper mobile input handling */
			-webkit-appearance: none;
			border-radius: 8px;
			/* Mobile touch feedback */
			-webkit-tap-highlight-color: transparent;
		}
	}

	@media (max-width: 480px) {
		.message-input-container {
			/* Small mobile optimizations */
			padding: 0.5rem;
			/* Ensure proper mobile positioning */
			position: relative;
			/* Prevent any overflow */
			overflow: hidden;
		}
		
		.message-textarea {
			/* Small mobile input optimization */
			font-size: 16px;
			/* Ensure proper mobile handling */
			-webkit-appearance: none;
			/* Mobile touch feedback */
			-webkit-tap-highlight-color: transparent;
		}
	}
</style> 