<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInterface from '$lib/components/ChatInterface.svelte';
	import Header from '$lib/components/Header.svelte';
	import QuestionHistory from '$lib/components/QuestionHistory.svelte';
	import { questionCount, saveQuestion, updateQuestionSource, questions } from '$lib/stores/questionStore';
	import { extractTags } from '$lib/utils/questionStorage';
	import { getDeviceFingerprint, getSessionId, storeDeviceInfo } from '$lib/utils/macAddress';
	
	let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date; source?: string; error?: boolean }> = [];
	let isLoading = false;
	let showHistory = false;
	let selectedCategory: 'spiritual' | 'practical' | 'metaphysical' | 'personal' | 'general' = 'general';
	

	
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
		
		// Create floating particles
		createFloatingParticles();
	});
	
	function createFloatingParticles() {
		const container = document.body;
		for (let i = 0; i < 15; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = Math.random() * 100 + '%';
			particle.style.top = Math.random() * 100 + '%';
			particle.style.width = Math.random() * 100 + 50 + 'px';
			particle.style.height = particle.style.width;
			particle.style.animationDelay = Math.random() * 6 + 's';
			particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
			container.appendChild(particle);
		}
	}
	
	async function handleSendMessage(content: string) {
		if (!content.trim()) return;
		
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
					sessionId: getSessionId()
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
	
	function toggleHistory() {
		showHistory = !showHistory;
	}
</script>

<svelte:head>
	<title>HolmesGPT - Ernest Holmes AI</title>
	<meta name="description" content="A conversational AI inspired by Ernest Holmes, founder of Religious Science and author of The Science of Mind." />
</svelte:head>

<main class="min-h-screen relative overflow-hidden">
	<!-- Floating particles background -->
	<div class="floating-particles"></div>
	
	<!-- Main content -->
	<div class="relative z-10">
		<Header />
		
		<div class="container mx-auto px-4 py-8 max-w-5xl">
			<div class="chat-container rounded-3xl p-8 relative">
				<ChatInterface 
					{messages} 
					{isLoading} 
					on:sendMessage={({ detail }) => handleSendMessage(detail)}
					onHistoryClick={toggleHistory}
					questionCount={$questionCount}
					{selectedCategory}
				/>
				
				<!-- Question History Panel -->
				{#if showHistory}
					<div class="history-overlay">
						<QuestionHistory 
							isVisible={showHistory}
							onQuestionSelect={handleQuestionSelect}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.history-overlay {
		position: absolute;
		top: 0;
		right: 0;
		width: 400px;
		max-width: 90vw;
		z-index: 1000;
		margin: 1rem;
	}
	
	@media (max-width: 768px) {
		.history-overlay {
			width: calc(100vw - 2rem);
			right: 1rem;
			left: 1rem;
		}
	}
</style> 