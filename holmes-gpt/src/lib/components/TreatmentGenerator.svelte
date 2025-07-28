<script lang="ts">
	import { onMount } from 'svelte';
	
	// Treatment categories based on Holmes' teachings
	const treatmentCategories = [
		{ id: 'general', name: 'General Treatment', description: 'Universal spiritual treatment' },
		{ id: 'healing', name: 'Healing Treatment', description: 'For physical and emotional healing' },
		{ id: 'prosperity', name: 'Prosperity Treatment', description: 'For abundance and financial well-being' },
		{ id: 'relationships', name: 'Relationship Treatment', description: 'For harmony in relationships' },
		{ id: 'purpose', name: 'Purpose Treatment', description: 'For clarity of life purpose' },
		{ id: 'peace', name: 'Peace Treatment', description: 'For inner peace and calm' },
		{ id: 'gratitude', name: 'Gratitude Treatment', description: 'For appreciation and thankfulness' },
		{ id: 'forgiveness', name: 'Forgiveness Treatment', description: 'For releasing and forgiving' },
		{ id: 'courage', name: 'Courage Treatment', description: 'For strength and bravery' },
		{ id: 'wisdom', name: 'Wisdom Treatment', description: 'For divine guidance and insight' }
	];

	// Holmes' core principles for treatments
	const corePrinciples = [
		'Infinite Intelligence',
		'Divine Mind',
		'Spiritual Law',
		'Creative Power',
		'Spiritual Substance',
		'Divine Love',
		'Perfect Life',
		'Infinite Good',
		'Divine Order',
		'Spiritual Harmony'
	];

	// Treatment templates in Holmes' style
	const treatmentTemplates = {
		general: {
			title: 'General Spiritual Treatment',
			template: `I recognize that I am one with Infinite Intelligence, that Divine Mind lives through me, and that Spiritual Law operates through my consciousness. I am a channel for the Creative Power of the universe, and all that I need is already provided. I walk in the consciousness of my oneness with the Infinite, and my life is a perfect expression of Divine Intelligence.`,
			keyElements: ['Oneness with Infinite Intelligence', 'Divine Mind expression', 'Spiritual Law operation', 'Creative Power channeling']
		},
		healing: {
			title: 'Healing Treatment',
			template: `I recognize that Divine Intelligence is my life, that Spiritual Law operates through me, and that I am one with the healing power of the universe. My body is a perfect expression of Divine Intelligence, and every cell responds to the Truth of wholeness. I am whole, perfect, and complete, for I am one with the Infinite Source of all good.`,
			keyElements: ['Divine Intelligence as life', 'Spiritual Law operation', 'Healing power connection', 'Wholeness recognition']
		},
		prosperity: {
			title: 'Prosperity Treatment',
			template: `I recognize that I am one with the Infinite Source of all abundance, that Divine Intelligence guides me to my highest good, and that Spiritual Law operates for my prosperity. The Creative Power of the universe flows through me abundantly, and all that I need is already provided. I walk in the consciousness of abundance, and my life reflects the infinite nature of Spirit.`,
			keyElements: ['Infinite Source connection', 'Divine Intelligence guidance', 'Spiritual Law for prosperity', 'Abundant flow']
		},
		relationships: {
			title: 'Relationship Treatment',
			template: `I recognize that Divine Love flows through all my relationships, that Spiritual Law brings harmony and understanding, and that I am one with the Infinite Source of all love. I see each person as a spiritual being, perfect in their essence, and I attract to myself that which I am. My relationships are mirrors of divine harmony and mutual respect.`,
			keyElements: ['Divine Love flow', 'Spiritual Law harmony', 'Perfect essence recognition', 'Divine attraction']
		},
		purpose: {
			title: 'Purpose Treatment',
			template: `I recognize that my purpose is to express the Divine Intelligence that lives within me, that Spiritual Law guides me to my highest path, and that the Creative Power of the universe flows through me for the benefit of all. I am here to demonstrate the Truth of my being and to be a channel for infinite good.`,
			keyElements: ['Divine Intelligence expression', 'Spiritual Law guidance', 'Creative Power flow', 'Truth demonstration']
		},
		peace: {
			title: 'Peace Treatment',
			template: `I recognize that I am one with the Infinite Peace that passes all understanding, that Divine Intelligence brings calm to my mind, and that Spiritual Law operates for my serenity. I rest in the consciousness of my oneness with the Infinite, and peace flows through me as naturally as breathing.`,
			keyElements: ['Infinite Peace connection', 'Divine Intelligence calm', 'Spiritual Law serenity', 'Natural peace flow']
		},
		gratitude: {
			title: 'Gratitude Treatment',
			template: `I recognize that I am surrounded by infinite good, that Divine Intelligence has provided all that I need, and that Spiritual Law operates for my highest good. I give thanks for the abundance that flows through my life, for the love that surrounds me, and for the opportunity to express the Creative Power within me.`,
			keyElements: ['Infinite good recognition', 'Divine Intelligence provision', 'Spiritual Law operation', 'Abundance gratitude']
		},
		forgiveness: {
			title: 'Forgiveness Treatment',
			template: `I recognize that Divine Love flows through me, that Spiritual Law operates for the highest good of all, and that I am one with the Infinite Source of all forgiveness. I release all that no longer serves me, I forgive myself and others, and I walk in the consciousness of divine harmony and peace.`,
			keyElements: ['Divine Love flow', 'Spiritual Law operation', 'Infinite forgiveness', 'Divine harmony']
		},
		courage: {
			title: 'Courage Treatment',
			template: `I recognize that I am one with Infinite Intelligence, which knows no fear, that Divine Mind gives me strength, and that Spiritual Law operates for my highest good. I walk in the consciousness of my divine power, knowing that the Creative Force within me is greater than any challenge I may face.`,
			keyElements: ['Infinite Intelligence fearlessness', 'Divine Mind strength', 'Spiritual Law support', 'Divine power consciousness']
		},
		wisdom: {
			title: 'Wisdom Treatment',
			template: `I recognize that Divine Intelligence guides me in all things, that Spiritual Law reveals the truth to me, and that I am one with the Infinite Source of all wisdom. I am open to divine guidance, I trust the Creative Power within me, and I walk in the consciousness of infinite understanding.`,
			keyElements: ['Divine Intelligence guidance', 'Spiritual Law truth', 'Infinite wisdom source', 'Divine understanding']
		}
	};

	// Reactive variables
	let selectedCategory = 'general';
	let customTreatment = '';
	let isVisible = false;
	let generatedTreatment = '';
	let isGenerating = false;
	let showCustomInput = false;
	let customElements: string[] = [];
	let selectedElements: string[] = [];

	// Props
	export let onClose: () => void = () => {};

	// Generate treatment based on selected category and custom elements
	async function generateTreatment() {
		isGenerating = true;
		
		try {
			// Get base template
			const template = treatmentTemplates[selectedCategory];
			let treatment = template.template;
			
			// If custom elements are selected, incorporate them
			if (selectedElements.length > 0) {
				const customStatements = selectedElements.map(element => {
					return `I recognize that ${element} flows through me, and that I am one with this divine quality.`;
				});
				
				// Insert custom statements before the final affirmation
				const parts = treatment.split('. ');
				const lastPart = parts.pop();
				treatment = [...parts, ...customStatements, lastPart].join('. ');
			}
			
			// If custom treatment is provided, use it as base
			if (showCustomInput && customTreatment.trim()) {
				treatment = customTreatment;
			}
			
			generatedTreatment = treatment;
			
			// Simulate AI enhancement (in real implementation, this would call the HolmesGPT API)
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Enhance with Holmes' characteristic language patterns
			generatedTreatment = enhanceWithHolmesStyle(treatment);
			
		} catch (error) {
			console.error('Error generating treatment:', error);
			generatedTreatment = 'I recognize that Divine Intelligence guides me in creating this treatment, and that Spiritual Law operates for my highest good.';
		} finally {
			isGenerating = false;
		}
	}

	// Enhance treatment with Holmes' characteristic language patterns
	function enhanceWithHolmesStyle(treatment: string): string {
		const enhancements = [
			'The Science of Mind teaches us that ',
			'Spiritual Law reveals that ',
			'Divine Intelligence shows us that ',
			'The Creative Power within you ',
			'Principle never fails to ',
			'Infinite Mind responds to ',
			'The Law of Mind operates through ',
			'Spiritual Substance flows as '
		];
		
		// Add some Holmes-style enhancements
		const enhancedParts = treatment.split('. ');
		const enhancedTreatment = enhancedParts.map((part, index) => {
			if (index === 0 && !part.includes('Science of Mind')) {
				return `The Science of Mind teaches us that ${part.toLowerCase()}`;
			}
			return part;
		});
		
		return enhancedTreatment.join('. ');
	}

	// Handle category change
	function handleCategoryChange() {
		selectedElements = [];
		generatedTreatment = '';
		if (!showCustomInput) {
			customTreatment = treatmentTemplates[selectedCategory].template;
		}
	}

	// Toggle custom input mode
	function toggleCustomInput() {
		showCustomInput = !showCustomInput;
		if (showCustomInput) {
			customTreatment = '';
		} else {
			customTreatment = treatmentTemplates[selectedCategory].template;
		}
		generatedTreatment = '';
	}

	// Handle element selection
	function toggleElement(element: string) {
		if (selectedElements.includes(element)) {
			selectedElements = selectedElements.filter(e => e !== element);
		} else {
			selectedElements = [...selectedElements, element];
		}
	}

	// Copy treatment to clipboard
	async function copyTreatment() {
		try {
			await navigator.clipboard.writeText(generatedTreatment);
			// Could add a toast notification here
		} catch (error) {
			console.error('Failed to copy treatment:', error);
		}
	}

	// Save treatment to history (integrate with existing system)
	async function saveTreatment() {
		try {
			const response = await fetch('/api/questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question: `Generated ${treatmentTemplates[selectedCategory].title}`,
					category: 'spiritual',
					isBookmarked: false,
					tags: ['treatment', selectedCategory, 'generated'],
					responsePreview: generatedTreatment,
					source: 'Treatment Generator',
					userIp: '',
					userMac: '',
					userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
					sessionId: ''
				})
			});
			
			if (response.ok) {
				// Could add success notification here
			}
		} catch (error) {
			console.error('Failed to save treatment:', error);
		}
	}

	// Initialize
	onMount(() => {
		customTreatment = treatmentTemplates[selectedCategory].template;
	});
</script>

{#if isVisible}
	<div 
		class="treatment-generator-overlay" 
		on:click|self={onClose}
		role="dialog"
		aria-modal="true"
		aria-label="Spiritual Mind Treatment Generator"
		tabindex="-1"
	>
		<div class="treatment-generator-container">
			<!-- Header -->
			<div class="generator-header">
				<h2 class="generator-title">🧘‍♀️ Spiritual Mind Treatment Generator</h2>
				<button class="close-btn" on:click={onClose} title="Close (Esc)" aria-label="Close treatment generator">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<!-- Generator Content -->
			<div class="generator-content">
				<!-- Category Selection -->
				<div class="category-section">
					<h3 class="section-title">Choose Treatment Category</h3>
					<div class="category-grid">
						{#each treatmentCategories as category}
							<button 
								class="category-btn" 
								class:active={selectedCategory === category.id}
								on:click={() => { selectedCategory = category.id; handleCategoryChange(); }}
							>
								<div class="category-name">{category.name}</div>
								<div class="category-description">{category.description}</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Custom Elements -->
				<div class="elements-section">
					<h3 class="section-title">Add Spiritual Elements (Optional)</h3>
					<div class="elements-grid">
						{#each corePrinciples as element}
							<button 
								class="element-btn" 
								class:selected={selectedElements.includes(element)}
								on:click={() => toggleElement(element)}
							>
								{element}
							</button>
						{/each}
					</div>
				</div>

				<!-- Custom Input Toggle -->
				<div class="custom-toggle">
					<button 
						class="toggle-btn" 
						class:active={showCustomInput}
						on:click={toggleCustomInput}
					>
						{showCustomInput ? 'Use Template' : 'Write Custom Treatment'}
					</button>
				</div>

				<!-- Custom Treatment Input -->
				{#if showCustomInput}
					<div class="custom-input-section">
						<h3 class="section-title">Write Your Custom Treatment</h3>
						<textarea 
							bind:value={customTreatment}
							placeholder="Write your spiritual treatment in Holmes' style..."
							class="custom-treatment-input"
							rows="6"
						></textarea>
					</div>
				{/if}

				<!-- Generate Button -->
				<div class="generate-section">
					<button 
						class="generate-btn" 
						on:click={generateTreatment}
						disabled={isGenerating}
					>
						{#if isGenerating}
							<div class="loading-spinner"></div>
							Generating Treatment...
						{:else}
							✨ Generate Treatment
						{/if}
					</button>
				</div>

				<!-- Generated Treatment -->
				{#if generatedTreatment}
					<div class="treatment-result">
						<h3 class="section-title">Your Spiritual Treatment</h3>
						<div class="treatment-text">
							{generatedTreatment}
						</div>
						<div class="treatment-actions">
							<button class="action-btn copy-btn" on:click={copyTreatment}>
								📋 Copy Treatment
							</button>
							<button class="action-btn save-btn" on:click={saveTreatment}>
								💾 Save to History
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.treatment-generator-overlay {
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
		padding: 1rem;
		backdrop-filter: blur(8px);
	}

	.treatment-generator-container {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		border-radius: 20px;
		padding: 2rem;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.generator-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.generator-title {
		color: #fbbf24;
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.close-btn {
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fbbf24;
	}

	.generator-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section-title {
		color: #fbbf24;
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.category-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
	}

	.category-btn:hover {
		background: rgba(251, 191, 36, 0.1);
		border-color: #fbbf24;
		transform: translateY(-2px);
	}

	.category-btn.active {
		background: rgba(251, 191, 36, 0.2);
		border-color: #fbbf24;
		box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
	}

	.category-name {
		color: #fbbf24;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.category-description {
		color: #9ca3af;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.elements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.element-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #d1d5db;
		font-size: 0.9rem;
	}

	.element-btn:hover {
		background: rgba(251, 191, 36, 0.1);
		border-color: #fbbf24;
	}

	.element-btn.selected {
		background: rgba(251, 191, 36, 0.2);
		border-color: #fbbf24;
		color: #fbbf24;
	}

	.custom-toggle {
		display: flex;
		justify-content: center;
	}

	.toggle-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #d1d5db;
	}

	.toggle-btn:hover {
		background: rgba(251, 191, 36, 0.1);
		border-color: #fbbf24;
	}

	.toggle-btn.active {
		background: rgba(251, 191, 36, 0.2);
		border-color: #fbbf24;
		color: #fbbf24;
	}

	.custom-treatment-input {
		width: 100%;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 1rem;
		color: #d1d5db;
		font-size: 1rem;
		line-height: 1.6;
		resize: vertical;
		transition: all 0.3s ease;
	}

	.custom-treatment-input:focus {
		outline: none;
		border-color: #fbbf24;
		background: rgba(255, 255, 255, 0.08);
	}

	.generate-section {
		display: flex;
		justify-content: center;
	}

	.generate-btn {
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: none;
		border-radius: 12px;
		padding: 1rem 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #1a1a2e;
		font-weight: 600;
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
	}

	.generate-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
	}

	.generate-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(26, 26, 46, 0.3);
		border-top: 2px solid #1a1a2e;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.treatment-result {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 1.5rem;
		margin-top: 1rem;
	}

	.treatment-text {
		color: #d1d5db;
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		border-left: 4px solid #fbbf24;
	}

	.treatment-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.action-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #d1d5db;
		font-weight: 500;
	}

	.action-btn:hover {
		background: rgba(251, 191, 36, 0.1);
		border-color: #fbbf24;
		color: #fbbf24;
		transform: translateY(-1px);
	}

	.copy-btn:hover {
		background: rgba(34, 197, 94, 0.1);
		border-color: #22c55e;
		color: #22c55e;
	}

	.save-btn:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: #3b82f6;
		color: #3b82f6;
	}

	@media (max-width: 768px) {
		.treatment-generator-container {
			padding: 1rem;
			margin: 0.5rem;
		}

		.generator-title {
			font-size: 1.5rem;
		}

		.category-grid {
			grid-template-columns: 1fr;
		}

		.elements-grid {
			grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		}

		.treatment-actions {
			flex-direction: column;
		}
	}
</style> 