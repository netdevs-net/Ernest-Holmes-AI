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
	import { theme, initializeAutoTheme } from '$lib/stores/themeStore';
	import { responseStyle } from '$lib/stores/responseStyleStore';
	import { createChatMessage, type ChatMessage } from '$lib/types/chat';

	const WELCOME_MESSAGE =
		'Welcome, dear friend. I am Ernest Holmes, and I am here to share with you the wisdom of the Science of Mind. What spiritual question stirs in your heart today?';

	let messages: ChatMessage[] = [
		{
			id: 'welcome',
			role: 'assistant',
			content: WELCOME_MESSAGE,
			timestamp: new Date(0),
		},
	];
	let isLoading = false;
	let showHistory = false;
	let showQuotes = false;
	let showTreatment = false;
	let selectedCategory: 'spiritual' | 'practical' | 'metaphysical' | 'personal' | 'general' = 'general';
	let lastUserMessage = '';
	

	
	onMount(() => {
		initializeAutoTheme();

		const runWhenIdle = (fn: () => void) => {
			if (typeof requestIdleCallback !== 'undefined') {
				requestIdleCallback(fn, { timeout: 2000 });
			} else {
				setTimeout(fn, 1);
			}
		};
		runWhenIdle(() => storeDeviceInfo());
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
	
	async function handleSendMessage(content: string) {
		if (!content.trim()) return;

		lastUserMessage = content;

		// Show user message immediately (do not wait on history API)
		messages = [...messages, createChatMessage('user', content)];
		isLoading = true;

		// Persist question in background
		void saveQuestion({
			question: content,
			category: selectedCategory,
			isBookmarked: false,
			tags: extractTags(content),
			userIp: '',
			userMac: getDeviceFingerprint(),
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
			sessionId: getSessionId(),
		});

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: content,
					userMac: getDeviceFingerprint(),
					userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
					sessionId: getSessionId(),
					responseStyle: $responseStyle,
				}),
			});

			let data: {
				error?: string;
				fallbackResponse?: string;
				response?: string;
				source?: string;
			} = {};

			try {
				data = await response.json();
			} catch {
				data = {
					error: `Server returned an invalid response (${response.status}).`,
				};
			}

			if (!response.ok && !data.error) {
				data.error = `Request failed (${response.status}). Check API key and server logs.`;
			}

			if (data.error) {
				messages = [
					...messages,
					createChatMessage('assistant', data.fallbackResponse || data.error, {
						source: data.source || 'fallback',
						error: true,
					}),
				];
			} else if (data.response) {
				const lastQuestion = $questions[0];
				if (lastQuestion && lastQuestion.question === content) {
					void updateQuestionSource(lastQuestion.id, {
						responsePreview: data.response.substring(0, 100) + '...',
						source: data.source || 'claude-haiku-4-5',
					});
				}

				messages = [
					...messages,
					createChatMessage('assistant', data.response, {
						source: data.source || 'claude-haiku-4-5',
					}),
				];
			} else {
				messages = [
					...messages,
					createChatMessage(
						'assistant',
						'I apologize, but I received an empty response. Please try again.',
						{ error: true },
					),
				];
			}
		} catch (error) {
			console.error('Chat request failed:', error);
			messages = [
				...messages,
				createChatMessage(
					'assistant',
					'I apologize, but I seem to be experiencing a moment of silence. Please try again, and let us continue our spiritual exploration together.',
					{ error: true },
				),
			];
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
	<link rel="preload" href="/images/Holmes-AI-logo-96.png" as="image" type="image/png" />
</svelte:head>

<main class="mobile-main-layout">
	<div class="floating-particles" aria-hidden="true">
		<span class="particle particle-a"></span>
		<span class="particle particle-b"></span>
		<span class="particle particle-c"></span>
	</div>
	
	<!-- Main content -->
	<div class="mobile-content-wrapper">
		<Header on:styleChanged={handleStyleChange} />
		
		<div class="mobile-chat-container">
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
	/* Modern mobile-first layout structure */
	.mobile-main-layout {
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		z-index: 1;
	}

	.mobile-content-wrapper {
		flex: 1;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		position: relative;
		min-height: 0;
		overflow: hidden;
		z-index: 1;
	}

	.mobile-chat-container {
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: 0.5rem;
		position: relative;
		z-index: 1;
	}

	.mobile-chat-container .chat-container {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

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
	
	/* Mobile optimizations */
	@media (max-width: 768px) {
		.mobile-main-layout {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			-webkit-overflow-scrolling: touch;
		}

		.mobile-chat-container {
			padding: 0.25rem;
		}
		
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
		.mobile-chat-container {
			padding: 0.125rem;
		}
		
		.history-overlay,
		.quotes-overlay {
			padding: 1.5rem 0.5rem;
		}
	}
</style> 