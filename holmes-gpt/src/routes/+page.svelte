<script lang="ts">
	import { onMount } from 'svelte';
	import ChatInterface from '$lib/components/ChatInterface.svelte';
	import Header from '$lib/components/Header.svelte';
	
	let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];
	let isLoading = false;
	
	onMount(() => {
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
				body: JSON.stringify({ message: content })
			});
			
			if (response.ok) {
				const data = await response.json();
				messages = [...messages, {
					role: 'assistant',
					content: data.response,
					timestamp: new Date()
				}];
			} else {
				throw new Error('Failed to get response');
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
			<div class="chat-container rounded-3xl p-8">
				<ChatInterface 
					{messages} 
					{isLoading} 
					on:sendMessage={({ detail }) => handleSendMessage(detail)}
				/>
			</div>
		</div>
	</div>
</main> 