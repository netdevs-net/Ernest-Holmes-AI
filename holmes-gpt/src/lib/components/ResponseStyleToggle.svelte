<script lang="ts">
	import { responseStyle, toggleResponseStyle } from '$lib/stores/responseStyleStore';
	
	function handleToggle() {
		toggleResponseStyle();
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleToggle();
		}
	}
</script>

<div class="response-style-toggle-container" role="group" aria-label="Response style selection">
	<div class="toggle-labels">
		<span class="label his-words" class:active={$responseStyle === 'his-words'}>
			In His Words
		</span>
		<span class="label modern" class:active={$responseStyle === 'modern'}>
			Modern
		</span>
	</div>
	
	<button
		class="toggle-switch"
		class:his-words={$responseStyle === 'his-words'}
		class:modern={$responseStyle === 'modern'}
		on:click={handleToggle}
		on:keydown={handleKeydown}
		aria-label="Toggle response style between Ernest Holmes style and modern style"
		aria-pressed={$responseStyle === 'his-words'}
		title="Switch between Ernest Holmes' original writing style and modern language"
	>
		<div class="toggle-slider"></div>
		<div class="toggle-track"></div>
	</button>
</div>

<style>
	.response-style-toggle-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.toggle-labels {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.label {
		color: var(--text-secondary);
		transition: color 0.3s ease;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
	}

	.label.active {
		color: var(--text-accent);
		background: rgba(251, 191, 36, 0.1);
	}

	.toggle-switch {
		position: relative;
		width: 4rem;
		height: 2rem;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: 1rem;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toggle-switch:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
	}

	.toggle-track {
		position: absolute;
		width: 100%;
		height: 100%;
		background: var(--glass-bg);
		border: 2px solid var(--glass-border);
		border-radius: 1rem;
		transition: all 0.3s ease;
	}

	.toggle-switch:hover .toggle-track {
		border-color: var(--text-accent);
		background: rgba(251, 191, 36, 0.1);
	}

	.toggle-slider {
		position: absolute;
		left: 0.125rem;
		width: 1.5rem;
		height: 1.5rem;
		background: linear-gradient(135deg, var(--text-accent), #f59e0b);
		border-radius: 50%;
		transition: transform 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	.toggle-switch.modern .toggle-slider {
		transform: translateX(2rem);
	}

	.toggle-switch.his-words .toggle-slider {
		transform: translateX(0);
	}

	/* Hover effects */
	.toggle-switch:hover .toggle-slider {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		transform: scale(1.05);
	}

	.toggle-switch.modern:hover .toggle-slider {
		transform: translateX(2rem) scale(1.05);
	}

	/* Active state */
	.toggle-switch:active .toggle-slider {
		transform: scale(0.95);
	}

	.toggle-switch.modern:active .toggle-slider {
		transform: translateX(2rem) scale(0.95);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.toggle-labels {
			font-size: 0.75rem;
			gap: 0.75rem;
		}

		.toggle-switch {
			width: 3.5rem;
			height: 1.75rem;
		}

		.toggle-slider {
			width: 1.25rem;
			height: 1.25rem;
		}

		.toggle-switch.modern .toggle-slider {
			transform: translateX(1.75rem);
		}

		.toggle-switch.modern:hover .toggle-slider {
			transform: translateX(1.75rem) scale(1.05);
		}

		.toggle-switch.modern:active .toggle-slider {
			transform: translateX(1.75rem) scale(0.95);
		}
	}
</style> 