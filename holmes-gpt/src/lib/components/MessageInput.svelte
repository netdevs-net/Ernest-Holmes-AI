<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Film from '@lucide/svelte/icons/film';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import Send from '@lucide/svelte/icons/send';
	import Loader2 from '@lucide/svelte/icons/loader-circle';
	
	export let isLoading = false;
	export let onHistoryClick: () => void = () => {};
	export let onQuotesClick: () => void = () => {};
	export let onTreatmentClick: () => void = () => {};
	export let questionCount = 0;
	export let selectedCategory = 'general';
	
	const dispatch = createEventDispatcher();
	let textarea: HTMLTextAreaElement | undefined;
	let message = '';
	
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
			<label for="question-category" class="sr-only">Question category</label>
			<select
				id="question-category"
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
		min-height: 2.25rem;
		min-width: 2.25rem;
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
		font-size: 16px;
		line-height: 1.3;
		border: 0.5px solid var(--border-primary);
		background: var(--glass-bg);
		color: var(--text-primary);
		min-height: 44px;
		max-height: 120px;
		-webkit-user-select: text;
		user-select: text;
	}
	
	.send-icon-btn {
		padding: 8px;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		border: none;
		border-radius: 8px;
		color: #1a1207;
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
	
	/* Modern mobile-first responsive design */
	@media (max-width: 640px) {
		.message-input-container {
			gap: 4px;
			max-height: 150px;
			position: relative;
			overflow: hidden;
		}
		
		.top-row {
			gap: 4px;
			max-height: 60px;
			flex-wrap: wrap;
		}
		
		.icon-buttons {
			gap: 3px;
			flex-wrap: wrap;
		}
		
		.icon-btn {
			padding: 6px 8px;
			font-size: 0.75rem;
			border-radius: 6px;
			flex-shrink: 0;
		}
		
		.btn-text {
			display: none;
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
			max-height: 80px;
		}
		
		.message-textarea {
			padding: 10px 12px;
			font-size: 16px;
			min-height: 48px;
			max-height: 60px;
			line-height: 1.2;
			border-radius: 6px;
			resize: none;
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
			max-height: 120px;
			position: relative;
			overflow: hidden;
		}
		
		.top-row {
			gap: 3px;
			max-height: 50px;
			flex-wrap: wrap;
		}
		
		.icon-buttons {
			gap: 2px;
			flex-wrap: wrap;
		}
		
		.icon-btn {
			padding: 5px 6px;
			border-radius: 5px;
			flex-shrink: 0;
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
			max-height: 60px;
		}
		
		.message-textarea {
			padding: 8px 10px;
			font-size: 16px;
			min-height: 44px;
			max-height: 50px;
			line-height: 1.2;
			border-radius: 4px;
			resize: none;
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
		.message-input-container {
			max-height: 100px;
			gap: 2px;
		}
		
		.top-row {
			flex-direction: column;
			align-items: stretch;
			gap: 3px;
			max-height: 40px;
		}
		
		.icon-buttons {
			justify-content: space-between;
			gap: 1px;
		}
		
		.icon-btn {
			padding: 4px 5px;
			flex-shrink: 0;
		}
		
		.category-selection {
			align-self: flex-end;
		}
		
		.bottom-row {
			align-items: flex-end;
			max-height: 50px;
			gap: 2px;
		}
		
		.message-textarea {
			min-height: 44px;
			max-height: 40px;
			line-height: 1.2;
			padding: 6px 8px;
		}
		
		.send-icon-btn {
			align-self: flex-end;
			min-height: 44px;
			height: 44px;
			padding: 6px;
			min-width: 44px;
		}
	}

	/* Mobile-specific input optimizations */
	@media (max-width: 768px) {
		.message-input-container {
			position: relative;
			bottom: 0;
			-webkit-tap-highlight-color: transparent;
		}
		
		.message-textarea {
			font-size: 16px;
			-webkit-appearance: none;
			border-radius: 8px;
			-webkit-tap-highlight-color: transparent;
		}
	}
</style> 