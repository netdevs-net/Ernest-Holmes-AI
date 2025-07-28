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

<div class="flex {isUser ? 'justify-end' : 'justify-start'}">
	<div class="chat-bubble {isUser ? 'user-message' : 'holmes-message'}">
		<div class="prose prose-invert prose-sm max-w-none">
			{#if !isUser}
				<div class="flex items-center space-x-3 mb-3">
					<div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
						<span class="text-white text-sm font-bold">H</span>
					</div>
					<div>
						<span class="text-sm font-medium text-amber-400">Ernest Holmes</span>
						<div class="text-xs text-gray-500">Spiritual Teacher</div>
					</div>
				</div>
			{/if}
			
			<div class="text-base leading-relaxed {isUser ? 'text-white' : 'text-gray-200'}" class:formatted-content={!isUser}>
				{#if isUser}
					{message.content}
				{:else}
					{@html formattedContent}
				{/if}
			</div>
			
			<div class="text-xs text-gray-500 mt-3 {isUser ? 'text-right' : 'text-left'} flex items-center space-x-2">
				<span>{formattedTime}</span>
				{#if !isUser}
					<span>•</span>
					<span class="text-amber-400">Science of Mind</span>
					{#if message.source && message.source !== 'fallback'}
						<span>•</span>
						<span class="text-blue-400">via {message.source}</span>
					{/if}
					{#if message.error}
						<span>•</span>
						<span class="text-red-400">⚠️</span>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.formatted-content :global(strong) {
		color: #fbbf24;
		font-weight: 600;
	}
	
	.formatted-content :global(em) {
		color: #f3f4f6;
		font-style: italic;
	}
	
	.formatted-content :global(p) {
		margin-bottom: 1rem;
	}
	
	.formatted-content :global(ul) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}
	
	.formatted-content :global(li) {
		margin-bottom: 0.5rem;
		color: #e5e7eb;
	}
	
	.formatted-content :global(br) {
		margin-bottom: 0.5rem;
	}
</style> 