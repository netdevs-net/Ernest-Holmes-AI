<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Header from '$lib/components/Header.svelte';
  import { Shield, Lock, Users, Globe, Mail, Phone, MapPin } from '@lucide/svelte';

  const heroStats = [
    { Icon: Shield, label: 'Secure' },
    { Icon: Lock, label: 'Private' },
    { Icon: Users, label: 'Trusted' }
  ];
  let heroStatIndex = 0;
  /** @type {ReturnType<typeof setInterval>} */
  let heroStatTimer;

  onMount(() => {
    heroStatTimer = setInterval(() => {
      heroStatIndex = (heroStatIndex + 1) % heroStats.length;
    }, 2600);
  });

  onDestroy(() => {
    clearInterval(heroStatTimer);
  });
</script>

<svelte:head>
  <title>Privacy Policy - HolmesAI | Secure Spiritual Guidance & Data Protection</title>
  <meta name="description" content="Learn how HolmesAI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed." />
  <meta name="keywords" content="HolmesAI privacy policy, spiritual AI privacy, metaphysical guidance privacy, Ernest Holmes AI data protection, spiritual counseling privacy, AI spiritual advisor privacy, Science of Mind privacy, Religious Science AI privacy, spiritual technology privacy, metaphysical AI data security, Ernest Holmes AI confidentiality, spiritual guidance privacy, AI spiritual teacher privacy, metaphysical counseling privacy, spiritual AI data protection, Ernest Holmes AI security, spiritual technology data privacy, metaphysical wisdom privacy, spiritual AI confidentiality, Ernest Holmes AI privacy protection, spiritual guidance data security, AI spiritual advisor confidentiality, Science of Mind AI privacy, Religious Science technology privacy, spiritual AI ethical data handling, metaphysical AI privacy policy, Ernest Holmes AI data ethics, spiritual technology privacy protection, metaphysical guidance data privacy, spiritual AI privacy security, Ernest Holmes AI confidential spiritual guidance" />
  <meta name="author" content="HolmesAI Team" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="English" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta charset="utf-8" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  	<meta property="og:url" content="https://holmes-ai.netdevs.net/privacy" />
  <meta property="og:title" content="Privacy Policy - HolmesAI | Secure Spiritual Guidance & Data Protection" />
  <meta property="og:description" content="Learn how HolmesAI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed." />
  	<meta property="og:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-privacy.jpg" />
  <meta property="og:site_name" content="HolmesAI" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  	<meta property="twitter:url" content="https://holmes-ai.netdevs.net/privacy" />
  <meta property="twitter:title" content="Privacy Policy - HolmesAI | Secure Spiritual Guidance & Data Protection" />
  <meta property="twitter:description" content="Learn how HolmesAI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed." />
  	<meta property="twitter:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-privacy.jpg" />
  
  <!-- Canonical URL -->
  	<link rel="canonical" href="https://holmes-ai.netdevs.net/privacy" />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - HolmesAI",
    "description": "Learn how HolmesAI protects your privacy and handles your spiritual conversations.",
    		"url": "https://holmes-ai.netdevs.net/privacy",
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19",
    "mainEntity": {
      "@type": "Organization",
      "name": "HolmesAI",
      "description": "Preserving Ernest Holmes' wisdom through AI technology",
      		"privacyPolicy": "https://holmes-ai.netdevs.net/privacy"
    },
    "about": {
      "@type": "Thing",
      "name": "Data Privacy",
      "description": "Privacy protection for spiritual guidance and metaphysical counseling"
    },
    "keywords": "HolmesAI privacy policy, spiritual AI privacy, metaphysical guidance privacy, Ernest Holmes AI data protection, spiritual counseling privacy, AI spiritual advisor privacy, Science of Mind privacy, Religious Science AI privacy, spiritual technology privacy, metaphysical AI data security, Ernest Holmes AI confidentiality, spiritual guidance privacy, AI spiritual teacher privacy, metaphysical counseling privacy, spiritual AI data protection, Ernest Holmes AI security, spiritual technology data privacy, metaphysical wisdom privacy, spiritual AI confidentiality, Ernest Holmes AI privacy protection, spiritual guidance data security, AI spiritual advisor confidentiality, Science of Mind AI privacy, Religious Science technology privacy, spiritual AI ethical data handling, metaphysical AI privacy policy, Ernest Holmes AI data ethics, spiritual technology privacy protection, metaphysical guidance data privacy, spiritual AI privacy security, Ernest Holmes AI confidential spiritual guidance"
  }
  </script>

  <!-- Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Privacy Policy - HolmesAI | Secure Spiritual Guidance & Data Protection",
    "description": "Learn how HolmesAI protects your privacy and handles your spiritual conversations. We are committed to keeping your metaphysical guidance secure, confidential, and ethically managed.",
    		"image": "https://holmes-ai.netdevs.net/images/holmes-ai-privacy.jpg",
    "author": {
      "@type": "Organization",
      "name": "HolmesAI Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HolmesAI",
      "logo": {
        "@type": "ImageObject",
        		"url": "https://holmes-ai.netdevs.net/images/logo.ico"
      }
    },
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      		"@id": "https://holmes-ai.netdevs.net/privacy"
    }
  }
  </script>

  <!-- Organization Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HolmesAI",
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
      "name": "Privacy-Focused Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Secure Spiritual Guidance",
            "description": "Privacy-protected spiritual counseling and metaphysical wisdom"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Confidential AI Counseling",
            "description": "Secure and private AI-powered spiritual guidance"
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
        "name": "Privacy",
        		"item": "https://holmes-ai.netdevs.net/privacy"
      }
    ]
  }
  </script>
</svelte:head>

<div class="privacy-page">
  <Header />
  
  <!-- Hero Section -->
  <section class="hero" role="banner">
    <div class="hero-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
    </div>
    <div class="hero-content">
      <div class="hero-badge">Data Protection</div>
      <h1>
        <span class="hero-title-glow">Privacy Policy</span>
      </h1>
      <p class="hero-subtitle">
        <span class="subtitle-highlight">Protecting</span> Your Sacred Conversations 
        <span class="subtitle-highlight">with Divine Wisdom</span>
      </p>
      <div class="hero-stats hero-stats-morph">
        {#key heroStatIndex}
          <div class="stat-item stat-item-morph" in:fade={{ duration: 900 }} out:fade={{ duration: 900 }}>
            <div class="stat-icon stat-icon-morph">
              <svelte:component this={heroStats[heroStatIndex].Icon} size={96} />
            </div>
            <div class="stat-label stat-label-morph">{heroStats[heroStatIndex].label}</div>
          </div>
        {/key}
      </div>
      <div class="hero-scroll-indicator">
        <div class="scroll-text">Learn More</div>
        <div class="scroll-arrow">↓</div>
      </div>
    </div>
  </section>

  <div class="container">
    <!-- Introduction -->
    <section class="section intro-section" aria-labelledby="intro-heading">
      <div class="section-header">
        <div class="section-badge">Our Commitment</div>
        <h2 id="intro-heading">Your Privacy, Simply</h2>
        <div class="section-divider"></div>
      </div>
      <div class="intro-content">
        <p class="lead">
          We never sell or share your data. We only use it to improve the quality of the system.
        </p>
        <div class="text-block">
          <ul class="privacy-points">
            <li>Your data is private and anonymous.</li>
            <li>There is no transfer of names or personally identifiable information.</li>
            <li>Only the questions you ask are stored.</li>
          </ul>
          <ul class="privacy-points privacy-points-break">
            <li>Only authorized people can view these anonymous questions.</li>
            <li>HolmesAI is not intended for children under 13, and we do not knowingly collect information from them.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section contact-section" aria-labelledby="contact-heading">
      <div class="section-header">
        <div class="section-badge">Get in Touch</div>
        <h2 id="contact-heading">Contact Us</h2>
        <div class="section-divider"></div>
      </div>
      <div class="contact-content">
        <p class="contact-intro">
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">
              <Mail size={32} />
            </div>
            <div class="contact-info">
              <h4>Email</h4>
              <a href="mailto:ryan@webdevs.net" class="contact-link">ryan@webdevs.net</a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <Phone size={32} />
            </div>
            <div class="contact-info">
              <h4>Phone</h4>
              <a href="tel:+13105405080" class="contact-link">(310) 540-5080</a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <MapPin size={32} />
            </div>
            <div class="contact-info">
              <h4>Address</h4>
              <p>Redondo Beach Center for Spiritual Living<br>907 Knob Hill Ave<br>Redondo Beach, CA 90277</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Last Updated -->
    <section class="section">
      <div class="last-updated">
        <p><strong>Last Updated:</strong> August 2026</p>
      </div>
    </section>
  </div>
</div>

<style>
  :root {
    --text-accent-rgb: 16, 185, 129;
  }
  
  .privacy-page {
    background: var(--bg-primary);
    min-height: 100vh;
    color: var(--text-primary);
    position: relative;
  }

  /* Hero Section - Enhanced like About page */
  .hero {
    position: relative;
    background: 
      linear-gradient(rgba(30, 41, 59, 0.7), rgba(51, 65, 85, 0.7)),
      url('/images/privacy.webp');
    background-size: cover;
    background-position: center;
    color: white;
    text-align: center;
    padding: 6rem 2rem;
    margin: 2rem;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(8px);
    background: rgba(30, 41, 59, 0.3);
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
  }

  .hero h1 {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: white;
  }

  .hero-title-glow {
    position: relative;
    display: inline-block;
    font-size: 4rem;
    font-weight: 800;
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 25%,
      var(--text-accent) 50%,
      var(--text-accent-hover) 75%,
      #ffffff 100%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s ease-in-out infinite;
    filter: contrast(1.1) brightness(1.1);
  }

  @keyframes shimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .hero-subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
    color: #e2e8f0;
    font-weight: 300;
    margin-bottom: 2rem;
  }

  .subtitle-highlight {
    position: relative;
    color: var(--text-accent);
    font-weight: 700;
    background: linear-gradient(
      90deg,
      var(--text-accent) 0%,
      var(--text-accent-hover) 50%,
      var(--text-accent) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: highlight-flow 2s ease-in-out infinite;
  }

  @keyframes highlight-flow {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Hero Particles */
  .hero-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(var(--text-accent-rgb), 0.6);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
  .particle-2 { top: 60%; left: 80%; animation-delay: 1s; }
  .particle-3 { top: 30%; left: 70%; animation-delay: 2s; }
  .particle-4 { top: 80%; left: 20%; animation-delay: 3s; }
  .particle-5 { top: 15%; left: 60%; animation-delay: 4s; }
  .particle-6 { top: 70%; left: 40%; animation-delay: 5s; }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-20px) scale(1.2);
      opacity: 1;
    }
  }

  /* Hero Stats */
  .hero-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin: 3rem 0;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .stat-item {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-icon {
    color: var(--text-accent);
    filter: brightness(1.2);
    animation: stat-glow 4s ease-in-out infinite;
  }

  @keyframes stat-glow {
    0%, 100% {
      filter: brightness(1.2) drop-shadow(0 0 8px rgba(var(--text-accent-rgb), 0.5));
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 16px rgba(var(--text-accent-rgb), 0.8));
    }
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
  }

  .hero-stats-morph {
    position: relative;
    min-height: 220px;
  }

  .stat-item-morph {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .stat-icon-morph {
    color: var(--text-accent-hover);
    animation: stat-glow-orange 4s ease-in-out infinite;
  }

  @keyframes stat-glow-orange {
    0%, 100% {
      filter: brightness(1) drop-shadow(0 0 8px rgba(255, 170, 0, 0.5));
    }
    50% {
      filter: brightness(1.05) drop-shadow(0 0 16px rgba(255, 170, 0, 0.8));
    }
  }

  .stat-label-morph {
    font-size: 1.75rem;
  }

  /* Scroll Indicator */
  .hero-scroll-indicator {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.8;
    animation: bounce 2s infinite;
  }

  .scroll-text {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .scroll-arrow {
    font-size: 1.5rem;
    color: var(--text-accent);
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  /* Container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Section Styling */
  .section {
    padding: 3rem 0;
    position: relative;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .contact-section .section-header {
    position: relative;
    z-index: 20;
  }

  .section-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
    color: white;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }

  .section h2 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
  }

  .section-divider {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
    margin: 0;
    border-radius: 2px;
  }

  /* Introduction Section */
  .intro-section {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  }

  .intro-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  .lead {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 3rem;
    color: var(--text-accent);
    line-height: 1.6;
  }

  .text-block {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    border-left: 4px solid var(--text-accent);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .text-block p {
    margin: 0;
    line-height: 1.8;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  .privacy-points {
    text-align: left;
    list-style: disc;
    margin: 0;
    padding-left: 1.5rem;
    line-height: 1.8;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  .privacy-points li {
    margin-bottom: 0.4rem;
  }

  .privacy-points-break {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-primary);
  }

  /* Policy Grid */
  .policy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .policy-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-primary);
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .policy-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
    border-radius: 20px 20px 0 0;
  }

  .card-icon {
    color: var(--text-accent);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .policy-card h3 {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .policy-card p {
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  .policy-card ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .policy-card li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }


  /* Usage Grid */
  .usage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;}

.usage-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.usage-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.usage-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.usage-icon {
  color: var(--text-accent);
  background: rgba(var(--text-accent-rgb), 0.1);
  padding: 0.5rem;
  border-radius: 10px;
}

.usage-card h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.usage-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.usage-content ul {
  padding-left: 1.5rem;
  margin: 0;
}

.usage-content li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Ownership Section */
.ownership-section {
  background: 
    linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%),
    radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 50%);
}

.ownership-card {
  position: relative;
  background: var(--bg-secondary);
  padding: 3rem;
  border-radius: 25px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-primary);
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
}

.ownership-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover), #10b981);
}

.ownership-content {
  text-align: center;
}

.ownership-icon {
  color: var(--text-accent);
  margin-bottom: 1.5rem;
}

.ownership-card h3 {
  color: var(--text-accent);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.important-notice {
  background: linear-gradient(135deg, rgba(var(--text-accent-rgb), 0.1), rgba(var(--text-accent-rgb), 0.05));
  border: 1px solid rgba(var(--text-accent-rgb), 0.3);
  border-left: 4px solid var(--text-accent);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
}

.notice-icon {
  color: var(--text-accent);
  flex-shrink: 0;
}

.important-notice p {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.ownership-lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  text-align: left;
}

.ownership-list h4 {
  color: var(--text-accent);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.ownership-list ul {
  padding-left: 1.5rem;
  margin: 0;
}

.ownership-list li {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 0.5rem;
}

/* Protection Grid */
.protection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

  .protection-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-primary);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

.protection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.protection-icon {
  color: var(--text-accent);
  background: rgba(var(--text-accent-rgb), 0.1);
  padding: 1rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.protection-card h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.protection-card p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.protection-card ul {
  text-align: left;
  padding-left: 1.5rem;
  margin: 0;
}

.protection-card li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Sharing Section */
.sharing-section {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.sharing-content {
  max-width: 900px;
  margin: 0 auto;
}

.no-sell-banner {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  text-align: left;
}

.banner-icon {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 1rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.banner-content h3 {
  color: #10b981;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.banner-content p {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin: 0;
}

.sharing-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.sharing-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.sharing-card h4 {
  color: var(--text-accent);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.sharing-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.sharing-card ul {
  padding-left: 1.5rem;
  margin: 0;
}

.sharing-card li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Additional Policies */
.additional-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.additional-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.additional-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.additional-icon {
  color: var(--text-accent);
  background: rgba(var(--text-accent-rgb), 0.1);
  padding: 0.8rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.additional-card h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.additional-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.additional-card ul {
  text-align: left;
  padding-left: 1.5rem;
  margin: 0;
}

.additional-card li {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Contact Section */
.contact-section {
  background: var(--bg-primary);
}

.contact-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.contact-intro {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.contact-card {
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
}

.contact-card:hover {
  transform: translateY(-2px);
}

.contact-icon {
  color: var(--text-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 2px 8px rgba(var(--text-accent-rgb), 0.3));
}

.contact-info h4 {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-link {
  color: var(--text-accent);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  font-size: 0.9rem;
}

.contact-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
  transition: width 0.3s ease;
}

.contact-link:hover {
  color: var(--text-accent-hover);
  transform: translateY(-1px);
}

.contact-link:hover::after {
  width: 100%;
}

.contact-info p {
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  font-size: 0.85rem;
}

/* Last Updated */
.last-updated {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 15px;
  border: 1px solid var(--border-primary);
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 640px) {
  .hero {
    padding: 3rem 1rem;
    margin: 1rem;
  }
  
  .hero h1, .hero-title-glow {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .stat-divider {
    display: none;
  }

  .section {
    padding: 2rem 0;
  }
  
  .section h2 {
    font-size: 1.8rem;
  }

  .lead {
    font-size: 1.2rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .policy-grid,
  .usage-grid,
  .protection-grid,
  .sharing-details,
  .additional-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .policy-card,
  .usage-card,
  .protection-card,
  .sharing-card,
  .additional-card {
    padding: 1.5rem;
  }

  .contact-card {
    padding: 1rem;
  }

  .contact-icon {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .contact-info h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .contact-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .contact-intro {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .ownership-card {
    padding: 1.5rem;
  }
  
  .ownership-lists {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .no-sell-banner {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .important-notice {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .text-block {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem;
    margin: 1rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-title-glow {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
  
  .section {
    padding: 3rem 0;
  }
  
  .section h2 {
    font-size: 2rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .policy-grid {
    grid-template-columns: 1fr;
  }
  
  .policy-card {
    padding: 2rem;
  }
  
  .usage-grid {
    grid-template-columns: 1fr;
  }
  
  .protection-grid {
    grid-template-columns: 1fr;
  }
  
  .ownership-card {
    padding: 2rem;
  }
  
  .ownership-lists {
    grid-template-columns: 1fr;
  }
  
  .no-sell-banner {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
  
  .sharing-details {
    grid-template-columns: 1fr;
  }
  
  .additional-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    padding: 1.5rem;
  }
  
  .policy-card,
  .usage-card,
  .protection-card,
  .sharing-card,
  .additional-card,
  .contact-card {
    padding: 1.5rem;
  }
  
  .ownership-card {
    padding: 1.5rem;
  }
  
  .important-notice,
  .no-sell-banner {
    padding: 1.5rem;
  }
}

/* Accessibility */
.contact-link:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .policy-card,
  .usage-card,
  .protection-card,
  .sharing-card,
  .additional-card,
  .contact-card,
  .ownership-card {
    border: 3px solid var(--border-primary);
  }
  
  .contact-link {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .policy-card,
  .usage-card,
  .protection-card,
  .sharing-card,
  .additional-card,
  .contact-card,
  .contact-link {
    transition: none;
  }
  
  .policy-card:hover,
  .usage-card:hover,
  .protection-card:hover,
  .sharing-card:hover,
  .additional-card:hover,
  .contact-card:hover,
  .contact-link:hover {
    transform: none;
  }
  
  .hero-particles,
  .particle {
    display: none;
  }
  
}
</style>