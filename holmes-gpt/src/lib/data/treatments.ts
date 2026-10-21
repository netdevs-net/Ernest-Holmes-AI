/** Treatment categories and ready-made Science of Mind treatment templates. */

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
}

export interface TreatmentTemplate {
  title: string;
  template: string;
  keyElements: string[];
}

export const treatmentCategories: TreatmentCategory[] = [
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

export const treatmentTemplates: Record<string, TreatmentTemplate> = {
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
