<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Mail, X, Check, Send } from 'lucide-svelte';
	
	export let messageContent: string = '';
	export let isVisible = false;
	
	const dispatch = createEventDispatcher();
	
	let emailAddress = '';
	let isSending = false;
	let isSent = false;
	
	function handleClose() {
		emailAddress = '';
		isSent = false;
		dispatch('close');
	}
	
	async function handleSendEmail() {
		if (!emailAddress.trim() || !emailAddress.includes('@')) {
			return;
		}
		
		isSending = true;
		
		try {
			// Store email in database first
			const response = await fetch('/api/emails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					emailAddress: emailAddress.trim(),
					messageContent: messageContent,
					messageId: crypto.randomUUID() // Generate unique message ID
				})
			});

			if (!response.ok) {
				console.error('Failed to store email in database');
			}

			// Create mailto link with formatted content
			const subject = encodeURIComponent('Holmes AI - Spiritual Guidance Response');
			const body = encodeURIComponent(`Dear Friend,

I wanted to share this spiritual guidance from Holmes AI with you:

${messageContent}

---
Shared from Holmes AI - Ernest Holmes' wisdom through AI technology
https://holmesai.com

May this bring you peace and understanding.

With love and light,
Your friend`);
			
			const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
			
			// Open default email client
			window.open(mailtoLink, '_blank');
			
			isSent = true;
			
			// Reset after a moment
			setTimeout(() => {
				handleClose();
			}, 2000);
			
		} catch (error) {
			console.error('Error sending email:', error);
		} finally {
			isSending = false;
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSendEmail();
		} else if (event.key === 'Escape') {
			handleClose();
		}
	}
	
	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

	{#if isVisible}
	<div 
		class="email-overlay" 
		on:click={handleClose}
		on:keydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="email-title"
		tabindex="-1"
	>
		<div 
			class="email-modal" 
			on:click|stopPropagation
			on:keydown={handleKeydown}
			role="document"
		>
			<div class="email-form">
				<div class="email-header">
					<h3 id="email-title" class="email-title">
						<Mail class="w-5 h-5" />
						Share This Response
					</h3>
					<button 
						class="close-button"
						on:click={handleClose}
						title="Close"
					>
						<X class="w-4 h-4" />
					</button>
				</div>
				
				{#if !isSent}
					<div class="email-content">
						<p class="email-description">
							Share this spiritual guidance with someone who might benefit from it.
						</p>
						
						<div class="email-input-group">
							<label for="email-input" class="email-label">
								Recipient's Email Address
							</label>
							<input
								id="email-input"
								type="email"
								bind:value={emailAddress}
								placeholder="friend@example.com"
								class="email-input"
								on:keydown={handleKeydown}
								disabled={isSending}
								autocomplete="email"
							/>
						</div>
						
						<div class="email-actions">
							<button 
								class="email-send-button"
								on:click={handleSendEmail}
								disabled={!emailAddress.trim() || !emailAddress.includes('@') || isSending}
							>
								{#if isSending}
									<div class="loading-spinner"></div>
									Sending...
								{:else}
									<Send class="w-4 h-4" />
									Send Email
								{/if}
							</button>
						</div>
					</div>
				{:else}
					<div class="email-success">
						<Check class="w-8 h-8 text-green-500" />
						<h3 class="success-title">Email Sent!</h3>
						<p class="success-message">
							Your email client should open with the message ready to send.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
	{/if}

<style>
	.email-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}
	
	.email-modal {
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: 1rem;
		box-shadow: 
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-width: 90vw;
		max-height: 90vh;
		overflow: hidden;
		animation: slideUp 0.3s ease-out;
	}
	

	
	.email-form {
		min-width: 400px;
	}
	
	.email-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-primary);
	}
	
	.email-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}
	
	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.close-button:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}
	
	.email-content {
		padding: 1.5rem;
	}
	
	.email-description {
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}
	
	.email-input-group {
		margin-bottom: 1.5rem;
	}
	
	.email-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}
	
	.email-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-primary);
		border-radius: 0.5rem;
		background: var(--bg-primary);
		color: var(--text-primary);
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}
	
	.email-input:focus {
		outline: none;
		border-color: var(--text-accent);
		box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
	}
	
	.email-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.email-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
	
	.email-send-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.email-send-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
	
	.email-send-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
	
	.loading-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	.email-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem;
	}
	
	.success-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 1rem 0 0.5rem 0;
	}
	
	.success-message {
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideUp {
		from { 
			opacity: 0;
			transform: translateY(20px) scale(0.95);
		}
		to { 
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.email-modal {
			margin: 1rem;
			max-width: calc(100vw - 2rem);
		}
		
		.email-form {
			min-width: auto;
		}
		
		.email-header,
		.email-content {
			padding: 1rem;
		}
		
		.email-actions {
			flex-direction: column;
		}
		
		.email-send-button {
			width: 100%;
			justify-content: center;
		}
	}
</style> 