<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInterface from '$lib/components/ChatInterface.svelte';
	import Header from '$lib/components/Header.svelte';
	// Use dynamic imports for conditionally rendered components to reduce CSS preloading
	let QuestionHistory: any;
	let QuotesSlideshow: any;
	let TreatmentGenerator: any;
	import { questionCount, saveQuestion, updateQuestionSource, questions } from '$lib/stores/questionStore';
	import { extractTags } from '$lib/utils/questionStorage';
	import { getDeviceFingerprint, getSessionId, storeDeviceInfo } from '$lib/utils/macAddress';
	import { theme } from '$lib/stores/themeStore';
	import { responseStyle } from '$lib/stores/responseStyleStore';
	
	let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean }> = [];
	let isLoading = false;
	let showHistory = false;
	let showQuotes = false;
	let showTreatment = false;
	let selectedCategory: 'spiritual' | 'practical' | 'metaphysical' | 'personal' | 'general' = 'general';
	let lastUserMessage = '';
	

	
	onMount(() => {
		// Store device information on first load
		storeDeviceInfo();
		
		// Initialize with a welcome message
		messages = [
			{
				role: 'assistant',
				content: 'Welcome, dear friend. I am Ernest Holmes, and I am here to share with you the wisdom of the Science of Mind. What spiritual question stirs in your heart today?',
				timestamp: new Date()
			}
		];
		
			// Create floating particles after DOM is ready
	setTimeout(() => {
		createFloatingParticles();
	}, 100);
	});
	
	// Handle response style changes
	async function handleStyleChange({ detail }: { detail: { previousStyle: string; newStyle: string } }) {
		console.log('Style change detected:', detail);
		console.log('Last user message:', lastUserMessage);
		console.log('Is loading:', isLoading);
		console.log('Messages length:', messages.length);
		
		// If there's a last user message and we're not currently loading, resubmit it
		if (lastUserMessage && !isLoading && messages.length > 1) {
			console.log('Auto-resubmitting with new style:', detail.newStyle);
			
			// Remove the last assistant message (if it exists)
			const lastMessage = messages[messages.length - 1];
			if (lastMessage.role === 'assistant') {
				messages = messages.slice(0, -1);
				console.log('Removed previous assistant response');
			}
			
			// Resubmit the last user message with the new style
			await handleSendMessage(lastUserMessage);
		} else {
			console.log('Auto-resubmit conditions not met');
		}
	}
	
	// Theme is automatically initialized by the theme store
	
	function createFloatingParticles() {
		const container = document.querySelector('.floating-particles');
		if (!container) return;
		
		for (let i = 0; i < 15; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = Math.random() * 100 + '%';
			particle.style.top = Math.random() * 100 + '%';
			// Reduce particle sizes to prevent overflow
			const size = Math.random() * 80 + 30; // 30-110px instead of 50-150px
			particle.style.width = size + 'px';
			particle.style.height = size + 'px';
			particle.style.animationDelay = Math.random() * 6 + 's';
			particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
			container.appendChild(particle);
		}
	}
	
	async function handleSendMessage(content: string) {
		if (!content.trim()) return;
		
		// Store the last user message for potential resubmission
		lastUserMessage = content;
		
		// Save question to history with user identification
		await saveQuestion({
			question: content,
			category: selectedCategory,
			isBookmarked: false,
			tags: extractTags(content),
			userIp: '', // Will be set by server
			userMac: getDeviceFingerprint(),
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
			sessionId: getSessionId()
		});
		
		// Add user message
		messages = [...messages, {
			role: 'user',
			content,
			timestamp: new Date()
		}];
		
		isLoading = true;
		
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					message: content,
					userMac: getDeviceFingerprint(),
					userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
					sessionId: getSessionId(),
					responseStyle: $responseStyle
				})
			});
			
			const data = await response.json();
			
			if (data.error) {
				// Handle error with fallback response
				const errorContent = data.fallbackResponse || data.error;
				messages = [...messages, {
					role: 'assistant',
					content: errorContent,
					timestamp: new Date(),
					source: data.source || 'fallback',
					error: true
				}];
			} else {
				// Update the last question with response preview and source
				const lastQuestion = $questions[0];
				if (lastQuestion && lastQuestion.question === content) {
					await updateQuestionSource(lastQuestion.id, {
						responsePreview: data.response.substring(0, 100) + '...',
						source: data.source || 'claude-3-haiku'
					});
				}
				
				messages = [...messages, {
					role: 'assistant',
					content: data.response,
					timestamp: new Date(),
					source: data.source || 'claude-3-haiku'
				}];
			}
		} catch (error) {
			console.error('Error:', error);
			messages = [...messages, {
				role: 'assistant',
				content: 'I apologize, but I seem to be experiencing a moment of silence. Please try again, and let us continue our spiritual exploration together.',
				timestamp: new Date()
			}];
		} finally {
			isLoading = false;
		}
	}
	
	function handleQuestionSelect(question: string) {
		// This will be called when user selects a question from history
		// The question will be automatically sent to the chat
		handleSendMessage(question);
		showHistory = false; // Close history panel after selection
	}
	
	async function toggleHistory() {
		if (!QuestionHistory) {
			const module = await import('$lib/components/QuestionHistory.svelte');
			QuestionHistory = module.default;
		}
		showHistory = !showHistory;
		showQuotes = false; // Close quotes when opening history
	}
	
	async function toggleQuotes() {
		if (!QuotesSlideshow) {
			const module = await import('$lib/components/QuotesSlideshow.svelte');
			QuotesSlideshow = module.default;
		}
		showQuotes = !showQuotes;
		showHistory = false; // Close history when opening quotes
	}
	
	async function toggleTreatment() {
		if (!TreatmentGenerator) {
			const module = await import('$lib/components/TreatmentGenerator.svelte');
			TreatmentGenerator = module.default;
		}
		showTreatment = !showTreatment;
		showHistory = false; // Close history when opening treatment
		showQuotes = false; // Close quotes when opening treatment
	}
	
	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (showHistory) {
				toggleHistory();
			} else if (showQuotes) {
				toggleQuotes();
			} else if (showTreatment) {
				toggleTreatment();
			}
		}
	}
	
	// Handle keyboard shortcuts
	function handleGlobalKeydown(event: KeyboardEvent) {
		// Ctrl/Cmd + H for history
		if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
			event.preventDefault();
			toggleHistory();
		}
		// Ctrl/Cmd + Q for quotes
		if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
			event.preventDefault();
			toggleQuotes();
		}
		// Ctrl/Cmd + T for treatment generator
		if ((event.ctrlKey || event.metaKey) && event.key === 't') {
			event.preventDefault();
			toggleTreatment();
		}
	}
</script>

<svelte:head>
	<title>HolmesGPT - Ernest Holmes AI</title>
	<meta name="description" content="A conversational AI inspired by Ernest Holmes, founder of Religious Science and author of The Science of Mind." />
</svelte:head>

<main class="h-screen relative">
	<!-- Floating particles background -->
	<div class="floating-particles" aria-hidden="true"></div>
	
	<!-- Main content -->
	<div class="relative z-10 flex flex-col h-full">
		<Header on:styleChanged={handleStyleChange} />
		
		<div class="container mx-auto px-1 sm:px-2 md:px-4 pt-2 pb-4 max-w-6xl flex-1 flex flex-col">
			<div class="chat-container rounded-2xl sm:rounded-3xl p-1 sm:p-2 md:p-4 relative flex-1 flex flex-col">
				<ChatInterface 
					{messages} 
					{isLoading} 
					on:sendMessage={({ detail }) => handleSendMessage(detail)}
					onHistoryClick={toggleHistory}
					onQuotesClick={toggleQuotes}
					onTreatmentClick={toggleTreatment}
					questionCount={$questionCount}
					{selectedCategory}
				/>
			</div>
		</div>
	</div>
	
	<!-- Modal Overlays (outside chat container) -->
			{#if showHistory && QuestionHistory}
		<div 
			class="history-overlay" 
			on:click|self={toggleHistory}
			on:keydown={handleOverlayKeydown}
			role="dialog"
			aria-modal="true"
			aria-label="Question History"
			aria-describedby="history-description"
			tabindex="-1"
		>
			<div id="history-description" class="sr-only">Question history panel showing your previous spiritual questions</div>
			<svelte:component this={QuestionHistory}
				isVisible={showHistory}
				onQuestionSelect={handleQuestionSelect}
				onClose={toggleHistory}
			/>
		</div>
	{/if}
	
	{#if showQuotes && QuotesSlideshow}
		<div 
			class="quotes-overlay" 
			on:click|self={toggleQuotes}
			on:keydown={handleOverlayKeydown}
			role="dialog"
			aria-modal="true"
			aria-label="Holmes Quotes"
			tabindex="-1"
		>
			<svelte:component this={QuotesSlideshow}
				onClose={toggleQuotes}
				limit={10}
				showRandom={true}
				autoRotate={true}
				rotationInterval={5000}
			/>
		</div>
	{/if}
	
	{#if TreatmentGenerator}
		<svelte:component this={TreatmentGenerator}
			isVisible={showTreatment}
			onClose={toggleTreatment}
		/>
	{/if}
</main>

<style>
	.history-overlay,
	.quotes-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		backdrop-filter: blur(8px);
		pointer-events: auto;
	}
	
	.history-overlay > :global(*),
	.quotes-overlay > :global(*) {
		max-width: 90vw;
		max-height: 70vh;
	}
	
	@media (max-width: 768px) {
		.history-overlay,
		.quotes-overlay {
			padding: 2rem 0.5rem;
		}
		
		.history-overlay > :global(*),
		.quotes-overlay > :global(*) {
			width: 95%;
			max-width: 95%;
			max-height: 70vh;
		}
	}

	@media (max-width: 480px) {
		.history-overlay,
		.quotes-overlay {
			padding: 1.5rem 0.5rem;
		}
		
		.history-overlay > :global(*),
		.quotes-overlay > :global(*) {
			width: 95%;
			max-width: 95%;
			max-height: 70vh;
		}
	}
</style> 