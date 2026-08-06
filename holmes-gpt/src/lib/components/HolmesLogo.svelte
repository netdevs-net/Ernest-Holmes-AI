<script lang="ts">
	/** Optimized logo (96px max) — use instead of full 218KB PNG. */
	export let size: 'sm' | 'md' = 'md';
	export let priority = false;
	export let alt = 'HolmesAI';

	const sizes = {
		sm: { width: 24, height: 31, class: 'h-6 w-auto max-w-6 flex-shrink-0 mt-0.5' },
		md: { width: 40, height: 51, class: 'logo-image' },
	} as const;

	$: dim = sizes[size];
</script>

<img
	src="/images/Holmes-AI-logo-96.png"
	{alt}
	class={dim.class}
	width={dim.width}
	height={dim.height}
	decoding={priority ? 'sync' : 'async'}
	loading={priority ? 'eager' : 'lazy'}
	fetchpriority={priority ? 'high' : 'auto'}
/>

<style>
	.logo-image {
		width: 2.5rem;
		height: auto;
		max-height: 2.5rem;
		object-fit: contain;
		aspect-ratio: 75 / 96;
	}
</style>
