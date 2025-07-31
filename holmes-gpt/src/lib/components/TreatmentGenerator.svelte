<script lang="ts">
	import { onMount } from 'svelte';
	import { Star, Sparkles, Gem, Heart, Zap, Copy, Save, X, ArrowLeft } from 'lucide-svelte';
	
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
		{ id: 'courage', name: 'Courage Treatment', description: 'For strength and bravery' }
	];

	// Holmes' core principles for treatments
	const corePrinciples = [
		'Infinite Intelligence',
		'Divine Mind',
		'Spiritual Law',
		'Creative Power',
		'Divine Love',
		'Perfect Life',
		'Infinite Good',
		'Spiritual Harmony'
	];

	// Treatment templates in Holmes' style - Enhanced with longer, deeper, sectioned treatments
	const treatmentTemplates: Record<string, {
		title: string;
		template: string;
		keyElements: string[];
	}> = {
		general: {
			title: 'General Spiritual Treatment',
			template: `**RECOGNITION**
I recognize that I am one with Infinite Intelligence, that Divine Mind lives through me, and that Spiritual Law operates through my consciousness. I acknowledge that I am a spiritual being having a human experience, not a human being having a spiritual experience. I understand that the Creative Power of the universe flows through me as naturally as the breath flows through my body.

**AFFIRMATION**
I affirm that I am a channel for the Creative Power of the universe, and all that I need is already provided. I declare that Divine Intelligence guides me in all things, that Spiritual Law operates for my highest good, and that I walk in the consciousness of my oneness with the Infinite. I accept that my life is a perfect expression of Divine Intelligence, and that every experience serves my spiritual growth.

**DECLARATION**
I declare that I am one with the Infinite Source of all good, that Divine Mind expresses through me, and that Spiritual Law brings into my experience that which I consciously accept as true. I proclaim that the Creative Power within me is unlimited, that Divine Intelligence knows no limitation, and that I am here to demonstrate the Truth of my being.

**GRATITUDE**
I give thanks for the infinite good that surrounds me, for the Divine Intelligence that guides me, and for the Spiritual Law that operates through me. I am grateful for the opportunity to express the Creative Power within me, for the love that flows through my life, and for the perfect harmony that exists in the universe.

**ACCEPTANCE**
I accept that I am whole, perfect, and complete, that Divine Intelligence is my life, and that Spiritual Law operates for my highest good. I embrace the Truth that I am one with the Infinite, that the Creative Power within me is greater than any challenge I may face, and that my life is a perfect demonstration of spiritual principles.`,
			keyElements: ['Oneness with Infinite Intelligence', 'Divine Mind expression', 'Spiritual Law operation', 'Creative Power channeling', 'Perfect demonstration']
		},
		healing: {
			title: 'Healing Treatment',
			template: `**RECOGNITION**
I recognize that Divine Intelligence is my life, that Spiritual Law operates through me, and that I am one with the healing power of the universe. I acknowledge that my body is a perfect expression of Divine Intelligence, that every cell responds to the Truth of wholeness, and that the Creative Power within me knows no limitation.

**AFFIRMATION**
I affirm that I am whole, perfect, and complete, that Divine Intelligence flows through every cell of my being, and that Spiritual Law operates for my perfect health. I declare that my body is a temple of the living God, that Divine Love flows through me abundantly, and that I am one with the healing power of the universe.

**DECLARATION**
I declare that Divine Intelligence is my life, that Spiritual Law brings perfect health into my experience, and that the Creative Power within me transforms every condition into wholeness. I proclaim that my body responds to the Truth of its divine nature, that every organ functions perfectly, and that I am surrounded by the healing presence of Divine Love.

**GRATITUDE**
I give thanks for the perfect health that is my divine birthright, for the Divine Intelligence that flows through me, and for the Spiritual Law that operates for my wholeness. I am grateful for the healing power that surrounds me, for the perfect harmony that exists in my body, and for the opportunity to demonstrate the Truth of perfect health.

**ACCEPTANCE**
I accept that I am whole, perfect, and complete, that Divine Intelligence is my life, and that Spiritual Law operates for my perfect health. I embrace the Truth that my body is a perfect expression of Divine Intelligence, that every cell responds to the Truth of wholeness, and that I am one with the healing power of the universe.`,
			keyElements: ['Divine Intelligence as life', 'Spiritual Law operation', 'Healing power connection', 'Wholeness recognition', 'Perfect health demonstration']
		},
		prosperity: {
			title: 'Prosperity Treatment',
			template: `**RECOGNITION**
I recognize that I am one with the Infinite Source of all abundance, that Divine Intelligence guides me to my highest good, and that Spiritual Law operates for my prosperity. I acknowledge that Spiritual Substance is the essence of all things, that this Substance flows through me abundantly, and that the Creative Power within me attracts all that I need.

**AFFIRMATION**
I affirm that I am one with the Infinite Source of all good, that Divine Intelligence opens the way to abundance, and that Spiritual Law brings prosperity into my experience. I declare that the Creative Power of the universe flows through me abundantly, that all that I need is already provided, and that I walk in the consciousness of infinite supply.

**DECLARATION**
I declare that I am a magnet for abundance, that Divine Intelligence guides me to my highest good, and that Spiritual Law operates for my prosperity. I proclaim that the Creative Power within me attracts all that I need, that Divine Intelligence knows the way to abundance, and that I am surrounded by infinite opportunities for growth and expansion.

**GRATITUDE**
I give thanks for the abundance that flows through my life, for the Divine Intelligence that guides me to my highest good, and for the Spiritual Law that operates for my prosperity. I am grateful for the infinite opportunities that surround me, for the Creative Power that flows through me, and for the perfect supply that is always available.

**ACCEPTANCE**
I accept that I am one with the Infinite Source of all abundance, that Divine Intelligence guides me to my highest good, and that Spiritual Law operates for my prosperity. I embrace the Truth that the Creative Power within me attracts all that I need, that abundance is my divine birthright, and that I walk in the consciousness of infinite supply.`,
			keyElements: ['Infinite Source connection', 'Divine Intelligence guidance', 'Spiritual Law for prosperity', 'Abundant flow', 'Perfect supply']
		},
		relationships: {
			title: 'Relationship Treatment',
			template: `**RECOGNITION**
I recognize that Divine Love flows through all my relationships, that Spiritual Law brings harmony and understanding, and that I am one with the Infinite Source of all love. I acknowledge that every relationship is a mirror of my own consciousness, that I attract to myself that which I am, and that Divine Intelligence guides me to perfect relationships.

**AFFIRMATION**
I affirm that I see each person as a spiritual being, perfect in their essence, and that Divine Love flows through all my relationships. I declare that Spiritual Law brings harmony and understanding into my relationships, that I am surrounded by love, and that every relationship serves my spiritual growth.

**DECLARATION**
I declare that Divine Love flows through me abundantly, that I attract to myself relationships that reflect my divine nature, and that Spiritual Law operates for the highest good of all. I proclaim that every relationship is a blessing, that Divine Intelligence guides me to perfect harmony, and that I am one with the Infinite Source of all love.

**GRATITUDE**
I give thanks for the love that surrounds me, for the relationships that bless my life, and for the Divine Intelligence that guides me to perfect harmony. I am grateful for the opportunity to express Divine Love, for the spiritual growth that comes through relationships, and for the perfect harmony that exists in the universe.

**ACCEPTANCE**
I accept that Divine Love flows through all my relationships, that Spiritual Law brings harmony and understanding, and that I am one with the Infinite Source of all love. I embrace the Truth that every relationship serves my spiritual growth, that I attract to myself that which I am, and that perfect harmony is my divine birthright.`,
			keyElements: ['Divine Love flow', 'Spiritual Law harmony', 'Perfect essence recognition', 'Divine attraction', 'Perfect relationships']
		},
		purpose: {
			title: 'Purpose Treatment',
			template: `**RECOGNITION**
I recognize that my purpose is to express the Divine Intelligence that lives within me, that Spiritual Law guides me to my highest path, and that the Creative Power of the universe flows through me for the benefit of all. I acknowledge that I am here to demonstrate the Truth of my being, to be a channel for infinite good, and to fulfill my divine destiny.

**AFFIRMATION**
I affirm that Divine Intelligence reveals my purpose to me, that Spiritual Law guides me to my highest path, and that the Creative Power within me flows abundantly for the benefit of all. I declare that I am here to serve, to love, and to express the divine qualities that live within me.

**DECLARATION**
I declare that my purpose is clear and definite, that Divine Intelligence guides me in all things, and that Spiritual Law operates for my highest good. I proclaim that I am a channel for infinite good, that my life serves a divine purpose, and that I fulfill my destiny with joy and enthusiasm.

**GRATITUDE**
I give thanks for the purpose that guides my life, for the Divine Intelligence that reveals my path, and for the opportunity to serve and express the divine qualities within me. I am grateful for the Creative Power that flows through me, for the spiritual growth that comes through fulfilling my purpose, and for the joy that comes from serving others.

**ACCEPTANCE**
I accept that my purpose is to express the Divine Intelligence within me, that Spiritual Law guides me to my highest path, and that I am here to demonstrate the Truth of my being. I embrace the Truth that I am a channel for infinite good, that my life serves a divine purpose, and that I fulfill my destiny with perfect joy.`,
			keyElements: ['Divine Intelligence expression', 'Spiritual Law guidance', 'Creative Power flow', 'Truth demonstration', 'Divine purpose']
		},
		peace: {
			title: 'Peace Treatment',
			template: `**RECOGNITION**
I recognize that I am one with the Infinite Peace that passes all understanding, that Divine Intelligence brings calm to my mind, and that Spiritual Law operates for my serenity. I acknowledge that peace is my natural state, that Divine Intelligence knows no disturbance, and that I am surrounded by the perfect peace of the Infinite.

**AFFIRMATION**
I affirm that peace flows through me as naturally as breathing, that Divine Intelligence brings calm to every situation, and that Spiritual Law operates for my perfect serenity. I declare that I rest in the consciousness of my oneness with the Infinite, that peace is my divine birthright, and that nothing can disturb the peace that lives within me.

**DECLARATION**
I declare that I am one with Infinite Peace, that Divine Intelligence brings calm to my mind and heart, and that Spiritual Law operates for my perfect serenity. I proclaim that peace flows through me abundantly, that I am undisturbed by outer conditions, and that I rest in the consciousness of perfect peace.

**GRATITUDE**
I give thanks for the peace that lives within me, for the Divine Intelligence that brings calm to my mind, and for the Spiritual Law that operates for my serenity. I am grateful for the perfect peace that surrounds me, for the calm that flows through me, and for the opportunity to demonstrate the Truth of perfect peace.

**ACCEPTANCE**
I accept that I am one with Infinite Peace, that Divine Intelligence brings calm to my mind, and that Spiritual Law operates for my perfect serenity. I embrace the Truth that peace is my natural state, that nothing can disturb the peace within me, and that I rest in the consciousness of perfect peace.`,
			keyElements: ['Infinite Peace connection', 'Divine Intelligence calm', 'Spiritual Law serenity', 'Natural peace flow', 'Perfect peace']
		},
		gratitude: {
			title: 'Gratitude Treatment',
			template: `**RECOGNITION**
I recognize that I am surrounded by infinite good, that Divine Intelligence has provided all that I need, and that Spiritual Law operates for my highest good. I acknowledge that gratitude opens the way to greater good, that appreciation attracts abundance, and that thankfulness is the key to spiritual growth.

**AFFIRMATION**
I affirm that I give thanks for the abundance that flows through my life, for the love that surrounds me, and for the opportunity to express the Creative Power within me. I declare that gratitude flows through me abundantly, that I appreciate all that I have, and that thankfulness opens the way to greater good.

**DECLARATION**
I declare that I am grateful for every experience, for every relationship, and for every opportunity that comes into my life. I proclaim that gratitude is my natural state, that appreciation flows through me abundantly, and that thankfulness attracts greater good into my experience.

**GRATITUDE**
I give thanks for the infinite good that surrounds me, for the Divine Intelligence that guides me, and for the Spiritual Law that operates for my highest good. I am grateful for the abundance that flows through my life, for the love that surrounds me, and for the opportunity to express the Creative Power within me.

**ACCEPTANCE**
I accept that I am surrounded by infinite good, that gratitude opens the way to greater good, and that appreciation attracts abundance into my life. I embrace the Truth that thankfulness is the key to spiritual growth, that gratitude flows through me abundantly, and that I am blessed beyond measure.`,
			keyElements: ['Infinite good recognition', 'Divine Intelligence provision', 'Spiritual Law operation', 'Abundance gratitude', 'Perfect appreciation']
		},
		forgiveness: {
			title: 'Forgiveness Treatment',
			template: `**RECOGNITION**
I recognize that Divine Love flows through me, that Spiritual Law operates for the highest good of all, and that I am one with the Infinite Source of all forgiveness. I acknowledge that forgiveness is the key to freedom, that Divine Love knows no resentment, and that I am here to demonstrate the Truth of divine harmony.

**AFFIRMATION**
I affirm that I release all that no longer serves me, that I forgive myself and others completely, and that I walk in the consciousness of divine harmony and peace. I declare that Divine Love flows through me abundantly, that forgiveness is my natural state, and that I am free from all resentment and bitterness.

**DECLARATION**
I declare that I forgive completely and unconditionally, that Divine Love flows through all my relationships, and that Spiritual Law operates for the highest good of all. I proclaim that forgiveness sets me free, that Divine Love knows no limitation, and that I walk in the consciousness of perfect harmony.

**GRATITUDE**
I give thanks for the power of forgiveness, for the Divine Love that flows through me, and for the freedom that comes from releasing all resentment. I am grateful for the opportunity to demonstrate the Truth of divine harmony, for the peace that comes from forgiveness, and for the love that surrounds me.

**ACCEPTANCE**
I accept that forgiveness is the key to freedom, that Divine Love flows through me abundantly, and that I am one with the Infinite Source of all forgiveness. I embrace the Truth that forgiveness sets me free, that Divine Love knows no resentment, and that I walk in the consciousness of perfect harmony.`,
			keyElements: ['Divine Love flow', 'Spiritual Law operation', 'Infinite forgiveness', 'Divine harmony', 'Perfect freedom']
		},
		courage: {
			title: 'Courage Treatment',
			template: `**RECOGNITION**
I recognize that I am one with Infinite Intelligence, which knows no fear, that Divine Mind gives me strength, and that Spiritual Law operates for my highest good. I acknowledge that courage is my divine birthright, that Divine Intelligence knows no limitation, and that I am here to demonstrate the Truth of divine power.

**AFFIRMATION**
I affirm that I walk in the consciousness of my divine power, that Divine Intelligence gives me strength for every challenge, and that Spiritual Law operates for my highest good. I declare that courage flows through me abundantly, that I face every situation with confidence, and that the Creative Force within me is greater than any challenge I may face.

**DECLARATION**
I declare that I am fearless and confident, that Divine Intelligence guides me through every challenge, and that Spiritual Law operates for my highest good. I proclaim that courage is my natural state, that Divine Power flows through me abundantly, and that I am equal to every situation that comes into my life.

**GRATITUDE**
I give thanks for the courage that lives within me, for the Divine Intelligence that gives me strength, and for the Spiritual Law that operates for my highest good. I am grateful for the opportunity to demonstrate the Truth of divine power, for the confidence that flows through me, and for the strength that comes from Divine Intelligence.

**ACCEPTANCE**
I accept that I am one with Infinite Intelligence, which knows no fear, that Divine Mind gives me strength, and that Spiritual Law operates for my highest good. I embrace the Truth that courage is my divine birthright, that Divine Power flows through me abundantly, and that I am equal to every challenge that comes into my life.`,
			keyElements: ['Infinite Intelligence fearlessness', 'Divine Mind strength', 'Spiritual Law support', 'Divine power consciousness', 'Perfect courage']
		}
	};

	// Reactive variables
	let selectedCategory = 'general';
	let customTreatment = '';
	let generatedTreatment = '';
	let isGenerating = false;
	let showCustomInput = false;
	let customElements: string[] = [];
	let selectedElements: string[] = [];
	let showTreatmentDisplay = false; // New state to control view mode

	// Props
	export let isVisible = false;
	export let onClose: () => void = () => {};

	// Generate treatment based on selected category and custom elements
	async function generateTreatment() {

		isGenerating = true;
		
		try {
			let treatment = '';
			
			// If custom treatment is provided, use AI to expand it
			if (showCustomInput && customTreatment.trim()) {
				// Call HolmesGPT API to expand the custom treatment
				const prompt = `Please expand and enhance this spiritual treatment in Ernest Holmes' style, following the Science of Mind principles. Organize it into the five sections: RECOGNITION, AFFIRMATION, DECLARATION, GRATITUDE, and ACCEPTANCE. Make it comprehensive and deeply spiritual while maintaining the essence of what I've written:

${customTreatment}

Please format it with **RECOGNITION**, **AFFIRMATION**, **DECLARATION**, **GRATITUDE**, and **ACCEPTANCE** section headers.`;

				console.log('Sending custom treatment to AI:', { customTreatment, prompt });
				
				const response = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						message: prompt,
						category: 'spiritual'
					})
				});
				
				if (response.ok) {
					const data = await response.json();
					console.log('AI response received:', data);
					treatment = data.response;
					
					if (!treatment || treatment.trim() === '') {
						throw new Error('AI returned empty response');
					}
				} else {
					const errorText = await response.text();
					console.error('API error response:', errorText);
					throw new Error(`API error: ${response.status} - ${errorText}`);
				}
			} else {
				// Use template-based generation
				const template = treatmentTemplates[selectedCategory];
				treatment = template.template;
				
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
				
				// Enhance with Holmes' characteristic language patterns
				treatment = enhanceWithHolmesStyle(treatment);
			}
			
			generatedTreatment = treatment;
			showTreatmentDisplay = true; // Switch to treatment display mode
			
		} catch (error) {
			console.error('Error generating treatment:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			generatedTreatment = `Error generating treatment: ${errorMessage}. Please try again or check your connection.`;
			showTreatmentDisplay = true; // Show error in treatment mode
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
		showTreatmentDisplay = false; // Reset to selection mode
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
		showTreatmentDisplay = false; // Reset to selection mode
	}

	// Handle element selection
	function toggleElement(element: string) {
		if (selectedElements.includes(element)) {
			selectedElements = selectedElements.filter(e => e !== element);
		} else {
			selectedElements = [...selectedElements, element];
		}
		// Reset to selection mode when elements change
		if (showTreatmentDisplay) {
			showTreatmentDisplay = false;
			generatedTreatment = '';
		}
	}

	// Format treatment with proper HTML styling for sections
	function formatTreatment(treatment: string): string {
		// Convert markdown-style section headers to HTML with proper structure  
		let formatted = treatment
			.replace(/\*\*(RECOGNITION)\*\*/g, '</div><div class="treatment-section"><h4 class="section-header recognition"><span class="section-icon">⭐</span> RECOGNITION</h4><p>')
			.replace(/\*\*(AFFIRMATION)\*\*/g, '</p></div><div class="treatment-section"><h4 class="section-header affirmation"><span class="section-icon">✨</span> AFFIRMATION</h4><p>')
			.replace(/\*\*(DECLARATION)\*\*/g, '</p></div><div class="treatment-section"><h4 class="section-header declaration"><span class="section-icon">💎</span> DECLARATION</h4><p>')
			.replace(/\*\*(GRATITUDE)\*\*/g, '</p></div><div class="treatment-section"><h4 class="section-header gratitude"><span class="section-icon">🙏</span> GRATITUDE</h4><p>')
			.replace(/\*\*(ACCEPTANCE)\*\*/g, '</p></div><div class="treatment-section"><h4 class="section-header acceptance"><span class="section-icon">⚡</span> ACCEPTANCE</h4><p>');
		
		// Close the final paragraph and section
		formatted += '</p></div>';
		
		// Remove the initial closing div that was added by the first replacement
		formatted = formatted.replace(/^<\/div>/, '');
		
		// Convert line breaks within paragraphs
		formatted = formatted.replace(/\n/g, '<br>');
		
		// Clean up any empty paragraphs or double breaks
		formatted = formatted.replace(/<p><\/p>/g, '');
		formatted = formatted.replace(/<br><br>/g, '<br>');
		
		return formatted;
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

	// Go back to selection mode
	function backToSelection() {
		showTreatmentDisplay = false;
		generatedTreatment = '';
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
		on:keydown={(e) => e.key === 'Escape' && onClose()}
		role="dialog"
		aria-modal="true"
		aria-label="Spiritual Mind Treatment Generator"
		tabindex="-1"
	>
		<div class="treatment-generator-container">
			<!-- Header -->
			<div class="generator-header">
				<h2 class="generator-title"><Heart class="title-icon" size={24} /> Spiritual Mind Treatment Generator</h2>
				<button class="close-btn" on:click={onClose} title="Close (Esc)" aria-label="Close treatment generator">
					<X size={24} />
				</button>
			</div>

			<!-- Generator Content -->
			<div class="generator-content">
				{#if !showTreatmentDisplay}
					<!-- Selection Mode -->
					<div class="selection-mode">
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
								{showCustomInput ? 'Use Template' : 'AI-Enhanced Custom Treatment'}
							</button>
						</div>

						<!-- Custom Treatment Input -->
						{#if showCustomInput}
							<div class="custom-input-section">
								<h3 class="section-title">Write Your Custom Treatment</h3>
								<p class="custom-description">
									Write your spiritual treatment idea, and AI will expand it into a comprehensive treatment in Ernest Holmes' style with all five sections.
								</p>
								<textarea 
									bind:value={customTreatment}
									placeholder="Write your spiritual treatment idea or starting point... AI will expand this into a full treatment with RECOGNITION, AFFIRMATION, DECLARATION, GRATITUDE, and ACCEPTANCE sections."
									class="custom-treatment-input"
									rows="6"
									aria-label="Custom spiritual treatment input"
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
									<Sparkles size={20} /> Generate Treatment
								{/if}
							</button>
						</div>
					</div>
				{:else}
					<!-- Treatment Display Mode -->
					<div class="treatment-display-mode">
						<!-- Back Button -->
						<div class="back-section">
							<button class="back-btn" on:click={backToSelection}>
								<ArrowLeft size={16} /> Back to Generator
							</button>
						</div>

						<!-- Generated Treatment -->
						{#if generatedTreatment}
							<div class="treatment-result">
								<h3 class="section-title">Your Spiritual Treatment</h3>
								<div class="treatment-text">
									{@html formatTreatment(generatedTreatment)}
								</div>
								<div class="treatment-actions">
									<button class="action-btn copy-btn" on:click={copyTreatment}>
										<Copy size={16} /> Copy Treatment
									</button>
									<button class="action-btn save-btn" on:click={saveTreatment}>
										<Save size={16} /> Save to History
									</button>
								</div>
							</div>
						{/if}
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
		background: var(--glass-bg);
		border-radius: 20px;
		padding: 2rem;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		overflow-x: hidden;
		box-shadow: 0 25px 50px var(--shadow-medium);
		border: 1px solid var(--border-primary);
		backdrop-filter: blur(20px);
		/* Prevent box-shadows from extending beyond container */
		clip-path: inset(0);
	}

	.generator-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-primary);
	}

	.generator-title {
		color: var(--text-accent);
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.title-icon {
		color: var(--text-accent);
		flex-shrink: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}

	.close-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-accent);
	}

	.generator-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section-title {
		color: var(--text-accent);
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
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 12px;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
	}

	.category-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		transform: translateY(-2px);
	}

	.category-btn.active {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		box-shadow: 0 4px 12px var(--shadow-light);
		/* Prevent shadow from extending beyond container */
		clip-path: inset(0);
	}

	.category-name {
		color: var(--text-accent);
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.category-description {
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.elements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.element-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--text-primary);
		font-size: 0.9rem;
	}

	.element-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
	}

	.element-btn.selected {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		color: var(--text-accent);
	}

	.custom-toggle {
		display: flex;
		justify-content: center;
	}

	.toggle-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--text-primary);
	}

	.toggle-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
	}

	.toggle-btn.active {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		color: var(--text-accent);
	}

	.custom-description {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.custom-treatment-input {
		width: 100%;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 12px;
		padding: 1rem;
		color: var(--text-primary) !important;
		font-size: 1rem;
		line-height: 1.6;
		resize: vertical;
		transition: all 0.3s ease;
	}

	.custom-treatment-input:focus {
		outline: none;
		border-color: var(--text-accent);
		background: var(--glass-bg);
	}

	.custom-treatment-input::placeholder {
		color: var(--text-secondary);
		opacity: 0.8;
	}

	.generate-section {
		display: flex;
		justify-content: center;
	}

	.generate-btn {
		background: linear-gradient(135deg, var(--text-accent) 0%, var(--text-accent-hover) 100%);
		border: none;
		border-radius: 12px;
		padding: 1rem 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--bg-primary);
		font-weight: 600;
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 4px 12px var(--shadow-light);
		/* Prevent shadow from extending beyond container */
		clip-path: inset(0);
	}

	.generate-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px var(--shadow-medium);
		/* Prevent shadow from extending beyond container */
		clip-path: inset(0);
	}

	.generate-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--border-secondary);
		border-top: 2px solid var(--text-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.treatment-result {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 12px;
		padding: 1.5rem;
		margin-top: 1rem;
	}

	.treatment-text {
		color: var(--text-primary);
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--glass-bg);
		border-radius: 8px;
		border-left: 4px solid var(--text-accent);
	}


	.treatment-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.action-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--text-primary);
		font-weight: 500;
	}

	.action-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		color: var(--text-accent);
		transform: translateY(-1px);
	}

	.copy-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-success);
		color: var(--text-success);
	}

	.save-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-info);
		color: var(--text-info);
	}

	/* Treatment Display Mode Styles */
	.treatment-display-mode {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.back-section {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 1rem;
	}

	.back-btn {
		background: var(--bg-secondary);
		border: 1px solid var(--border-secondary);
		border-radius: 8px;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--text-primary);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.back-btn:hover {
		background: var(--bg-tertiary);
		border-color: var(--text-accent);
		color: var(--text-accent);
		transform: translateY(-1px);
	}

	.selection-mode {
		display: flex;
		flex-direction: column;
		gap: 2rem;
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