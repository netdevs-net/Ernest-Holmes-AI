<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import Brain from "@lucide/svelte/icons/brain";
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import Handshake from "@lucide/svelte/icons/handshake";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Heart from "@lucide/svelte/icons/heart";
  import Lock from "@lucide/svelte/icons/lock";
  import Mail from "@lucide/svelte/icons/mail";
  import Smartphone from "@lucide/svelte/icons/smartphone";
  import Users from "@lucide/svelte/icons/users";

  const SITE = "https://holmes-ai.netdevs.net";
  const PAGE_URL = `${SITE}/support`;
  const EMAIL = "support@holmes-ai.netdevs.net";

  const TITLE = "Support Holmes AI - Preserve Ernest Holmes' Spiritual Wisdom | Donate to Spiritual Technology";
  const DESCRIPTION =
    "Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations. Your contribution makes authentic Science of Mind guidance accessible to spiritual seekers worldwide.";
  const KEYWORDS =
    "support Holmes AI, donate spiritual technology, Ernest Holmes preservation, Science of Mind funding, spiritual AI support, Religious Science donation, metaphysical technology funding, Ernest Holmes legacy support, spiritual guidance funding, AI spiritual teacher support, Science of Mind preservation, spiritual technology donation, Ernest Holmes wisdom preservation, metaphysical AI funding, spiritual innovation support, Religious Science technology funding, Ernest Holmes AI support, spiritual technology preservation, Science of Mind technology funding, metaphysical wisdom preservation, spiritual AI development funding, Ernest Holmes teachings preservation, spiritual technology innovation funding, AI spiritual guidance support, Ernest Holmes digital legacy, spiritual technology mission funding, Science of Mind AI funding, metaphysical technology preservation, spiritual guidance technology funding, Ernest Holmes AI preservation funding, spiritual technology mission support";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Support Holmes AI",
      description: "Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations.",
      url: PAGE_URL,
      datePublished: "2024-12-19",
      dateModified: "2024-12-19",
      mainEntity: {
        "@type": "Organization",
        name: "Holmes AI",
        description: "Preserving Ernest Holmes' wisdom through AI technology",
        foundingDate: "2024",
        mission:
          "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through cutting-edge AI technology",
      },
      about: {
        "@type": "Thing",
        name: "Spiritual Technology Funding",
        description: "Supporting the preservation of Ernest Holmes' spiritual wisdom through AI technology",
      },
      keywords: KEYWORDS,
    },
    {
      "@context": "https://schema.org",
      "@type": "DonateAction",
      name: "Support Holmes AI",
      description: "Help preserve Ernest Holmes' spiritual wisdom for future generations",
      recipient: {
        "@type": "Organization",
        name: "Holmes AI",
        description: "Preserving Ernest Holmes' wisdom through AI technology",
      },
      target: { "@type": "EntryPoint", urlTemplate: PAGE_URL, actionPlatform: "https://schema.org/WebSite" },
      result: {
        "@type": "Thing",
        name: "Spiritual Technology Development",
        description: "Advanced AI spiritual guidance platform",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Holmes AI",
      description: "Preserving Ernest Holmes' spiritual wisdom through cutting-edge AI technology",
      url: SITE,
      logo: `${SITE}/images/logo.ico`,
      foundingDate: "2024",
      mission: "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through AI technology",
      sameAs: ["https://twitter.com/holmesai", "https://facebook.com/holmesai", "https://linkedin.com/company/holmesai"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: EMAIL,
        availableLanguage: "English",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Support Options",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Monthly Support",
              description: "Recurring monthly support for ongoing development",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "One-time Donation",
              description: "Single contribution to support development",
            },
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Support", item: PAGE_URL },
      ],
    },
  ];

  // Static data only; "<" is escaped so the payload can never close the script tag.
  const ldScripts = jsonLd.map(
    (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}<` + `/script>`,
  );

  const reasons = [
    {
      icon: Heart,
      title: "Preserving authentic wisdom",
      body: "Ernest Holmes' teachings have touched millions of lives, offering practical spiritual wisdom that transcends time and culture. Our mission is to ensure his authentic voice and teachings remain accessible to spiritual seekers worldwide through innovative AI technology.",
    },
    {
      icon: Users,
      title: "Making wisdom accessible",
      body: "We believe spiritual guidance should be available to everyone, regardless of location, time, or financial means. Holmes AI provides 24/7 access to Ernest Holmes' wisdom, making authentic spiritual guidance available whenever it's needed most.",
    },
    {
      icon: Brain,
      title: "Advancing spiritual technology",
      body: "We're pioneering the intersection of spirituality and artificial intelligence, developing technologies that preserve the authenticity and effectiveness of traditional spiritual practices while making them accessible in the digital age.",
    },
  ];

  const tiers = [
    {
      name: "Monthly Supporter",
      amount: "$25/month",
      note: "",
      featured: false,
      cta: "Support monthly",
      subject: "Monthly support for Holmes AI",
      intro: "",
      benefits: [
        "Helps maintain server costs and infrastructure",
        "Supports AI model improvements and updates",
        "Enables new feature development",
        "Your name in our supporters list",
        "Early access to new features",
      ],
    },
    {
      name: "Annual Supporter",
      amount: "$250/year",
      note: "Save $50/year",
      featured: true,
      cta: "Support annually",
      subject: "Annual support for Holmes AI",
      intro: "",
      benefits: [
        "All monthly benefits",
        "Priority access to new features",
        "Exclusive supporter updates and insights",
        "Recognition on our website",
        "Invitation to supporter-only events",
        "Direct input on feature development",
      ],
    },
    {
      name: "Custom Amount",
      amount: "Any amount",
      note: "",
      featured: false,
      cta: "Custom support",
      subject: "Custom support for Holmes AI",
      intro:
        "Choose your own amount to support Holmes AI. Every contribution, no matter the size, helps preserve Ernest Holmes' legacy.",
      benefits: [
        "Flexible contribution amount",
        "One-time or recurring options",
        "Thank you acknowledgment",
      ],
    },
  ];

  const impact = [
    {
      title: "Reaching new generations",
      body: "Your support helps introduce Ernest Holmes' transformative teachings to a new generation of spiritual seekers, including digital natives who might never have discovered his insights through traditional means.",
    },
    {
      title: "Mobile-first spiritual growth",
      body: "We're building mobile-first spiritual guidance so seekers can be reached where they are, on their phones, tablets, and devices, with wisdom available 24/7.",
    },
    {
      title: "Community building",
      body: "Your contribution helps build a global community of spiritual seekers connected through Ernest Holmes' teachings, with digital spaces to explore, learn, and grow together regardless of location or background.",
    },
    {
      title: "Preserving authenticity",
      body: "Your support helps keep Ernest Holmes' authentic voice and teachings pure and undistorted, investing in technology that preserves the essence of his wisdom while making it accessible to modern audiences.",
    },
  ];

  const roadmap = [
    {
      title: "Advanced AI and voice",
      items: [
        ["Voice integration", "text-to-speech and speech-to-text"],
        ["Multi-language support", "international accessibility and localization"],
        ["Custom fine-tuned models", "specialized models for enhanced authenticity"],
        ["Mobile apps", "native iOS and Android applications"],
      ],
    },
    {
      title: "Community and growth",
      items: [
        ["User accounts", "secure registration and personalized experiences"],
        ["Community features", "shared conversations and spiritual community building"],
        ["Educational content", "interactive courses and learning modules"],
        ["Personalized recommendations", "AI-powered content suggestions"],
      ],
    },
    {
      title: "Enterprise and scale",
      items: [
        ["Multi-tenant support", "for multiple spiritual organizations"],
        ["API access", "public API for third-party integrations"],
        ["White-label solutions", "customizable branding for organizations"],
        ["Advanced analytics", "predictive analytics and spiritual trend analysis"],
      ],
    },
  ];

  const reasonIcons = [Heart, Users, Brain, Sparkles];

  let copied = $state(false);
  let copyFailed = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function flash(ok: boolean) {
    copied = ok;
    copyFailed = !ok;
    clearTimeout(timer);
    timer = setTimeout(() => {
      copied = false;
      copyFailed = false;
    }, 2200);
  }

  function legacyCopy(text: string): boolean {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      el.remove();
      return ok;
    } catch {
      return false;
    }
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
        flash(true);
        return;
      }
    } catch {
      // fall through to the legacy path
    }
    flash(legacyCopy(EMAIL));
  }

  const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
</script>

<svelte:head>
  <title>{TITLE}</title>
  <meta name="description" content={DESCRIPTION} />
  <meta name="keywords" content={KEYWORDS} />
  <meta name="author" content="Holmes AI Team" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={PAGE_URL} />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:site_name" content="Holmes AI" />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={PAGE_URL} />
  <meta property="twitter:title" content={TITLE} />
  <meta property="twitter:description" content={DESCRIPTION} />

  <link rel="canonical" href={PAGE_URL} />

  {#each ldScripts as ld}
    {@html ld}
  {/each}
</svelte:head>

<style>
  .glow {
    position: absolute;
    inset: -4rem -10% auto;
    height: 26rem;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      ellipse 55% 60% at 50% 40%,
      color-mix(in srgb, var(--accent-bright) 28%, transparent),
      transparent 70%
    );
  }
  .timeline {
    position: relative;
  }
  .timeline::before {
    content: "";
    position: absolute;
    left: 1.125rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 2px;
    background: linear-gradient(to bottom, var(--accent-bright), var(--line));
  }
</style>

<main class="mx-auto w-full max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
  <!-- Hero -->
  <header class="relative isolate mb-16 text-center sm:mb-24">
    <div class="glow" aria-hidden="true"></div>
    <p class="eyebrow rise mb-4">Community support</p>
    <h1 class="rise text-display mx-auto max-w-3xl font-medium text-balance" style="animation-delay: 60ms">
      Support Holmes AI
    </h1>
    <p
      class="rise mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 text-pretty"
      style="animation-delay: 120ms"
    >
      Help preserve Ernest Holmes' legacy for future generations. Holmes AI helps spiritual seekers reach his
      teachings in a way that feels personal, immediate, and transformative, and your support keeps this resource
      accessible to all who seek it.
    </p>
    <div class="rise mt-8 flex flex-wrap justify-center gap-3" style="animation-delay: 180ms">
      <a class="btn btn-primary" href="#tiers">Become a supporter <ArrowRight size={16} aria-hidden="true" /></a>
      <a class="btn btn-soft" href={mailto("Supporting Holmes AI")}>
        <Mail size={16} aria-hidden="true" /> Email us
      </a>
    </div>
  </header>

  <div class="flex flex-col gap-16 sm:gap-24">
    <!-- Tiers -->
    <section id="tiers" aria-labelledby="ways" class="scroll-mt-24">
      <div class="mx-auto mb-10 max-w-2xl text-center">
        <p class="eyebrow mb-3">Join us</p>
        <h2 id="ways" class="text-3xl font-medium text-balance sm:text-4xl">How you can support</h2>
        <p class="mt-4 leading-relaxed text-ink-2 text-pretty">
          Your support helps us maintain and improve Holmes AI, ensuring Ernest Holmes' wisdom remains accessible to
          spiritual seekers worldwide. To contribute, write to us and we will reply with the details.
        </p>
      </div>
      <div class="grid items-stretch gap-5 md:grid-cols-3">
        {#each tiers as t, i (t.name)}
          <article
            class="rise glass card relative flex flex-col gap-5 {t.featured
              ? 'border-2 border-[var(--accent-bright)] shadow-float md:-translate-y-3'
              : ''}"
            style="animation-delay: {i * 80}ms"
          >
            {#if t.featured}
              <span
                class="chip absolute -top-3 left-1/2 -translate-x-1/2 border-[var(--accent-bright)] bg-paper font-medium whitespace-nowrap text-ink"
              >
                Most popular
              </span>
            {/if}
            <div>
              <h3 class="text-base font-medium text-ink-2">{t.name}</h3>
              <p class="mt-2 text-4xl font-medium tracking-tight">{t.amount}</p>
              <p class="mt-1 min-h-5 text-sm font-medium text-accent">{t.note}</p>
            </div>
            {#if t.intro}<p class="text-[0.9375rem] leading-relaxed text-ink-2">{t.intro}</p>{/if}
            <ul class="flex flex-col gap-2.5 text-[0.9375rem] text-ink-2">
              {#each t.benefits as b (b)}
                <li class="flex gap-2.5">
                  <Check size={18} class="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              {/each}
            </ul>
            <a
              class="btn {t.featured ? 'btn-primary' : 'btn-soft'} mt-auto w-full"
              href={mailto(t.subject)}
              aria-label="{t.cta} by email: {t.amount}"
            >
              {t.cta}
            </a>
          </article>
        {/each}
      </div>
    </section>

    <!-- Why -->
    <section aria-labelledby="why">
      <div class="mb-10 max-w-2xl">
        <p class="eyebrow mb-3">Our purpose</p>
        <h2 id="why" class="text-3xl font-medium text-balance sm:text-4xl">Why your support matters</h2>
        <p class="mt-4 leading-relaxed text-ink-2 text-pretty">
          Holmes AI is an effort to preserve and perpetuate the authentic wisdom of Ernest Holmes through artificial
          intelligence.
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [...reasons, { icon: Sparkles, title: impact[0].title, body: impact[0].body }] as r, i (r.title)}
          {@const Icon = r.icon}
          <article class="rise glass card flex flex-col gap-3" style="animation-delay: {i * 70}ms">
            <span class="grid size-10 place-items-center rounded-full bg-sunken text-accent">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3 class="text-lg font-medium">{r.title}</h3>
            <p class="text-[0.9375rem] leading-relaxed text-ink-2">{r.body}</p>
          </article>
        {/each}
      </div>
      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        {#each impact.slice(1) as i, n (i.title)}
          <article class="rise glass card" style="animation-delay: {n * 70}ms">
            <h3 class="mb-2 text-base font-medium">{i.title}</h3>
            <p class="text-[0.9375rem] leading-relaxed text-ink-2">{i.body}</p>
          </article>
        {/each}
      </div>
    </section>

    <!-- Offers today -->
    <section aria-labelledby="today">
      <h2 id="today" class="mb-6 text-3xl font-medium text-balance sm:text-4xl">What Holmes AI offers today</h2>
      <div class="glass card grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[var(--line)] md:p-0">
        <div class="flex flex-col gap-3 md:p-7">
          <Brain size={22} class="text-accent" aria-hidden="true" />
          <h3 class="text-lg font-medium">Trained on Holmes' works</h3>
          <p class="text-[0.9375rem] leading-relaxed text-ink-2">
            Over 463,000 words from his core texts, including <em>The Science of Mind</em>,
            <em>This Thing Called You</em>, <em>Creative Mind and Success</em>, <em>Words That Heal Today</em>, and
            <em>Living the Science of Mind</em>. Choose between "In His Words" and "Modern" modes.
          </p>
        </div>
        <div class="flex flex-col gap-3 md:p-7">
          <Smartphone size={22} class="text-accent" aria-hidden="true" />
          <h3 class="text-lg font-medium">Built for everyone</h3>
          <p class="text-[0.9375rem] leading-relaxed text-ink-2">
            A responsive, accessible experience with question history and a spiritual mind treatment generator based
            on Ernest Holmes' methodology, for healing, abundance, relationships, and spiritual growth.
          </p>
        </div>
        <div class="flex flex-col gap-3 md:p-7">
          <Lock size={22} class="text-accent" aria-hidden="true" />
          <h3 class="text-lg font-medium">Private by design</h3>
          <p class="text-[0.9375rem] leading-relaxed text-ink-2">
            Anonymous user identification without collecting personal data. Conversations stay private, with no data
            sales or third-party sharing. We are seeking a formal partnership with Centers for Spiritual Living for
            spiritual oversight.
          </p>
        </div>
      </div>
    </section>

    <!-- Roadmap -->
    <section aria-labelledby="roadmap">
      <div class="mb-10 max-w-2xl">
        <p class="eyebrow mb-3">Roadmap</p>
        <h2 id="roadmap" class="text-3xl font-medium text-balance sm:text-4xl">What your support helps build next</h2>
      </div>
      <ol class="timeline flex flex-col gap-6">
        {#each roadmap as phase, i (phase.title)}
          <li class="rise relative pl-12" style="animation-delay: {i * 80}ms">
            <span
              class="absolute top-4 left-0 grid size-9 place-items-center rounded-full border-2 border-[var(--accent-bright)] bg-paper text-sm font-medium text-ink"
              aria-hidden="true"
            >
              {i + 4}
            </span>
            <div class="glass card">
              <h3 class="mb-1 text-lg font-medium">
                <span class="text-ink-2">Phase {i + 4}.</span>
                {phase.title}
              </h3>
              <ul class="mt-3 grid gap-2.5 text-[0.9375rem] text-ink-2 sm:grid-cols-2">
                {#each phase.items as [name, desc] (name)}
                  <li><strong class="font-medium text-ink">{name}</strong>, {desc}</li>
                {/each}
              </ul>
            </div>
          </li>
        {/each}
      </ol>
    </section>

    <!-- Contact -->
    <section aria-labelledby="join" class="rise glass card flex flex-col items-center gap-5 text-center sm:p-12">
      <Handshake size={28} class="text-accent" aria-hidden="true" />
      <h2 id="join" class="text-3xl font-medium text-balance sm:text-4xl">Join our mission</h2>
      <p class="max-w-xl text-lg leading-relaxed text-ink-2 text-pretty">
        Help us preserve and perpetuate Ernest Holmes' wisdom for future generations. Your support ensures that
        authentic spiritual guidance remains accessible to all who seek it.
      </p>
      <a class="text-lg font-medium break-all underline decoration-[var(--accent-bright)] underline-offset-4" href={mailto("Supporting Holmes AI")}>
        {EMAIL}
      </a>
      <div class="flex flex-wrap justify-center gap-3">
        <a class="btn btn-primary" href={mailto("Supporting Holmes AI")}>
          <Mail size={16} aria-hidden="true" /> Email us
        </a>
        <button type="button" class="btn btn-soft" onclick={copyEmail}>
          {#if copied}
            <Check size={16} aria-hidden="true" /> Copied
          {:else}
            <Copy size={16} aria-hidden="true" /> Copy email
          {/if}
        </button>
        <a class="btn btn-ghost" href="/">Try Holmes AI</a>
        <a class="btn btn-ghost" href="/about">Learn more</a>
      </div>
      <span class="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied" : copyFailed ? "Could not copy the email address" : ""}
      </span>
      {#if copyFailed}<p class="text-sm text-danger">Copy failed. Please select the address manually.</p>{/if}
    </section>
  </div>
</main>
