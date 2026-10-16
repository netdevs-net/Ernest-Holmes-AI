<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import Globe from "@lucide/svelte/icons/globe";
  import User from "@lucide/svelte/icons/user";
  import Briefcase from "@lucide/svelte/icons/briefcase";
  import Mail from "@lucide/svelte/icons/mail";
  import Phone from "@lucide/svelte/icons/phone";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import MessageSquare from "@lucide/svelte/icons/message-square";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Quote from "@lucide/svelte/icons/quote";
  import Clock from "@lucide/svelte/icons/clock";
  import Share2 from "@lucide/svelte/icons/share-2";

  const links = [
    { href: "https://NetDevs.net", label: "NetDevs.net", Icon: Globe },
    { href: "https://ryan-iguchi.com", label: "ryan-iguchi.com", Icon: User },
    { href: "https://www.linkedin.com/in/ryaniguchi/", label: "LinkedIn", Icon: Briefcase }
  ];

  const features = [
    { Icon: MessageSquare, title: "Ask in your own words", text: "Bring any question about the Science of Mind and receive guidance grounded in Ernest Holmes' teachings." },
    { Icon: Sparkles, title: "Two response styles", text: "Choose Modern for warm, contemporary language, or His words for the voice of Ernest Holmes himself." },
    { Icon: BookOpen, title: "Mind treatments", text: "Receive a five-part spiritual treatment in the Science of Mind form." },
    { Icon: Quote, title: "Words from Ernest Holmes", text: "Browse quotations from Holmes to reflect on and carry through your day." },
    { Icon: Clock, title: "Saved history", text: "Your questions are saved on this browser session so you can return to them." },
    { Icon: Share2, title: "Share by email", text: "Send an answer that moved you to someone who could use it." }
  ];
</script>

<svelte:head>
  <title>About Holmes AI - Ernest Holmes' Legacy in AI Technology | Spiritual Innovation</title>
  <meta name="description" content="Discover how Holmes AI preserves Ernest Holmes' spiritual wisdom through cutting-edge AI technology. Learn about our mission to make Science of Mind teachings accessible worldwide." />
  <meta name="keywords" content="Ernest Holmes, Science of Mind, Religious Science, spiritual AI, Ernest Holmes teachings, spiritual guidance, Holmes AI" />
  <meta name="author" content="Holmes AI Team" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://holmes-ai.netdevs.net/about" />
  <meta property="og:title" content="About Holmes AI - Ernest Holmes' Legacy in AI Technology | Spiritual Innovation" />
  <meta property="og:description" content="Discover how Holmes AI preserves Ernest Holmes' spiritual wisdom through cutting-edge AI technology. Learn about our mission to make Science of Mind teachings accessible worldwide." />
  <meta property="og:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-about.jpg" />
  <meta property="og:site_name" content="Holmes AI" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://holmes-ai.netdevs.net/about" />
  <meta property="twitter:title" content="About Holmes AI - Ernest Holmes' Legacy in AI Technology | Spiritual Innovation" />
  <meta property="twitter:description" content="Discover how Holmes AI preserves Ernest Holmes' spiritual wisdom through cutting-edge AI technology. Learn about our mission to make Science of Mind teachings accessible worldwide." />
  <meta property="twitter:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-about.jpg" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://holmes-ai.netdevs.net/about" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "About Holmes AI",
    "description": "Discover how Holmes AI preserves Ernest Holmes' spiritual wisdom through cutting-edge AI technology.",
    "url": "https://holmes-ai.netdevs.net/about",
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19",
    "mainEntity": {
      "@type": "Organization",
      "name": "Holmes AI",
      "description": "Preserving Ernest Holmes' wisdom through AI technology",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "Ernest Holmes",
        "description": "Founder of Religious Science and author of The Science of Mind"
      },
      "mission": "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through cutting-edge AI technology"
    },
    "about": {
      "@type": "Thing",
      "name": "Spiritual Technology",
      "description": "AI-powered spiritual guidance based on Ernest Holmes' teachings"
    },
    "keywords": "Ernest Holmes, Science of Mind, Religious Science, spiritual AI, Ernest Holmes teachings, spiritual guidance, Holmes AI"
  }
  </script>

  <!-- Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "About Holmes AI - Ernest Holmes' Legacy in AI Technology",
    "description": "Discover how Holmes AI preserves Ernest Holmes' spiritual wisdom through cutting-edge AI technology. Learn about our mission to make Science of Mind teachings accessible worldwide.",
    "image": "https://holmes-ai.netdevs.net/images/holmes-ai-about.jpg",
    "author": {
      "@type": "Organization",
      "name": "Holmes AI Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Holmes AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://holmes-ai.netdevs.net/images/logo.ico"
      }
    },
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://holmes-ai.netdevs.net/about"
    }
  }
  </script>

  <!-- Organization Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Holmes AI",
    "description": "Preserving Ernest Holmes' spiritual wisdom through cutting-edge AI technology",
    "url": "https://holmes-ai.netdevs.net",
    "logo": "https://holmes-ai.netdevs.net/images/logo.ico",
    "foundingDate": "2024",
    "mission": "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through AI technology",
    "sameAs": [
      "https://twitter.com/holmesai",
      "https://facebook.com/holmesai",
      "https://linkedin.com/company/holmesai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@holmes-ai.netdevs.net",
      "availableLanguage": "English"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Spiritual AI Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Spiritual Guidance",
            "description": "Personalized spiritual counseling based on Ernest Holmes' teachings"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Metaphysical Wisdom",
            "description": "Access to Ernest Holmes' metaphysical philosophy through AI"
          }
        }
      ]
    }
  }
  </script>

  <!-- Breadcrumb Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://holmes-ai.netdevs.net"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": "https://holmes-ai.netdevs.net/about"
      }
    ]
  }
  </script>
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16">
  <!-- Hero -->
  <section class="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]" aria-labelledby="about-heading">
    <div class="rise">
      <p class="eyebrow mb-4">Spiritual Technology</p>
      <h1 id="about-heading" class="text-display font-medium text-balance">
        Preserving Ernest Holmes' timeless wisdom for the digital age.
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-2 text-pretty">
        Holmes AI was born from a deep reverence for Ernest Holmes' teachings and a vision to make his
        timeless wisdom accessible to spiritual seekers worldwide.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="/" class="btn btn-primary">Ask Holmes <ArrowRight size={16} aria-hidden="true" /></a>
        <a href="/support" class="btn btn-soft">Support Holmes AI</a>
      </div>
    </div>
    <div class="rise relative mx-auto grid aspect-square w-56 place-items-center sm:w-72" style="animation-delay: 120ms">
      <div class="glow" aria-hidden="true"></div>
      <div class="glass relative grid size-full place-items-center rounded-full border border-line">
        <Logo size={120} priority alt="Holmes AI logo" />
      </div>
    </div>
  </section>

  <!-- Who was Ernest Holmes -->
  <section class="mt-20 sm:mt-28" aria-labelledby="holmes-heading">
    <p class="eyebrow mb-3">Our Purpose</p>
    <h2 id="holmes-heading" class="sr-only">Who was Ernest Holmes</h2>
    <div class="rise grid gap-8 md:grid-cols-2 md:gap-14" style="animation-delay: 60ms">
      <p class="text-3xl leading-tight font-medium text-balance sm:text-4xl">
        Practical spiritual wisdom that transcends time and culture.
      </p>
      <div class="flex flex-col gap-5 text-lg leading-relaxed text-ink-2">
        <p>
          Ernest Holmes (1887-1960) was a spiritual teacher, writer, and the founder of Religious Science,
          now known as Centers for Spiritual Living. His teachings have touched millions of lives, offering
          practical spiritual wisdom that transcends time and culture.
        </p>
        <p>
          Our mission is to preserve and perpetuate Holmes' authentic voice and teachings through cutting-edge
          AI technology, ensuring that future generations can access his wisdom in a way that feels personal,
          immediate, and transformative.
        </p>
      </div>
    </div>
  </section>

  <!-- What it does -->
  <section class="mt-20 sm:mt-28" aria-labelledby="does-heading">
    <p class="eyebrow mb-3">What Holmes AI does</p>
    <h2 id="does-heading" class="text-3xl font-medium text-balance sm:text-4xl">Guidance, in a form that fits you.</h2>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each features as { Icon, title, text }, i (title)}
        <li class="card glass rise p-6" style="animation-delay: {i * 70}ms">
          <span class="grid size-10 place-items-center rounded-full bg-sunken text-accent">
            <Icon size={20} aria-hidden="true" />
          </span>
          <h3 class="mt-4 text-lg font-medium">{title}</h3>
          <p class="mt-2 leading-relaxed text-ink-2">{text}</p>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Team -->
  <section class="mt-20 sm:mt-28" aria-labelledby="team-heading">
    <p class="eyebrow mb-3">Meet the Team</p>
    <h2 id="team-heading" class="text-3xl font-medium text-balance sm:text-4xl">Our Team</h2>
    <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2 text-pretty">
      Holmes AI is developed by a dedicated team of spiritual practitioners, AI researchers, and technology
      experts who share a deep commitment to preserving Ernest Holmes' legacy.
    </p>

    <article class="card glass rise mt-8 p-5 sm:p-10">
      <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <img
          src="/images/Ryan-streetsmart.jpg"
          alt="Ryan Iguchi, Founder and Lead Developer of Holmes AI"
          width="514"
          height="400"
          loading="lazy"
          class="h-32 w-40 rounded-card border border-line object-cover"
        />
        <div>
          <h3 class="text-3xl font-medium">Ryan Iguchi</h3>
          <p class="mt-1 text-lg text-ink-2">Founder &amp; Lead Developer</p>
        </div>
      </div>

      <div class="mt-8 grid gap-6 leading-relaxed text-ink-2 md:grid-cols-2 md:gap-10">
        <div class="flex flex-col gap-4">
          <p>
            Ryan is a passionate technologist and spiritual seeker with 10+ years of experience in programming,
            agile project management, and the last 3 years specializing in DevOps and cybersecurity. As a Programmer
            Analyst with strategic focus on reliability engineering, application hardening, observability, and
            optimizing CI/CD pipelines, Ryan brings deep expertise in AI-integrated infrastructure, natural language
            command processing, and prompt-to-action reinforcement learning systems.
          </p>
          <p>
            Ryan has proven success in building LLM-driven automation pipelines, optimizing simulation workflows
            with AI agents, and integrating AI into cloud-native security and DevOps operations. Both CKAD and
            CompTIA Security+ certified, Ryan is known for leadership in mission-critical projects and
            award-winning performance in CTFs and AI competitions.
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <p>
            Ryan dedicated months to studying Ernest Holmes' teachings and developing the AI systems that bring
            his wisdom to life. With expertise in AI, web development, and spiritual technology, Ryan created
            Holmes AI to make authentic spiritual guidance accessible to everyone.
          </p>
          <p>
            Have a project in mind? A collaboration proposal? Or do you just want to get in touch?
          </p>
        </div>
      </div>

      <div class="mt-8 rounded-card border border-line bg-sunken p-5 sm:p-6">
        <div class="flex items-center gap-2 text-ink">
          <Mail size={18} aria-hidden="true" />
          <h4 class="font-medium">I'm available for new projects</h4>
        </div>
        <p class="mt-3 text-ink-2">
          You can reach out to me via email, at
          <a href="mailto:ryan@webdevs.net" class="text-accent underline underline-offset-2">ryan@webdevs.net</a>,
          or by phone at
          <a href="tel:+17207729972" class="text-accent underline underline-offset-2">(720) 772-9972</a>.
        </p>
        <ul class="mt-5 flex flex-wrap gap-2">
          <li>
            <a href="mailto:ryan@webdevs.net" class="btn btn-primary btn-sm">
              <Mail size={16} aria-hidden="true" /> Click here to send me a message
            </a>
          </li>
          <li>
            <a href="tel:+17207729972" class="btn btn-soft btn-sm">
              <Phone size={16} aria-hidden="true" /> (720) 772-9972
            </a>
          </li>
          {#each links as { href, label, Icon } (href)}
            <li>
              <a
                {href}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-soft btn-sm"
                aria-label="Visit {label} (opens in new tab)"
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </article>

    <!-- Special thanks -->
    <article class="card glass rise mt-6 flex flex-col gap-6 p-5 sm:flex-row sm:p-10" style="animation-delay: 80ms" aria-labelledby="thanks-heading">
      <img
        src="/images/linda-short-hair-trans-webp.webp"
        alt="Linda Gauthier, Generous Supporter and Spiritual Practitioner"
        width="400"
        height="533"
        loading="lazy"
        class="h-auto w-40 shrink-0 self-start rounded-card"
      />
      <div>
        <p class="eyebrow mb-2">Special Thanks</p>
        <h3 id="thanks-heading" class="text-2xl font-medium">Sponsored by Linda Gauthier</h3>
        <p class="mt-1 text-ink-2">Generous Supporter &amp; Spiritual Practitioner</p>
        <div class="mt-5 flex flex-col gap-4 leading-relaxed text-ink-2">
          <p>
            Thank you, Linda, for your generous sponsorship and support of Holmes AI. Your extraordinary
            healing gifts and boundless compassion for all beings have been a guiding light in bringing
            this project to life. Through your spiritual healing practice, you've touched countless lives
            with your wisdom, empathy, and deep understanding of the human spirit.
          </p>
          <p>
            Your commitment to making spiritual wisdom accessible to everyone, regardless of their
            background or circumstances, perfectly aligns with our mission at Holmes AI. Your dedication
            to healing, your intuitive understanding of human suffering, and your unwavering belief in
            the power of spiritual transformation inspire us all to serve with greater compassion and love.
          </p>
        </div>
        <p class="mt-6">
          <a
            href="https://OceanHealing.health"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-soft btn-sm"
            aria-label="Visit OceanHealing.health (opens in new tab)"
          >
            <Globe size={16} aria-hidden="true" />
            OceanHealing.health
          </a>
        </p>
      </div>
    </article>
  </section>

  <!-- CTA -->
  <section class="card glass rise relative mt-20 overflow-hidden p-8 text-center sm:mt-28 sm:p-14" aria-labelledby="cta-heading">
    <p class="eyebrow mb-3">Get Started</p>
    <h2 id="cta-heading" class="text-display font-medium text-balance">Experience Holmes AI</h2>
    <p class="mx-auto mt-4 max-w-xl text-lg text-ink-2 text-pretty">
      Ready to experience authentic spiritual guidance from Ernest Holmes?
      Start your journey with Holmes AI today.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/" class="btn btn-primary">Start Chatting</a>
      <a href="/support" class="btn btn-soft">Support Us</a>
    </div>
  </section>
</main>

<style>
  .glow {
    position: absolute;
    inset: -25%;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--accent-bright) 35%, transparent) 0%,
      color-mix(in srgb, var(--accent-bright) 10%, transparent) 45%,
      transparent 70%
    );
    pointer-events: none;
  }
</style>
