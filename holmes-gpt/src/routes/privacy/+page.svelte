<script lang="ts">
  import Check from "@lucide/svelte/icons/check";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Cookie from "@lucide/svelte/icons/cookie";
  import Mail from "@lucide/svelte/icons/mail";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Phone from "@lucide/svelte/icons/phone";
  import Shield from "@lucide/svelte/icons/shield-check";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import X from "@lucide/svelte/icons/x";

  const updated = "October 16, 2026";

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "collect", label: "Information we collect" },
    { id: "cookies", label: "Cookies and local storage" },
    { id: "use", label: "How we use your information" },
    { id: "ownership", label: "Data ownership" },
    { id: "sharing", label: "Sharing and service providers" },
    { id: "choices", label: "Your choices" },
    { id: "security", label: "Security and retention" },
    { id: "more", label: "Children, international users, changes" },
    { id: "contact", label: "Contact us" },
  ];

  const keep = [
    { icon: Check, text: "Your questions and the answers you receive, so you can find them again" },
    { icon: Check, text: "Your IP address, only for abuse protection and rate limiting" },
    { icon: Check, text: "One strictly necessary cookie that keeps your history private to your browser" },
    { icon: Check, text: "Theme and response style, stored on your device only" },
  ];
  const never = [
    { icon: X, text: "Sell, rent, or trade your personal data" },
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

  const title = "Privacy Policy - Holmes AI | Secure Spiritual Guidance & Data Protection";
  const description =
    "Learn how Holmes AI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed.";
  const keywords =
    "Holmes AI privacy policy, spiritual AI privacy, metaphysical guidance privacy, Ernest Holmes AI data protection, spiritual counseling privacy, AI spiritual advisor privacy, Science of Mind privacy, Religious Science AI privacy, spiritual technology privacy, metaphysical AI data security, Ernest Holmes AI confidentiality, spiritual guidance privacy, AI spiritual teacher privacy, metaphysical counseling privacy, spiritual AI data protection, Ernest Holmes AI security, spiritual technology data privacy, metaphysical wisdom privacy, spiritual AI confidentiality, Ernest Holmes AI privacy protection, spiritual guidance data security, AI spiritual advisor confidentiality, Science of Mind AI privacy, Religious Science technology privacy, spiritual AI ethical data handling, metaphysical AI privacy policy, Ernest Holmes AI data ethics, spiritual technology privacy protection, metaphysical guidance data privacy, spiritual AI privacy security, Ernest Holmes AI confidential spiritual guidance";
  const host = "https://holmes-ai.netdevs.net";
  const url = `${host}/privacy`;
  const image = `${host}/images/holmes-ai-privacy.jpg`;
  const logo = `${host}/images/logo.ico`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy - Holmes AI",
      description: "Learn how Holmes AI protects your privacy and handles your spiritual conversations.",
      url,
      datePublished: "2024-12-19",
      dateModified: "2026-10-16",
      mainEntity: {
        "@type": "Organization",
        name: "Holmes AI",
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
      author: { "@type": "Organization", name: "Holmes AI Team" },
      publisher: {
        "@type": "Organization",
        name: "Holmes AI",
        logo: { "@type": "ImageObject", url: logo },
      },
      datePublished: "2024-12-19",
      dateModified: "2026-10-16",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Holmes AI",
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
  <meta name="author" content="Holmes AI Team" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content="Holmes AI" />

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
      Protecting your sacred conversations. Here is exactly what Holmes AI stores, why, and how you can remove it.
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
        <h2 id="overview" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Your privacy matters</h2>
        <div class="prose-holmes">
          <p>
            At Holmes AI, we understand that spiritual conversations are deeply personal and sacred. We are
            committed to protecting your privacy and ensuring the confidentiality of your interactions with our AI.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, and protect your information when you use Holmes AI.
            By using our service, you agree to the collection and use of information in accordance with this policy.
          </p>
          <p>
            In short: Holmes AI sets one strictly necessary cookie, uses no analytics, advertising trackers or
            third-party cookies, and loads no external fonts or CDN resources.
          </p>
        </div>
      </section>

      <section aria-labelledby="collect">
        <h2 id="collect" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Information we collect</h2>
        <div class="prose-holmes">
          <h3>Conversation data</h3>
          <p>
            When you ask a question, we save the following on our server so that you can find it again in your
            history:
          </p>
          <ul>
            <li>Your spiritual question or concern</li>
            <li>The answer generated by Holmes AI</li>
            <li>A topic category assigned automatically to the question</li>
            <li>The date and time of the exchange</li>
          </ul>
          <p>
            Questions you bookmark under &ldquo;Saved&rdquo; in the History panel are stored the same way, and are
            removed when you delete the question.
          </p>
          <h3>Technical information</h3>
          <p>With each question we also record:</p>
          <ul>
            <li>Your IP address, used to detect abuse and to apply rate limits</li>
            <li>Your browser's user-agent string (browser type, version and operating system)</li>
          </ul>
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
            Holmes AI sets a single strictly necessary, first-party cookie named <code>holmes_sid</code>. It holds
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

      <section aria-labelledby="use">
        <h2 id="use" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">How we use your information</h2>
        <div class="prose-holmes">
          <h3>Providing our services</h3>
          <ul>
            <li>Generate spiritual guidance in response to your questions</li>
            <li>Keep your question history available to you</li>
            <li>Ensure the authenticity of Ernest Holmes' voice</li>
          </ul>
          <h3>Improving our services</h3>
          <p>We use the questions and answers we store, and aggregated information derived from them, to:</p>
          <ul>
            <li>Improve AI response quality and accuracy</li>
            <li>Develop new features and capabilities</li>
            <li>Identify and fix technical issues</li>
            <li>Enhance user experience and accessibility</li>
          </ul>
          <h3>Security and compliance</h3>
          <ul>
            <li>Protect against fraud and abuse, including rate limiting by IP address</li>
            <li>Ensure compliance with legal obligations</li>
            <li>Maintain the security of our platform</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="ownership">
        <h2 id="ownership" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Data ownership</h2>
        <div class="glass card sm:p-6">
          <div class="mb-3 flex items-center gap-2 text-accent">
            <Shield size={20} aria-hidden="true" />
            <h3 class="font-medium text-ink">Centers for Spiritual Living (CSL) rights</h3>
          </div>
          <div class="prose-holmes">
            <p>
              <strong>All data collected through Holmes AI is owned by Centers for Spiritual Living (CSL).</strong>
              This includes, but is not limited to, the questions asked by users, the AI-generated responses, and
              the related records described in this policy.
            </p>
            <p>CSL uses this data for:</p>
            <ul>
              <li>Improving the authenticity and accuracy of Holmes AI</li>
              <li>Research and development of spiritual AI technology</li>
              <li>Understanding user needs and spiritual questions</li>
              <li>Maintaining and enhancing the platform</li>
              <li>Educational and training purposes</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="sharing">
        <h2 id="sharing" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Sharing and service providers</h2>
        <div class="prose-holmes">
          <p>
            <strong>Holmes AI will never sell, rent, or trade your personal data to third parties.</strong>
          </p>
          <h3>AI processing</h3>
          <p>
            To generate an answer, your question is sent to Anthropic's Claude API. Anthropic processes it as our
            service provider in order to return a response.
          </p>
          <h3>Limited data sharing</h3>
          <p>We may share your data only in the following circumstances:</p>
          <ul>
            <li>With Centers for Spiritual Living (CSL) for service improvement</li>
            <li>With trusted service providers who assist in operating our platform, such as Anthropic as described above</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>With your explicit consent for specific purposes</li>
          </ul>
          <p>Service providers may only use your data to provide services to us.</p>
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
            is composed in your own email app (a <code>mailto:</code> link); Holmes AI does not send it.
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

      <section aria-labelledby="security">
        <h2 id="security" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Security and retention</h2>
        <div class="prose-holmes">
          <h3>Security measures</h3>
          <p>We use industry-standard measures to protect your data:</p>
          <ul>
            <li>Encrypted connections (HTTPS) for communications with the site</li>
            <li>Secure data storage with access controls</li>
            <li>Regular security updates</li>
          </ul>
          <h3>Data retention</h3>
          <p>
            We retain saved data for as long as necessary to provide our services to you, comply with legal
            obligations, improve our AI systems, and maintain the integrity of Ernest Holmes' teachings, unless you
            delete it as described above.
          </p>
        </div>
      </section>

      <section aria-labelledby="more">
        <h2 id="more" class="mb-4 scroll-mt-28 text-2xl font-medium text-ink">Children, international users, changes</h2>
        <div class="flex flex-col gap-3">
          {#each [
            { t: "Children's privacy", p: "Holmes AI is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately." },
            { t: "International users", p: "Holmes AI is operated from the United States. If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located." },
            { t: "Policy changes", p: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date." },
          ] as item}
            <details class="glass card group">
              <summary class="flex min-h-9 cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink">
                {item.t}
                <ChevronDown size={18} class="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p class="prose-holmes mt-3">{item.p}</p>
            </details>
          {/each}
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
            <a href="mailto:privacy@holmesai.org" class="break-words text-ink-2 underline underline-offset-4 hover:text-ink">privacy@holmesai.org</a>
          </div>
          <div class="glass card flex flex-col gap-2">
            <Phone size={20} class="text-accent" aria-hidden="true" />
            <h3 class="font-medium text-ink">Phone</h3>
            <a href="tel:+17204961370" class="text-ink-2 underline underline-offset-4 hover:text-ink">(720) 496-1370</a>
          </div>
          <div class="glass card flex flex-col gap-2">
            <MapPin size={20} class="text-accent" aria-hidden="true" />
            <h3 class="font-medium text-ink">Address</h3>
            <p class="text-ink-2">Centers for Spiritual Living<br />573 Park Point Drive<br />Golden, CO 80401</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</main>
