<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';
	import Hand from '@lucide/svelte/icons/hand';
	import HolmesLogo from './HolmesLogo.svelte';
	import type { ChatMessage } from '$lib/types/chat';
	import { messageTimestamp } from '$lib/types/chat';

	export let message: ChatMessage;

	$: isUser = message.role === 'user';
	$: formattedTime = messageTimestamp(message).toLocaleTimeString([], {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
	$: isWelcome = message.id === 'welcome';
	
	let showEmailModal = false;
	type EmailChatComponent = typeof import('./EmailChat.svelte').default;
	let EmailChat: EmailChatComponent | null = null;
	
	async function handleEmailClick() {
		if (!EmailChat) {
			const module = await import('./EmailChat.svelte');
			EmailChat = module.default;
		}
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
					<HolmesLogo size="sm" alt="" />
					<div class="flex-1 min-w-0">
						<div class="text-xs font-medium mb-0.5" style="color: var(--text-accent);">AI Practitioner</div>
						<div class="text-sm sm:text-base leading-relaxed" style="color: var(--text-primary);" class:formatted-content={!isUser}>
							{@html formattedContent}
						</div>
					</div>
				</div>
			{/if}
			
			{#if !isUser && !isWelcome}
				<div class="message-meta">
					<div class="meta-line">
						<time class="meta-time">{formattedTime}</time>
						<span class="meta-sep" aria-hidden="true">·</span>
						<span class="meta-label">Science of Mind</span>
						{#if message.source && message.source !== 'fallback'}
							<span class="meta-sep" aria-hidden="true">·</span>
							<span class="meta-source">via {message.source}</span>
						{/if}
						{#if message.error}
							<span class="meta-sep" aria-hidden="true">·</span>
							<span class="meta-error" title="Error">⚠</span>
						{/if}
					</div>
					<div class="meta-actions">
						<button
							type="button"
							class="email-share-button"
							on:click={handleEmailClick}
							title="Share this response via email"
						>
							<Mail class="w-3 h-3" />
							<span class="email-share-text">Email</span>
						</button>
						<a href="/support" class="support-link" title="Support HolmesAI">
							<Hand class="w-3 h-3" />
							<span class="support-text">Support</span>
						</a>
					</div>
				</div>
			{:else if isUser}
				<div class="message-meta user-meta">
					<time class="meta-time">{formattedTime}</time>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if showEmailModal && EmailChat}
	<svelte:component
		this={EmailChat}
		messageContent={message.content}
		isVisible={showEmailModal}
		onclose={handleEmailClose}
		on:close={handleEmailClose}
	/>
{/if}

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

	/* Ensure proper contrast for user messages (bubble background is gold) */
	.user-message {
		color: #1a1207 !important;
	}

	.user-message :global(*) {
		color: #1a1207 !important;
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
	
	.message-meta {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.user-meta {
		align-items: flex-end;
	}

	.meta-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.125rem 0.375rem;
		row-gap: 0.25rem;
	}

	.meta-time,
	.meta-label,
	.meta-source {
		white-space: nowrap;
	}

	.meta-time {
		font-variant-numeric: tabular-nums;
	}

	.meta-label {
		color: var(--text-accent);
	}

	.meta-source {
		color: var(--text-info);
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta-sep {
		opacity: 0.6;
		user-select: none;
	}

	.meta-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
	}

	@media (min-width: 480px) {
		.message-meta:not(.user-meta) {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem;
		}

		.meta-actions {
			flex-shrink: 0;
		}
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
	
	.email-share-text,
	.support-text {
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
	
</style> 