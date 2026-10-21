<script lang="ts">
  interface Props {
    /** Height in px. */
    size?: number;
    priority?: boolean;
    alt?: string;
  }

  // "Book Sunrise" mark. The book follows --logo-body (indigo on light, white on dark); the sun stays gold.
  let { size = 36, alt = "" }: Props = $props();
  const ray = (a: number) =>
    `translate(100 96) rotate(${a + 90}) translate(0 -40)`;
  const angles = [-180, -150, -120, -90, -60, -30, 0];
  const page = "M94 162C76 140 48 134 18 142V78C48 70 76 76 94 98Z";
</script>

<svg
  viewBox="18 30.5 164 165.5"
  height={size}
  width={Math.round((size * 164) / 165.5)}
  role={alt ? "img" : undefined}
  aria-label={alt || undefined}
  aria-hidden={alt ? undefined : "true"}
  focusable="false"
  style="flex: none"
>
  <g fill="var(--logo-sun, #f7b500)" stroke="var(--logo-sun, #f7b500)" stroke-width="2.5" stroke-linejoin="round">
    {#each angles as a (a)}
      <path
        transform={ray(a)}
        d="M0 -24C4.1 -13.2 7.5 -2.3 7.5 0A7.5 7.5 0 0 1 -7.5 0C-7.5 -2.3 -4.1 -13.2 0 -24Z"
      />
    {/each}
    <circle cx="100" cy="96" r="26" stroke="none" />
  </g>
  <g fill="var(--logo-body, #3b2a6b)" transform="translate(0 34)">
    <path d={page} />
    <path transform="translate(200 0) scale(-1 1)" d={page} />
  </g>
</svg>
