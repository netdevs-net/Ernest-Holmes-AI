<script lang="ts">
  import Check from "@lucide/svelte/icons/check";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Cookie from "@lucide/svelte/icons/cookie";
  import Mail from "@lucide/svelte/icons/mail";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Phone from "@lucide/svelte/icons/phone";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import X from "@lucide/svelte/icons/x";

  const updated = "October 16, 2026";

  const sections = [
    { id: "overview", label: "Your privacy, simply" },
    { id: "collect", label: "What is stored" },
    { id: "cookies", label: "Cookies and local storage" },
    { id: "sharing", label: "Who processes your questions" },
    { id: "choices", label: "Your choices" },
    { id: "contact", label: "Contact us" },
  ];

  const keep = [
    { icon: Check, text: "Your questions and the answers you receive, so you can find them again" },
    { icon: Check, text: "Your IP address, only for abuse protection and rate limiting" },
    { icon: Check, text: "One strictly necessary cookie that keeps your history private to your browser" },
    { icon: Check, text: "Theme and response style, stored on your device only" },
  ];
  const never = [
    { icon: X, text: "Sell your data, or share it beyond the AI provider that writes your answers" },
    { icon: X, text: "Use third-party trackers, advertising cookies, or analytics" },
    { icon: X, text: "Fingerprint your browser or collect device identifiers" },
    { icon: X, text: "Load external fonts or CDN resources" },
  ];

  let active = $state("");

  $effect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = e.target.id;
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  const title = "Privacy Policy - HolmesAI | Secure Spiritual Guidance & Data Protection";
  const description =
    "Learn how HolmesAI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed.";
  const keywords =
    "HolmesAI privacy policy, spiritual AI privacy, metaphysical guidance privacy, Ernest HolmesAI data protection, spiritual counseling privacy, AI spiritual advisor privacy, Science of Mind privacy, Religious Science AI privacy, spiritual technology privacy, metaphysical AI data security, Ernest HolmesAI confidentiality, spiritual guidance privacy, AI spiritual teacher privacy, metaphysical counseling privacy, spiritual AI data protection, Ernest HolmesAI security, spiritual technology data privacy, metaphysical wisdom privacy, spiritual AI confidentiality, Ernest HolmesAI privacy protection, spiritual guidance data security, AI spiritual advisor confidentiality, Science of Mind AI privacy, Religious Science technology privacy, spiritual AI ethical data handling, metaphysical AI privacy policy, Ernest HolmesAI data ethics, spiritual technology privacy protection, metaphysical guidance data privacy, spiritual AI privacy security, Ernest HolmesAI confidential spiritual guidance";
  const host = "https://holmes-ai.netdevs.net";
  const url = `${host}/privacy`;
  const image = `${host}/images/holmes-ai-privacy.jpg`;
  const logo = `${host}/images/logo.ico`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy - HolmesAI",
      description: "Learn how HolmesAI protects your privacy and handles your spiritual conversations.",
      url,
      datePublished: "2024-12-19",
      dateModified: "2026-10-16",
      mainEntity: {
        "@type": "Organization",
        name: "HolmesAI",
        description: "Preserving Ernest Holmes' wisdom through AI technology",
        privacyPolicy: url,
      },
      about: {
        "@type": "Thing",
        name: "Data Privacy",
        description: "Privacy protection for spiritual guidance and metaphysical counseling",
      },
      keywords,
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image,
      author: { "@type": "Organization", name: "HolmesAI Team" },
      publisher: {
        "@type": "Organization",
        name: "HolmesAI",
        logo: { "@type": "ImageObject", url: logo },
      },
      datePublished: "2024-12-19",
      dateModified: "2026-10-16",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HolmesAI",
      description: "Preserving Ernest Holmes' spiritual wisdom through cutting-edge AI technology",
      url: host,
      logo,
      foundingDate: "2024",
      mission: "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through AI technology",
      sameAs: [
        "https://twitter.com/holmesai",
        "https://facebook.com/holmesai",
        "https://linkedin.com/company/holmesai",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "support@holmes-ai.netdevs.net",
        availableLanguage: "English",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Privacy-Focused Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Secure Spiritual Guidance",
              description: "Privacy-protected spiritual counseling and metaphysical wisdom",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Confidential AI Counseling",
              description: "Secure and private AI-powered spiritual guidance",
            },
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: host },
        { "@type": "ListItem", position: 2, name: "Privacy", item: url },
      ],
    },
  ];

  // Escape "<" so the JSON can never close the script tag early.
  const ldScripts = ld.map((o) => JSON.stringify(o).replace(/</g, "\\u003c"));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content="HolmesAI Team" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content="HolmesAI" />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />

  <link rel="canonical" href={url} />

  {#each ldScripts as json}
    <svelte:element this={"script"} type="application/ld+json">{json}</svelte:element>
  {/each}
</svelte:head>

{#snippet toc()}
  <ol class="flex flex-col gap-0.5 text-sm">
    {#each sections as s, i}
      <li>
        <a
          href="#{s.id}"
          aria-current={active === s.id ? "location" : undefined}
          class="flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 transition-colors hover:bg-sunken hover:text-ink {active === s.id ? 'bg-sunken font-medium text-ink' : 'text-ink-2'}"
        >
          <span class="w-4 shrink-0 text-ink-3 tabular-nums">{i + 1}</span>
          <span>{s.label}</span>
        </a>
      </li>
    {/each}
  </ol>
{/snippet}

<main class="mx-auto w-full max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
  <header class="rise mx-auto max-w-3xl text-center">
    <p class="eyebrow mb-4">Data protection</p>
    <h1 class="text-display font-medium text-balance">Privacy Policy</h1>
    <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2 text-pretty">
      We keep this simple. We never ask for your name, email, or an account, and we only use your questions to improve the quality of the system.
    </p>
    <p class="glass mt-6 inline-flex items-center rounded-full px-4 py-1.5 text-sm text-ink-2">
      Last updated <time datetime="2026-10-16" class="ml-1 font-medium text-ink">{updated}</time>
    </p>
  </header>

  <section aria-labelledby="glance" class="rise mt-14 sm:mt-20">
    <h2 id="glance" class="eyebrow mb-5 text-center">At a glance</h2>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="glass card sm:p-6">
        <h3 class="mb-4 text-xl font-medium text-ink">What we keep</h3>
        <ul class="flex flex-col gap-3">
          {#each keep as item}
            <li class="flex gap-3 text-ink-2">
              <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sunken text-accent">
                <item.icon size={14} aria-hidden="true" />
              </span>
              <span>{item.text}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="glass card sm:p-6">
        <h3 class="mb-4 text-xl font-medium text-ink">What we never do</h3>
        <ul class="flex flex-col gap-3">
          {#each never as item}
            <li class="flex gap-3 text-ink-2">
              <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sunken text-danger">
                <item.icon size={14} aria-hidden="true" />
              </span>
              <span>{item.text}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <div class="mt-16 grid gap-8 sm:mt-24 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
    <aside>
      <details class="glass card lg:hidden">
        <summary class="flex min-h-9 cursor-pointer list-none items-center justify-between font-medium text-ink">
          On this page <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <nav aria-label="On this page" class="mt-3">{@render toc()}</nav>
      </details>
      <nav aria-label="On this page" class="sticky top-28 hidden lg:block">
        <p class="eyebrow mb-3 px-3">On this page</p>
        {@render toc()}
      </nav>
    </aside>

    <div class="flex min-w-0 flex-col gap-12 sm:gap-14">
      <section aria-labelledby="overview">
        <h2 id="overview" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Your privacy, simply</h2>
        <div class="prose-holmes">
          <p>We never sell your data. We only use it to improve the quality of the system.</p>
          <ul>
            <li>We do not ask for your name, email address, or an account.</li>
            <li>Only the questions you ask, and the answers you receive, are stored.</li>
            <li>Only authorized people can view the stored questions.</li>
            <li>HolmesAI is not intended for children under 13, and we do not knowingly collect information from them.</li>
          </ul>
          <p>
            HolmesAI sets one strictly necessary cookie, uses no analytics, advertising trackers or third-party
            cookies, and loads no external fonts or CDN resources.
          </p>
        </div>
      </section>

      <section aria-labelledby="collect">
        <h2 id="collect" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">What is stored</h2>
        <div class="prose-holmes">
          <p>
            When you ask a question, we save the following on our server so that you can find it again in your
            history:
          </p>
          <ul>
            <li>Your question and the answer generated by HolmesAI</li>
            <li>A topic category assigned automatically to the question</li>
            <li>The date and time of the exchange</li>
            <li>Your IP address, used to detect abuse and to apply rate limits</li>
            <li>Your browser's user-agent string (browser type, version and operating system)</li>
          </ul>
          <p>
            Questions you bookmark under &ldquo;Saved&rdquo; in the History panel are stored the same way, and are
            removed when you delete the question.
          </p>
          <p>
            We do not generate or collect browser fingerprints or device identifiers. If you use the
            &ldquo;Share by email&rdquo; feature, additional information is logged, as described in
            <a href="#choices">your choices</a>.
          </p>
        </div>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Cookies and local storage</h2>
        <div class="prose-holmes">
          <h3>One first-party cookie</h3>
          <p>
            HolmesAI sets a single strictly necessary, first-party cookie named <code>holmes_sid</code>. It holds
            a random identifier, is marked httpOnly (so page scripts cannot read it), and lasts one year. Its only
            purpose is to keep your saved questions private to your browser. It does not identify you by name.
          </p>
          <p>
            We do not use third-party cookies, analytics, or advertising trackers, and we make no external font or
            CDN requests. Fonts are self-hosted.
          </p>
          <h3>Local storage on your device</h3>
          <p>
            Your browser's local storage keeps only your preferences: your theme (<code>holmes:theme</code>) and
            your response style (<code>holmes:style</code>, for example Modern or In His Words). This stays on your
            device and is not sent to us.
          </p>
        </div>
      </section>

      <section aria-labelledby="sharing">
        <h2 id="sharing" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Who processes your questions</h2>
        <div class="prose-holmes">
          <p><strong>HolmesAI will never sell your data.</strong></p>
          <p>
            To generate an answer, your question is sent to Anthropic's Claude API. Anthropic processes it as our
            service provider in order to return a response. We do not otherwise share your data, except when
            required by law or with your explicit consent.
          </p>
        </div>
      </section>

      <section aria-labelledby="choices">
        <h2 id="choices" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Your choices</h2>
        <div class="prose-holmes">
          <h3>Delete your saved questions</h3>
          <p>
            You can delete any saved question yourself from the History panel (&ldquo;Your questions&rdquo;).
            Deleting a question removes the question and its answer from our server, including any bookmark on it.
          </p>
          <h3>Share by email</h3>
          <p>
            If you use &ldquo;Share by email&rdquo;, the recipient's email address and the text you share are
            logged on our server together with your IP address, and the feature is rate-limited. The email itself
            is composed in your own email app (a <code>mailto:</code> link); HolmesAI does not send it.
          </p>
          <h3>Cookies and preferences</h3>
          <p>
            You can clear the <code>holmes_sid</code> cookie and your local storage at any time in your browser
            settings. Clearing the cookie means you will no longer be able to see your earlier saved questions from
            that browser.
          </p>
        </div>

        <div class="glass card mt-8 sm:p-6">
          <h3 class="mb-4 text-xl font-medium text-ink">Your controls</h3>
          <ul class="grid gap-4 sm:grid-cols-3">
            <li class="flex flex-col gap-2">
              <Trash2 size={20} class="text-accent" aria-hidden="true" />
              <p class="font-medium text-ink">Delete questions</p>
              <p class="text-sm text-ink-2">Open History and remove any question. It is deleted from our server.</p>
            </li>
            <li class="flex flex-col gap-2">
              <Cookie size={20} class="text-accent" aria-hidden="true" />
              <p class="font-medium text-ink">Clear cookies</p>
              <p class="text-sm text-ink-2">Remove <code>holmes_sid</code> and local storage in your browser settings.</p>
            </li>
            <li class="flex flex-col gap-2">
              <Mail size={20} class="text-accent" aria-hidden="true" />
              <p class="font-medium text-ink">Contact us</p>
              <p class="text-sm text-ink-2">Ask a question about your data. See <a href="#contact" class="underline underline-offset-4 hover:text-ink">contact details</a>.</p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Contact us</h2>
        <p class="prose-holmes mb-5">
          If you have any questions about this Privacy Policy or our data practices, please contact us.
        </p>
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="glass card flex flex-col gap-2">
            <Mail size={20} class="text-accent" aria-hidden="true" />
            <h3 class="font-medium text-ink">Email</h3>
            <a href="mailto:ryan@webdevs.net" class="break-words text-ink-2 underline underline-offset-4 hover:text-ink">ryan@webdevs.net</a>
          </div>
          <div class="glass card flex flex-col gap-2">
            <Phone size={20} class="text-accent" aria-hidden="true" />
            <h3 class="font-medium text-ink">Phone</h3>
            <a href="tel:+13105405080" class="text-ink-2 underline underline-offset-4 hover:text-ink">(310) 540-5080</a>
          </div>
          <div class="glass card flex flex-col gap-2">
            <MapPin size={20} class="text-accent" aria-hidden="true" />
            <h3 class="font-medium text-ink">Address</h3>
            <p class="text-ink-2">Redondo Beach Center for Spiritual Living<br />907 Knob Hill Ave<br />Redondo Beach, CA 90277</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</main>
