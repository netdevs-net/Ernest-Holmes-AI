<script lang="ts">
	export let message: { role: 'user' | 'assistant'; content: string; timestamp: Date };
	
	$: isUser = message.role === 'user';
	$: formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
			
			<div class="text-base leading-relaxed {isUser ? 'text-white' : 'text-gray-200'}">
				{message.content}
			</div>
			
			<div class="text-xs text-gray-500 mt-3 {isUser ? 'text-right' : 'text-left'} flex items-center space-x-2">
				<span>{formattedTime}</span>
				{#if !isUser}
					<span>•</span>
					<span class="text-amber-400">Science of Mind</span>
				{/if}
			</div>
		</div>
	</div>
</div> 