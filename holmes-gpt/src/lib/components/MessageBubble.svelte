<script lang="ts">
	import EmailChat from './EmailChat.svelte';
	import { Mail, Hand } from '@lucide/svelte';
	
	export let message: { role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean };
	
	$: isUser = message.role === 'user';
	$: formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	
	let showEmailModal = false;
	
	function handleEmailClick() {
		showEmailModal = true;
	}
	
	function handleEmailClose() {
		showEmailModal = false;
	}
	
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
					<img src="/images/Holmes-AI-logo.png" alt="Holmes AI Logo" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
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
					
					<!-- Email Share Button -->
					<button 
						class="email-share-button"
						on:click={handleEmailClick}
						title="Share this response via email"
					>
						<Mail class="w-3 h-3" />
						<span class="email-share-text">Share via Email</span>
					</button>
					
					<!-- Support Holmes AI Link -->
					<a 
						href="/support" 
						class="support-link"
						title="Support Holmes AI"
					>
						<Hand class="w-3 h-3" />
						<span class="support-text">Support</span>
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Email Modal -->
<EmailChat 
	messageContent={message.content}
	isVisible={showEmailModal}
	on:close={handleEmailClose}
/>

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
	
	/* Email share button */
	.email-share-button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.2s ease;
		opacity: 0.7;
	}
	
	.email-share-button:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		opacity: 1;
		transform: scale(1.05);
	}
	
	.email-share-button:focus {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
	
	.email-share-text {
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}
	
	/* Support link */
	.support-link {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.2s ease;
		opacity: 0.7;
		text-decoration: none;
	}
	
	.support-link:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
		opacity: 1;
		transform: scale(1.05);
	}
	
	.support-link:focus {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
	
	.support-text {
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}
</style> 