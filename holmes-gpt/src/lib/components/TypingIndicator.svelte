<script lang="ts">
	// Enhanced typing indicator for when Holmes is responding
</script>

<div class="flex justify-start">
	<div class="chat-bubble holmes-message">
		<div class="flex items-center space-x-3 mb-3">
			<div class="w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center">
				<span class="text-white text-sm font-bold">H</span>
			</div>
			<div>
				<span class="text-sm font-medium" style="color: var(--text-accent);">Ernest Holmes</span>
				<div class="text-xs" style="color: var(--text-secondary);">AI Practitioner</div>
			</div>
		</div>
		
		<div class="text-base mb-3" style="color: var(--text-primary);">Ernest Holmes is contemplating your question...</div>
		
		<div class="typing-indicator">
			<div class="typing-dot" style="animation-delay: 0ms;"></div>
			<div class="typing-dot" style="animation-delay: 150ms;"></div>
			<div class="typing-dot" style="animation-delay: 300ms;"></div>
		</div>
	</div>
</div> 