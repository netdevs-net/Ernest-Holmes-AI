<script lang="ts">
  interface Props {
    /** Height in px. */
    size?: number;
    priority?: boolean;
    alt?: string;
  }

  let { size = 36, priority = false, alt = "" }: Props = $props();
</script>

<img
  src="/images/Holmes-AI-logo-192.png"
  {alt}
  height={size}
  width={Math.round(size * 0.783)}
  style:height="{size}px"
  style:width="auto"
  decoding="async"
  loading={priority ? "eager" : "lazy"}
  fetchpriority={priority ? "high" : "auto"}
/>
