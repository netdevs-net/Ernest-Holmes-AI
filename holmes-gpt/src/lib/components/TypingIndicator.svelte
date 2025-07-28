<script lang="ts">
	// Enhanced typing indicator for when Holmes is responding
</script>

<div class="flex justify-start">
	<div class="chat-bubble holmes-message">
		<div class="flex items-center space-x-3 mb-3">
			<div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
				<span class="text-white text-sm font-bold">H</span>
			</div>
			<div>
				<span class="text-sm font-medium text-amber-400">Ernest Holmes</span>
				<div class="text-xs text-gray-500">Spiritual Teacher</div>
			</div>
		</div>
		
		<div class="text-base text-gray-300 mb-3">Ernest Holmes is contemplating your question...</div>
		
		<div class="typing-indicator">
			<div class="typing-dot" style="animation-delay: 0ms;"></div>
			<div class="typing-dot" style="animation-delay: 150ms;"></div>
			<div class="typing-dot" style="animation-delay: 300ms;"></div>
		</div>
	</div>
</div> 