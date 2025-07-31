<script lang="ts">
	export let message: { role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean };
	
	$: isUser = message.role === 'user';
	$: formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	
	// Function to parse markdown-like formatting
	function parseFormatting(text: string): string {
		return text
			// Convert **bold** to <strong>
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			// Convert *italics* to <em>
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			// Convert double line breaks to <br><br> for paragraph breaks
			.replace(/\n\n/g, '<br><br>')
			// Convert single line breaks to <br>
			.replace(/\n/g, '<br>')
			// Convert bullet points
			.replace(/^•\s*(.*)$/gm, '<li>$1</li>')
			// Wrap in paragraphs
			.replace(/^(.*)$/gm, '<p>$1</p>')
			// Clean up empty paragraphs
			.replace(/<p><\/p>/g, '')
			// Convert lists
			.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
	}
	
	$: formattedContent = isUser ? message.content : parseFormatting(message.content);
</script>

<div class="flex {isUser ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3">
	<div class="chat-bubble {isUser ? 'user-message' : 'holmes-message'} max-w-full lg:max-w-4xl xl:max-w-5xl">
		<div class="prose prose-sm max-w-none">
			{#if isUser}
				<div class="text-sm sm:text-base leading-relaxed" style="color: var(--text-primary);">
					{message.content}
				</div>
			{:else}
				<div class="flex items-start space-x-2">
					<img src="/images/logo.png" alt="Holmes AI Logo" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
					<div class="flex-1 min-w-0">
						<div class="text-xs font-medium mb-0.5" style="color: var(--text-accent);">AI Practitioner</div>
						<div class="text-sm sm:text-base leading-relaxed" style="color: var(--text-primary);" class:formatted-content={!isUser}>
							{@html formattedContent}
						</div>
					</div>
				</div>
			{/if}
			
			<div class="text-xs mt-1 {isUser ? 'text-right' : 'text-left'} flex items-center space-x-1 sm:space-x-2" style="color: var(--text-secondary);">
				<span>{formattedTime}</span>
				{#if !isUser}
					<span>•</span>
					<span style="color: var(--text-accent);">Science of Mind</span>
					{#if message.source && message.source !== 'fallback'}
						<span>•</span>
						<span style="color: var(--text-info);">via {message.source}</span>
					{/if}
					{#if message.error}
						<span>•</span>
						<span style="color: var(--text-error);">⚠️</span>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.formatted-content :global(strong) {
		color: var(--text-accent);
		font-weight: 600;
	}
	
	.formatted-content :global(em) {
		color: var(--text-secondary);
		font-style: italic;
	}
	
	.formatted-content :global(p) {
		margin-bottom: 0.75rem;
		color: var(--text-primary);
	}
	
	.formatted-content :global(ul) {
		margin: 0.75rem 0;
		padding-left: 1.25rem;
	}
	
	.formatted-content :global(li) {
		margin-bottom: 0.375rem;
		color: var(--text-primary);
	}
	
	.formatted-content :global(br) {
		margin-bottom: 0.375rem;
	}

	/* Ensure proper contrast for user messages */
	.user-message {
		color: white !important;
	}

	.user-message :global(*) {
		color: white !important;
	}

	/* Holmes message styling */
	.holmes-message {
		color: var(--text-primary);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	/* Enhanced border visibility for light mode */
	@media (prefers-color-scheme: light) {
		.holmes-message {
			border: 1px solid rgba(0, 0, 0, 0.15);
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		}
	}

	/* Focus styles for interactive elements */
	.chat-bubble:focus-within {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
		border-radius: 1rem;
	}
</style> 