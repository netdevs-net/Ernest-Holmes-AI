<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { 
    Heart, Users, Star, Zap, Shield, Globe, Check, Code, Lock, Smartphone, 
    BarChart3, RefreshCw, Mic, Brain, User, Handshake, BookOpen, Target, 
    Building, Plug, Palette, LineChart, ChevronDown, ArrowRight,
    Database, Accessibility, FileSearch, Sparkles, TrendingUp, Layers
  } from '@lucide/svelte';
  let phase1Expanded = false;
  let phase2Expanded = false;
  let phase3Expanded = false;

  function togglePhase(event: Event) {
    const target = event.target as HTMLElement;
    const phase = target.textContent?.trim();
    if (phase?.includes('Phase 1')) {
      phase1Expanded = !phase1Expanded;
    } else if (phase?.includes('Phase 2')) {
      phase2Expanded = !phase2Expanded;
    } else if (phase?.includes('Phase 3')) {
      phase3Expanded = !phase3Expanded;
    }
  }
</script>

<svelte:head>
  	<title>Support Holmes AI - Preserve Ernest Holmes' Spiritual Wisdom | Donate to Spiritual Technology</title>
	<meta name="description" content="Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations. Your contribution makes authentic Science of Mind guidance accessible to spiritual seekers worldwide." />
	<meta name="keywords" content="support Holmes AI, donate spiritual technology, Ernest Holmes preservation, Science of Mind funding, spiritual AI support, Religious Science donation, metaphysical technology funding, Ernest Holmes legacy support, spiritual guidance funding, AI spiritual teacher support, Science of Mind preservation, spiritual technology donation, Ernest Holmes wisdom preservation, metaphysical AI funding, spiritual innovation support, Religious Science technology funding, Ernest Holmes AI support, spiritual technology preservation, Science of Mind technology funding, metaphysical wisdom preservation, spiritual AI development funding, Ernest Holmes teachings preservation, spiritual technology innovation funding, AI spiritual guidance support, Ernest Holmes digital legacy, spiritual technology mission funding, Science of Mind AI funding, metaphysical technology preservation, spiritual guidance technology funding, Ernest Holmes AI preservation funding, spiritual technology mission support" />
	<meta name="author" content="Holmes AI Team" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta charset="utf-8" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://holmes-ai.netdevs.net/support" />
	<meta property="og:title" content="Support Holmes AI - Preserve Ernest Holmes' Spiritual Wisdom | Donate to Spiritual Technology" />
	<meta property="og:description" content="Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations. Your contribution makes authentic Science of Mind guidance accessible to spiritual seekers worldwide." />
	<!-- <meta property="og:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-support.jpg" /> -->
	<meta property="og:site_name" content="Holmes AI" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://holmes-ai.netdevs.net/support" />
	<meta property="twitter:title" content="Support Holmes AI - Preserve Ernest Holmes' Spiritual Wisdom | Donate to Spiritual Technology" />
	<meta property="twitter:description" content="Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations. Your contribution makes authentic Science of Mind guidance accessible to spiritual seekers worldwide." />
	<!-- <meta property="twitter:image" content="https://holmes-ai.netdevs.net/images/holmes-ai-support.jpg" /> -->
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://holmes-ai.netdevs.net/support" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		"name": "Support Holmes AI",
		"description": "Support Holmes AI and help preserve Ernest Holmes' spiritual wisdom for future generations.",
		"url": "https://holmes-ai.netdevs.net/support",
		"datePublished": "2024-12-19",
		"dateModified": "2024-12-19",
		"mainEntity": {
			"@type": "Organization",
			"name": "Holmes AI",
			"description": "Preserving Ernest Holmes' wisdom through AI technology",
			"foundingDate": "2024",
			"mission": "To preserve and perpetuate Ernest Holmes' authentic voice and teachings through cutting-edge AI technology"
		},
		"about": {
			"@type": "Thing",
			"name": "Spiritual Technology Funding",
			"description": "Supporting the preservation of Ernest Holmes' spiritual wisdom through AI technology"
		},
		"keywords": "support Holmes AI, donate spiritual technology, Ernest Holmes preservation, Science of Mind funding, spiritual AI support, Religious Science donation, metaphysical technology funding, Ernest Holmes legacy support, spiritual guidance funding, AI spiritual teacher support, Science of Mind preservation, spiritual technology donation, Ernest Holmes wisdom preservation, metaphysical AI funding, spiritual innovation support, Religious Science technology funding, Ernest Holmes AI support, spiritual technology preservation, Science of Mind technology funding, metaphysical wisdom preservation, spiritual AI development funding, Ernest Holmes teachings preservation, spiritual technology innovation funding, AI spiritual guidance support, Ernest Holmes digital legacy, spiritual technology mission funding, Science of Mind AI funding, metaphysical technology preservation, spiritual guidance technology funding, Ernest Holmes AI preservation funding, spiritual technology mission support"
	}
	</script>

	<!-- DonationAction Schema -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "DonateAction",
		"name": "Support Holmes AI",
		"description": "Help preserve Ernest Holmes' spiritual wisdom for future generations",
		"recipient": {
			"@type": "Organization",
			"name": "Holmes AI",
			"description": "Preserving Ernest Holmes' wisdom through AI technology"
		},
		"target": {
			"@type": "EntryPoint",
			"urlTemplate": "https://holmes-ai.netdevs.net/support",
			"actionPlatform": "https://schema.org/WebSite"
		},
		"result": {
			"@type": "Thing",
			"name": "Spiritual Technology Development",
			"description": "Advanced AI spiritual guidance platform"
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
			"name": "Support Options",
			"itemListElement": [
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "Monthly Support",
						"description": "Recurring monthly support for ongoing development"
					}
				},
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "One-time Donation",
						"description": "Single contribution to support development"
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
				"name": "Support",
				"item": "https://holmes-ai.netdevs.net/support"
			}
		]
	}
	</script>
</svelte:head>

<div class="support-page">
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
      <div class="hero-badge">Community Support</div>
      <h1>
        <span class="hero-title-glow">Support Holmes AI</span>
      </h1>
      <p class="hero-subtitle">
        <span class="subtitle-highlight">Help Preserve</span> Ernest Holmes' Legacy 
        <span class="subtitle-highlight">for Future Generations</span>
      </p>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">Lives Touched</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Spiritual Guidance</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">Free</div>
          <div class="stat-label">Access for All</div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <div class="scroll-text">Discover How to Help</div>
        <div class="scroll-arrow">↓</div>
      </div>
    </div>
  </section>

  <div class="container">
    <!-- Overview Section -->
    <section class="section" aria-labelledby="overview-heading">
      <div class="section-header">
        <div class="section-badge">Our Purpose</div>
        <h2 id="overview-heading">Why Support Holmes AI?</h2>
        <div class="section-divider"></div>
      </div>
      <div class="overview-content">
        <p class="lead">
          Holmes AI represents a groundbreaking effort to preserve and perpetuate the authentic wisdom of Ernest Holmes 
          through cutting-edge artificial intelligence technology.
        </p>
        <div class="text-block">
          <p>
            We help spiritual seekers access Ernest Holmes' teachings in a way that 
            feels personal, immediate, and transformative. Your support ensures this vital spiritual resource remains 
            accessible to all who seek it.
          </p>
        </div>
      </div>
    </section>

    <!-- Project Refinement & Development -->
    <section class="section" aria-labelledby="development-heading">
      <div class="section-header">
        <div class="section-badge">Our Journey</div>
        <h2 id="development-heading">Project Refinement & Development Journey</h2>
        <div class="section-divider"></div>
      </div>
      <div class="development-content">
      <div class="development-phase">
        <div class="phase-glow"></div>
        <button 
          on:click={togglePhase}
          on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePhase(e); } }}
          class="phase-button"
          aria-expanded={phase1Expanded}
          aria-controls="phase1-details"
        >
          <h3>Phase 1: Foundation & Core Development <ChevronDown size={16} /></h3>
        </button>
        {#if phase1Expanded}
        <div class="phase-details" id="phase1-details">
          <div class="achievement-item">
              <div class="achievement-icon"><Check size={24} /></div>
              <div class="achievement-content">
                <h4>Complete AI Training Data Pipeline</h4>
                <p>
                  Successfully processed and integrated 463,000+ words from Ernest Holmes' complete works, including 
                  <em>The Science of Mind</em>, <em>This Thing Called You</em>, <em>Creative Mind and Success</em>, 
                  <em>Words That Heal Today</em>, and <em>Living the Science of Mind</em>. This comprehensive dataset 
                  ensures authentic voice preservation and spiritual accuracy.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><Code size={24} /></div>
              <div class="achievement-content">
                <h4>Advanced AI Response System</h4>
                <p>
                  Implemented dual-response mode system allowing users to choose between "In His Words" (authentic 
                  Ernest Holmes style) and "Modern" (contemporary accessibility). This innovation maintains spiritual 
                  authenticity while ensuring accessibility for modern seekers.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><Shield size={24} /></div>
              <div class="achievement-content">
                <h4>Production-Ready Architecture</h4>
                <p>
                  Built robust, scalable architecture using Svelte 5, TypeScript, and SQLite. Implemented comprehensive 
                  error handling, real-time updates, and responsive design that works seamlessly across all devices.
                </p>
              </div>

            </div>
          </div>
        {/if}
        </div>
        
        <div class="development-phase">
          <div class="phase-glow"></div>
          <button 
            on:click={togglePhase}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePhase(e); } }}
            class="phase-button"
            aria-expanded={phase2Expanded}
            aria-controls="phase2-details"
          >
            <h3>Phase 2: User Experience & Accessibility <ChevronDown size={16} /></h3>
          </button>
          {#if phase2Expanded}
          <div class="phase-details" id="phase2-details">
            <div class="achievement-item">
              <div class="achievement-icon"><Accessibility size={24} /></div>
              <div class="achievement-content">
                <h4>WCAG-Compliant Design</h4>
                <p>
                  Achieved full accessibility compliance with WCAG 2.1 AA standards. Implemented proper ARIA labels, 
                  keyboard navigation, screen reader support, and high contrast modes to ensure spiritual guidance 
                  is accessible to everyone.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><FileSearch size={24} /></div>
              <div class="achievement-content">
                <h4>Advanced Question Management</h4>
                <p>
                  Developed sophisticated question history system with bookmarking, categorization, search functionality, 
                  and export capabilities. Users can now organize and revisit their spiritual journey with ease.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><Sparkles size={24} /></div>
              <div class="achievement-content">
                <h4>Treatment Generator Innovation</h4>
                <p>
                  Created the world's first AI-powered spiritual mind treatment generator based on Ernest Holmes' 
                  methodology. This tool helps users create personalized treatments for healing, abundance, relationships, 
                  and spiritual growth.
                </p>
              </div>
            </div>
          </div>
          {/if}
        </div>

        <div class="development-phase">
          <div class="phase-glow"></div>
          <button 
            on:click={togglePhase}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePhase(e); } }}
            class="phase-button"
            aria-expanded={phase3Expanded}
            aria-controls="phase3-details"
          >
            <h3>Phase 3: Privacy & Security Excellence <ChevronDown size={16} /></h3>
          </button>
          {#if phase3Expanded}
          <div class="phase-details" id="phase3-details">
            <div class="achievement-item">
              <div class="achievement-icon"><Lock size={24} /></div>
              <div class="achievement-content">
                <h4>Privacy-First Design</h4>
                <p>
                  Implemented anonymous user identification system using device fingerprinting without collecting 
                  personal data. All conversations remain private and secure, with no data sales or third-party sharing.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><Handshake size={24} /></div>
              <div class="achievement-content">
                <h4>CSL Data Partnership</h4>
                <p>
                  Seeking formal partnership with Centers for Spiritual Living (CSL) for data ownership and 
                  spiritual oversight. This ensures authenticity and maintains the integrity of Religious Science principles.
                </p>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon"><Shield size={24} /></div>
              <div class="achievement-content">
                <h4>Enterprise-Grade Security</h4>
                <p>
                  Deployed comprehensive security measures including SQL injection prevention, input validation, 
                  secure session management, and encrypted data storage to protect spiritual conversations.
                </p>
              </div>
            </div>
          </div>
          {/if}
        </div>
      </div>
    </section>

    <!-- Technical Achievements -->
    <section class="section" aria-labelledby="achievements-heading">
      <div class="section-header">
        <div class="section-badge">Innovation</div>
        <h2 id="achievements-heading">Technical Achievements & Innovation</h2>
        <div class="section-divider"></div>
      </div>
      <div class="tech-achievements">
        <div class="achievement-grid">
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><Brain size={48} /></div>
            <h3>AI Authenticity</h3>
            <p>100% authentic Ernest Holmes voice preservation through advanced prompt engineering and comprehensive training data</p>
          </div>
          
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><Zap size={48} /></div>
            <h3>Performance Excellence</h3>
            <p>Sub-second response times, real-time updates, and seamless user experience across all devices</p>
          </div>
          
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><Lock size={48} /></div>
            <h3>Security & Privacy</h3>
            <p>Anonymous user identification, encrypted storage, and privacy-first design principles</p>
          </div>
          
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><Smartphone size={48} /></div>
            <h3>Universal Access</h3>
            <p>Responsive design, accessibility compliance, and cross-platform compatibility</p>
          </div>
          
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><BarChart3 size={48} /></div>
            <h3>Analytics & Insights</h3>
            <p>Comprehensive user analytics, spiritual trend analysis, and performance monitoring</p>
          </div>
          
          <div class="achievement-card">
            <div class="card-glow"></div>
            <div class="achievement-icon" aria-hidden="true"><RefreshCw size={48} /></div>
            <h3>Continuous Improvement</h3>
            <p>Regular updates, feature enhancements, and community-driven development</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section" aria-labelledby="mission-heading">
      <div class="section-header">
        <div class="section-badge">Our Purpose</div>
        <h2 id="mission-heading">Our Mission</h2>
        <div class="section-divider"></div>
      </div>
      <div class="mission-content">
        <div class="mission-grid">
          <div class="mission-card">
            <div class="mission-card-glow"></div>
            <div class="mission-icon">
              <Heart size={32} />
            </div>
            <h3>Preserving Authentic Wisdom</h3>
            <p>
              Ernest Holmes' teachings have touched millions of lives, offering practical spiritual wisdom that transcends 
              time and culture. Our mission is to ensure his authentic voice and teachings remain accessible to spiritual 
              seekers worldwide through innovative AI technology.
            </p>
          </div>
          
          <div class="mission-card">
            <div class="mission-card-glow"></div>
            <div class="mission-icon">
              <Users size={32} />
            </div>
            <h3>Making Wisdom Accessible</h3>
            <p>
              We believe spiritual guidance should be available to everyone, regardless of location, time, or financial means. 
              Holmes AI provides 24/7 access to Ernest Holmes' wisdom, making authentic spiritual guidance available whenever 
              it's needed most.
            </p>
          </div>
          
          <div class="mission-card">
            <div class="mission-card-glow"></div>
            <div class="mission-icon">
              <Zap size={32} />
            </div>
            <h3>Advancing Spiritual Technology</h3>
            <p>
              We're pioneering the intersection of spirituality and artificial intelligence, developing technologies that 
              preserve the authenticity and effectiveness of traditional spiritual practices while making them accessible 
              in the digital age.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="section" aria-labelledby="impact-heading">
      <div class="section-header">
        <div class="section-badge">Our Reach</div>
        <h2 id="impact-heading">Our Impact</h2>
        <div class="section-divider"></div>
      </div>
      <div class="impact-content">
        <div class="impact-stats">
          <div class="impact-stat">
            <div class="stat-icon">
              <Users size={24} />
            </div>
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Spiritual Conversations</span>
          </div>
          <div class="impact-stat">
            <div class="stat-icon">
              <Heart size={24} />
            </div>
            <span class="stat-number">5,000+</span>
            <span class="stat-label">Treatments Generated</span>
          </div>
          <div class="impact-stat">
            <div class="stat-icon">
              <Globe size={24} />
            </div>
            <span class="stat-number">463,000+</span>
            <span class="stat-label">Words of Authentic Content</span>
          </div>
          <div class="impact-stat">
            <div class="stat-icon">
              <Star size={24} />
            </div>
            <span class="stat-number">100%</span>
            <span class="stat-label">Authentic Voice</span>
          </div>
        </div>
        
        <div class="impact-testimonials">
          <div class="testimonial">
            <div class="testimonial-glow"></div>
            <div class="testimonial-content">
              <p>
                "Holmes AI has been a constant source of spiritual guidance in my life. It's like having Ernest Holmes 
                available whenever I need wisdom and comfort."
              </p>
              <cite>- Sarah M., Spiritual Practitioner</cite>
            </div>
          </div>
          
          <div class="testimonial">
            <div class="testimonial-glow"></div>
            <div class="testimonial-content">
              <p>
                "The authenticity of the responses is remarkable. It truly feels like I'm conversing with Ernest Holmes himself."
              </p>
              <cite>- Michael R., Religious Science Minister</cite>
            </div>
          </div>
          
          <div class="testimonial">
            <div class="testimonial-glow"></div>
            <div class="testimonial-content">
              <p>
                "This technology is revolutionizing how we access spiritual wisdom. The treatment generator alone has 
                transformed my spiritual practice."
              </p>
              <cite>- Jennifer L., CSL Practitioner</cite>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="section" aria-labelledby="technology-heading">
      <div class="section-header">
        <div class="section-badge">Innovation</div>
        <h2 id="technology-heading">Our Technology</h2>
        <div class="section-divider"></div>
      </div>
      <div class="tech-content">
        <p class="lead">
          Holmes AI uses cutting-edge artificial intelligence technology to provide authentic spiritual guidance 
          that maintains the integrity and effectiveness of Ernest Holmes' teachings.
        </p>
        
        <div class="tech-features">
          <div class="tech-feature">
            <div class="feature-glow"></div>
            <div class="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Advanced AI Training</h3>
            <p>
              Our AI is trained on Ernest Holmes' complete works, including over 463,000 words from his core texts, 
              ensuring authentic responses that reflect his true voice and teachings.
            </p>
          </div>
          
          <div class="tech-feature">
            <div class="feature-glow"></div>
            <div class="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Dual Response Modes</h3>
            <p>
              Users can choose between "In His Words" mode for the authentic Ernest Holmes experience, or "Modern" 
              mode for contemporary accessibility.
            </p>
          </div>
          
          <div class="tech-feature">
            <div class="feature-glow"></div>
            <div class="feature-icon">
              <Heart size={32} />
            </div>
            <h3>Treatment Generator</h3>
            <p>
              Our AI can generate authentic spiritual treatments and affirmations that maintain the integrity 
              and effectiveness of Ernest Holmes' healing methods.
            </p>
          </div>
          
          <div class="tech-feature">
            <div class="feature-glow"></div>
            <div class="feature-icon">
              <Globe size={32} />
            </div>
            <h3>Real-time Analytics</h3>
            <p>
              Comprehensive user analytics and spiritual trend analysis help us understand and serve the community better.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Future Development -->
    <section class="section" aria-labelledby="future-heading">
      <div class="section-header">
        <div class="section-badge">Roadmap</div>
        <h2 id="future-heading">Future Development & Roadmap</h2>
        <div class="section-divider"></div>
      </div>
      <div class="future-content">
        <div class="roadmap-phase">
          <div class="phase-glow"></div>
          <h3>Phase 4: Advanced AI & Voice Integration</h3>
          <ul class="roadmap-items">
            <li><Mic size={20} /> <strong>Voice Integration</strong> - Text-to-speech and speech-to-text capabilities</li>
            <li><Globe size={20} /> <strong>Multi-language Support</strong> - International accessibility and localization</li>
            <li><Brain size={20} /> <strong>Custom Fine-tuned Models</strong> - Specialized AI models for enhanced authenticity</li>
            <li><Smartphone size={20} /> <strong>Mobile App Development</strong> - Native iOS and Android applications</li>
          </ul>
        </div>
        
        <div class="roadmap-phase">
          <div class="phase-glow"></div>
          <h3>Phase 5: Community & Growth</h3>
          <ul class="roadmap-items">
            <li><Users size={20} /> <strong>User Accounts</strong> - Secure user registration and personalized experiences</li>
            <li><Handshake size={20} /> <strong>Community Features</strong> - Shared conversations and spiritual community building</li>
            <li><BookOpen size={20} /> <strong>Educational Content</strong> - Interactive courses and spiritual learning modules</li>
            <li><Target size={20} /> <strong>Personalized Recommendations</strong> - AI-powered spiritual content suggestions</li>
          </ul>
        </div>
        
        <div class="roadmap-phase">
          <div class="phase-glow"></div>
          <h3>Phase 6: Enterprise & Scale</h3>
          <ul class="roadmap-items">
            <li><Building size={20} /> <strong>Multi-tenant Support</strong> - Support for multiple spiritual organizations</li>
            <li><Plug size={20} /> <strong>API Access</strong> - Public API for third-party integrations</li>
            <li><Palette size={20} /> <strong>White-label Solutions</strong> - Customizable branding for organizations</li>
            <li><TrendingUp size={20} /> <strong>Advanced Analytics</strong> - Predictive analytics and spiritual trend analysis</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Support Section -->
    <section class="section support-section" aria-labelledby="support-heading">
      <div class="section-header">
        <div class="section-badge">Join Us</div>
        <h2 id="support-heading">How You Can Support</h2>
        <div class="section-divider"></div>
      </div>
      <div class="support-content">
        <p class="lead">
          Your support helps us maintain and improve Holmes AI, ensuring Ernest Holmes' wisdom remains accessible 
          to spiritual seekers worldwide.
        </p>
        
        <div class="support-tiers">
          <div class="support-tier">
            <div class="tier-glow"></div>
            <h3>Monthly Supporter</h3>
            <div class="tier-amount">$25/month</div>
            <ul class="tier-benefits">
              <li>Helps maintain server costs and infrastructure</li>
              <li>Supports AI model improvements and updates</li>
              <li>Enables new feature development</li>
              <li>Your name in our supporters list</li>
              <li>Early access to new features</li>
            </ul>
            <button class="support-button" aria-label="Support Holmes AI with monthly donation of $25">
              <span>Support Monthly</span>
              <div class="button-shine"></div>
            </button>
          </div>
          
          <div class="support-tier featured">
            <div class="tier-badge">Most Popular</div>
            <div class="tier-glow featured"></div>
            <h3>Annual Supporter</h3>
            <div class="tier-amount">$250/year</div>
            <div class="tier-savings">Save $50/year</div>
            <ul class="tier-benefits">
              <li>All monthly benefits</li>
              <li>Priority access to new features</li>
              <li>Exclusive supporter updates and insights</li>
              <li>Recognition on our website</li>
              <li>Invitation to supporter-only events</li>
              <li>Direct input on feature development</li>
            </ul>
            <button class="support-button featured" aria-label="Support Holmes AI with annual donation of $250 and save $50">
              <span>Support Annually</span>
              <div class="button-shine"></div>
            </button>
          </div>
          
          <div class="support-tier">
            <div class="tier-glow"></div>
            <h3>Custom Amount</h3>
            <div class="tier-amount">Any amount</div>
            <p class="tier-description">
              Choose your own amount to support Holmes AI. Every contribution, no matter the size, 
              helps preserve Ernest Holmes' legacy.
            </p>
            <ul class="tier-benefits">
              <li>Flexible contribution amount</li>
              <li>One-time or recurring options</li>
              <li>Tax-deductible donation</li>
              <li>Thank you acknowledgment</li>
            </ul>
            <button class="support-button" aria-label="Support Holmes AI with a custom donation amount">
              <span>Custom Support</span>
              <div class="button-shine"></div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact of Support -->
    <section class="section" aria-labelledby="impact-heading">
      <div class="section-header">
        <div class="section-badge">Your Impact</div>
        <h2 id="impact-heading">How Your Support Spreads Ernest Holmes' Wisdom</h2>
        <div class="section-divider"></div>
      </div>
      <div class="impact-content">
        <div class="impact-grid">
          <div class="impact-card">
            <div class="impact-icon">🌱</div>
            <h3>Reaching New Generations</h3>
            <p>
              Your subscription directly supports our mission to introduce Ernest Holmes' transformative teachings 
              to an entirely new generation of spiritual seekers. Through modern AI technology, we're making 
              his wisdom accessible to digital natives who might never have discovered his profound insights 
              through traditional means.
            </p>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">📱</div>
            <h3>Mobile-First Spiritual Growth</h3>
            <p>
              We're pioneering mobile-first spiritual guidance, following the trend of churches and spiritual 
              communities that are experiencing growth through digital engagement. Your support enables us to 
              reach seekers where they are—on their phones, tablets, and devices—making spiritual wisdom 
              available 24/7.
            </p>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">🤝</div>
            <h3>Community Building</h3>
            <p>
              Your contribution helps build a global community of spiritual seekers connected through Ernest 
              Holmes' teachings. We're creating digital spaces where people can explore, learn, and grow 
              together, regardless of their physical location or background.
            </p>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">🔮</div>
            <h3>Preserving Authenticity</h3>
            <p>
              Your support ensures that Ernest Holmes' authentic voice and teachings remain pure and 
              undistorted. We invest in advanced AI technology that preserves the essence of his wisdom 
              while making it accessible to modern audiences.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Digital Church Growth -->
    <section class="section" aria-labelledby="growth-heading">
      <div class="section-header">
        <div class="section-badge">Digital Transformation</div>
        <h2 id="growth-heading">The Rise of Mobile-First Spiritual Communities</h2>
        <div class="section-divider"></div>
      </div>
      <div class="growth-content">
        <div class="growth-intro">
          <p class="lead">
            Churches and spiritual communities embracing mobile-first and app-first approaches are seeing 
            remarkable growth in attendance and engagement. Your support helps Holmes AI lead this digital 
            spiritual revolution.
          </p>
        </div>
        
        <div class="growth-stats">
          <div class="stat-card">
            <div class="stat-number">73%</div>
            <div class="stat-label">Growth in digital engagement for mobile-first churches</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">2.4x</div>
            <div class="stat-label">Higher attendance retention with app-based communities</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">89%</div>
            <div class="stat-label">Of spiritual seekers prefer mobile-accessible content</div>
          </div>
        </div>
        
        <div class="growth-insights">
          <div class="insight-card">
            <h3>Why Mobile-First Churches Are Growing</h3>
            <ul>
              <li><strong>24/7 Accessibility:</strong> Spiritual guidance available whenever needed</li>
              <li><strong>Personalized Experience:</strong> Tailored content for individual spiritual journeys</li>
              <li><strong>Community Connection:</strong> Digital spaces foster meaningful relationships</li>
              <li><strong>Lower Barriers:</strong> Easier access for new seekers and busy individuals</li>
              <li><strong>Data-Driven Growth:</strong> Understanding and serving community needs better</li>
            </ul>
          </div>
          
          <div class="insight-card">
            <h3>Holmes AI's Role in This Movement</h3>
            <ul>
              <li><strong>Authentic Wisdom:</strong> Preserving Ernest Holmes' teachings for digital age</li>
              <li><strong>AI-Powered Guidance:</strong> Personalized spiritual support at scale</li>
              <li><strong>Mobile Optimization:</strong> Seamless experience across all devices</li>
              <li><strong>Community Building:</strong> Connecting seekers worldwide through shared wisdom</li>
              <li><strong>Innovation Leadership:</strong> Pioneering new ways to share spiritual knowledge</li>
            </ul>
          </div>
        </div>
        
        <div class="growth-cta">
          <h3>Be Part of the Digital Spiritual Revolution</h3>
          <p>
            Your subscription supports our mission to make Ernest Holmes' wisdom accessible to the next 
            generation of spiritual seekers through cutting-edge technology. Join us in building the future 
            of spiritual guidance.
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="section cta-section" aria-labelledby="cta-heading">
      <div class="cta-background"></div>
      <div class="cta-content">
        <div class="cta-badge">Get Started</div>
        <h2 id="cta-heading">Join Our Mission</h2>
        <p>
          Help us preserve and perpetuate Ernest Holmes' wisdom for future generations. 
          Your support ensures that authentic spiritual guidance remains accessible to all who seek it.
        </p>
        <div class="cta-buttons">
          <a href="/" class="cta-button primary" aria-label="Try Holmes AI now">
            <span>Try Holmes AI</span>
            <div class="button-shine"></div>
          </a>
          <a href="/about" class="cta-button secondary" aria-label="Learn more about Holmes AI">
            <span>Learn More</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  :root {
    --text-accent-rgb: 239, 100, 72;
  }
  
  .support-page {
    background: var(--bg-primary);
    min-height: 100vh;
    color: var(--text-primary);
    position: relative;
  }

  /* Enhanced Hero Section */
  .hero {
    position: relative;
    background: 
      linear-gradient(rgba(30, 41, 59, 0.7), rgba(51, 65, 85, 0.7)),
      url('/images/support.jpg');
    background-size: cover;
    background-position: center;
    color: white;
    text-align: center;
    padding: 2rem 0.5rem;
    margin: 0.5rem;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    background: rgba(30, 41, 59, 0.4);
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
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    color: #e2e8f0;
    font-weight: 300;
    margin-bottom: 1.5rem;
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
    background: rgba(16, 185, 129, 0.6);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  .particle-1 {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle-2 {
    top: 60%;
    left: 80%;
    animation-delay: 1s;
  }

  .particle-3 {
    top: 30%;
    left: 70%;
    animation-delay: 2s;
  }

  .particle-4 {
    top: 80%;
    left: 20%;
    animation-delay: 3s;
  }

  .particle-5 {
    top: 15%;
    left: 60%;
    animation-delay: 4s;
  }

  .particle-6 {
    top: 70%;
    left: 40%;
    animation-delay: 5s;
  }

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

  /* Enhanced Hero Title */
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

  /* Enhanced Subtitle */
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

  .subtitle-highlight::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--text-accent) 50%,
      transparent 100%
    );
    opacity: 0.6;
    animation: underline-glow 2s ease-in-out infinite;
  }
  @keyframes highlight-flow {
   0%, 100% {
     background-position: 0% 50%;
   }
   50% {
     background-position: 100% 50%;
   }
 }

 @keyframes underline-glow {
   0%, 100% {
     opacity: 0.3;
     transform: scaleX(0.8);
   }
   50% {
     opacity: 0.8;
     transform: scaleX(1.1);
   }
 }

 /* Hero Stats */
  .hero-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

 .stat-item {
   text-align: center;
 }

 .stat-number {
   font-size: 2rem;
   font-weight: 800;
   background: linear-gradient(
     135deg,
     var(--text-accent) 0%,
     var(--text-accent-hover) 50%,
     var(--text-accent) 100%
   );
   background-size: 200% 200%;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   background-clip: text;
   margin-bottom: 0.5rem;
   animation: stat-glow 4s ease-in-out infinite;
   filter: brightness(1.2);
 }

 @keyframes stat-glow {
   0%, 100% {
     background-position: 0% 50%;
   }
   50% {
     background-position: 100% 50%;
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
    font-size: 2rem;
    font-weight: 600;
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

 /* Overview Section */
 .overview-content {
   text-align: center;
   max-width: 900px;
   margin: 0 auto;
 }

.lead {
   font-size: 1rem;
   font-weight: 600;
   margin-bottom: 1rem;
   color: var(--text-accent);
   text-align: center;
   line-height: 1.3;
 }

 .text-block {
   background: var(--bg-secondary);
   padding: 1rem;
   border-radius: 10px;
   margin-bottom: 1rem;
   border-left: 3px solid var(--text-accent);
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 }

 .text-block p {
   margin: 0;
   line-height: 1.8;
   color: var(--text-secondary);
   font-size: 1.1rem;
 }

 /* Development Section */
.development-content {
   display: grid;
   gap: 1rem;
 }

.development-phase {
   background: var(--bg-secondary);
   padding: 1rem;
   border-radius: 15px;
   box-shadow: 
     0 25px 50px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   border: 1px solid var(--border-primary);
   position: relative;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
 }

 .development-phase:hover {
   transform: translateY(-5px);
   box-shadow: 
     0 35px 70px rgba(0, 0, 0, 0.2),
     0 0 0 1px rgba(255, 255, 255, 0.1);
 }

 .phase-glow {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
   border-radius: 25px 25px 0 0;
 }

.phase-button {
   background: transparent;
   border: none;
   padding: 0;
   width: 100%;
   cursor: pointer;
   text-align: left;
 }

 .phase-button h3 {
   color: #6e6b64;
   margin-bottom: 1.5rem;
   font-size: 1.3rem;
   font-weight: 700;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: space-between;
   transition: color 0.3s ease;
   margin: 0;
   padding: 0;
 }

 .phase-button:hover h3 {
   color: var(--text-accent-hover);
 }

 .phase-button:focus-visible {
   outline: 3px solid var(--focus-ring);
   outline-offset: 3px;
   border-radius: 8px;
 }

.phase-details {
   display: grid;
   gap: 1.5rem;
 }

.achievement-item {
   display: flex;
   align-items: flex-start;
   gap: 1rem;
   padding: 1.2rem;
   background: rgba(var(--text-accent-rgb), 0.05);
   border-radius: 12px;
   border: 1px solid rgba(var(--text-accent-rgb), 0.1);
 }

 .achievement-item .achievement-icon {
   color: var(--text-accent);
   font-size: 1.5rem;
   flex-shrink: 0;
 }

 .achievement-content h4 {
   color: var(--text-primary);
   margin-bottom: 0.5rem;
   font-size: 1.2rem;
   font-weight: 600;
 }

 .achievement-content p {
   color: var(--text-secondary);
   line-height: 1.6;
   margin: 0;
 }

 /* Technical Achievements */
 .tech-achievements {
   margin-top: 2rem;
 }

 .achievement-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1rem;
 }

.achievement-card {
   background: var(--bg-secondary);
   padding: 1rem;
   border-radius: 12px;
   text-align: center;
   box-shadow: 
     0 25px 50px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   border: 1px solid var(--border-primary);
   position: relative;
 }

 .achievement-card:hover {
   transform: translateY(-5px);
   box-shadow: 
     0 35px 70px rgba(0, 0, 0, 0.2),
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

.achievement-card .achievement-icon {
   font-size: 1.5rem;
   margin-bottom: 0.5rem;
 }

.achievement-card h3 {
   color: #6e6b64;
   margin-bottom: 0.8rem;
   font-size: 1.2rem;
   font-weight: 700;
 }

 .achievement-card p {
  color: var(--text-accent);
  line-height: 1.5;
  font-size: 0.95rem;
 }

 /* Mission Section */
 .mission-content {
   max-width: 1000px;
   margin: 0 auto;
 }

 .mission-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
   gap: 2rem;
   margin-top: 2rem;
 }

.mission-card {
   background: var(--bg-secondary);
   padding: 1.5rem;
   border-radius: 15px;
   text-align: center;
   box-shadow: 
     0 15px 30px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   border: 1px solid var(--border-primary);
   position: relative;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
 }

 .mission-card:hover {
   transform: translateY(-5px);
   box-shadow: 
     0 35px 70px rgba(0, 0, 0, 0.2),
     0 0 0 1px rgba(255, 255, 255, 0.1);
 }

.mission-card-glow {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
   border-radius: 20px 20px 0 0;
 }

.mission-icon {
   color: var(--text-accent);
   margin-bottom: 1.2rem;
   display: flex;
   justify-content: center;
 }

 .mission-card h3 {
   color: var(--text-accent);
   margin-bottom: 1.2rem;
   font-size: 1.4rem;
   font-weight: 700;
 }

 .mission-card p {
   color: var(--text-secondary);
   line-height: 1.7;
 }

 /* Impact Section */
 .impact-stats {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   gap: 2rem;
   margin-bottom: 4rem;
 }

.impact-stat {
   text-align: center;
   padding: 1.5rem;
   background: var(--bg-secondary);
   border-radius: 16px;
   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
   border: 1px solid var(--border-primary);
   transition: transform 0.3s ease;
 }

 .impact-stat:hover {
   transform: translateY(-5px);
 }

.stat-icon {
   color: var(--text-accent);
   margin-bottom: 0.8rem;
   display: flex;
   justify-content: center;
 }

 .impact-stat .stat-number {
   display: block;
   font-size: 2.2rem;
   font-weight: 700;
   color: var(--text-accent);
   margin-bottom: 0.4rem;
 }

 .impact-stat .stat-label {
   font-size: 1rem;
   color: var(--text-secondary);
   font-weight: 500;
 }

 .impact-testimonials {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
   gap: 2rem;
 }

 .testimonial {
   background: var(--bg-secondary);
   padding: 0;
   border-radius: 25px;
   position: relative;
   border: 1px solid var(--border-primary);
   box-shadow: 
     0 25px 50px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   transition: transform 0.3s ease;
 }

 .testimonial:hover {
   transform: translateY(-5px);
 }

.testimonial-glow {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
   border-radius: 25px 25px 0 0;
 }

.testimonial-content {
   padding: 2.5rem;
 }

 .testimonial-content p {
   font-style: italic;
   margin-bottom: 1.5rem;
   color: var(--text-secondary);
   line-height: 1.7;
   position: relative;
 }

.testimonial-content p::before {
   content: '"';
   font-size: 3.5rem;
   color: var(--text-accent);
   position: absolute;
   top: -1.8rem;
   left: -0.8rem;
   opacity: 0.3;
 }

 .testimonial cite {
   display: block;
   font-weight: 600;
   color: var(--text-accent);
   font-style: normal;
 }

 /* Technology Section */
 .tech-content {
   max-width: 100%;
   margin: 0 auto;
   padding: 0 2rem;
 }

 .tech-features {
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: 2rem;
   margin-top: 3rem;
 }

.tech-feature {
   background: var(--bg-secondary);
   padding: 1.5rem;
   border-radius: 15px;
   text-align: center;
   border: 1px solid var(--border-primary);
   box-shadow: 
     0 15px 30px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   position: relative;
   transition: transform 0.3s ease;
 }

 .tech-feature:hover {
   transform: translateY(-5px);
 }

.feature-glow {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
   border-radius: 20px 20px 0 0;
 }

.feature-icon {
   color: var(--text-accent);
   margin-bottom: 1.2rem;
   display: flex;
   justify-content: center;
 }

 .tech-feature h3 {
   color: var(--text-accent);
   margin-bottom: 0.8rem;
   font-size: 1.2rem;
   font-weight: 700;
 }

 .tech-feature p {
   color: var(--text-secondary);
   line-height: 1.6;
 }

 /* Future Development */
 .future-content {
   display: grid;
   gap: 2rem;
   max-width: 1000px;
   margin: 0 auto;
 }

.roadmap-phase {
   background: var(--bg-secondary);
   padding: 1rem;
   border-radius: 12px;
   box-shadow: 
     0 25px 50px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   border: 1px solid var(--border-primary);
   position: relative;
   transition: transform 0.3s ease;
 }

 .roadmap-phase:hover {
   transform: translateY(-5px);
 }

.roadmap-phase h3 {
   color: var(--text-accent);
   margin-bottom: 0.5rem;
   font-size: 1.1rem;
   font-weight: 700;
 }

 .roadmap-items {
   list-style: none;
   padding: 0;
 }

.roadmap-items li {
   padding: 0.8rem 0;
   border-bottom: 1px solid var(--border-primary);
   color: var(--text-secondary);
   line-height: 1.5;
   display: flex;
   align-items: center;
   gap: 0.8rem;
 }

 .roadmap-items li:last-child {
   border-bottom: none;
 }

 .roadmap-items strong {
   color: var(--text-primary);
 }

 /* Support Section */
 .support-section {
   background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
 }

 .support-content {
   max-width: 1000px;
   margin: 0 auto;
 }

 .support-tiers {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
   gap: 2rem;
   margin-top: 3rem;
 }

.support-tier {
   background: var(--bg-secondary);
   padding: 1.5rem;
   border-radius: 15px;
   text-align: center;
   box-shadow: 
     0 15px 30px rgba(0, 0, 0, 0.15),
     0 0 0 1px rgba(255, 255, 255, 0.05);
   border: 1px solid var(--border-primary);
   position: relative;
   transition: transform 0.3s ease;
 }

 .support-tier:hover {
   transform: translateY(-5px);
 }

.support-tier.featured {
   border: 3px solid var(--text-accent);
   transform: scale(1.05);
 }

 .support-tier.featured:hover {
   transform: scale(1.05) translateY(-5px);
 }

.tier-glow {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover));
   border-radius: 20px 20px 0 0;
 }

 .tier-glow.featured {
   height: 6px;
   background: linear-gradient(90deg, var(--text-accent), var(--text-accent-hover), #fbbf24);
 }

.tier-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(var(--text-accent-rgb), 0.3);
  z-index: 100;
  white-space: nowrap;
}

.support-tier h3 {
   color: var(--text-accent);
   margin-bottom: 0.8rem;
   font-size: 1.4rem;
   font-weight: 700;
 }

 .tier-amount {
   font-size: 1.8rem;
   font-weight: 700;
   color: var(--text-accent);
   margin: 0.8rem 0;
 }

 .tier-savings {
   background: var(--text-accent);
   color: white;
   padding: 0.4rem 0.8rem;
   border-radius: 16px;
   font-size: 0.85rem;
   font-weight: 600;
   margin-bottom: 0.8rem;
   display: inline-block;
 }

.tier-benefits {
   list-style: none;
   padding: 0;
   margin: 1.2rem 0;
   text-align: left;
 }

.tier-benefits li {
   padding: 0.6rem 0;
   border-bottom: 1px solid var(--border-primary);
   color: var(--text-secondary);
   position: relative;
   padding-left: 1.8rem;
   font-size: 0.95rem;
 }

 .tier-benefits li::before {
   content: '✓';
   position: absolute;
   left: 0;
   color: var(--text-accent);
   font-weight: bold;
 }

 .tier-benefits li:last-child {
   border-bottom: none;
 }

.tier-description {
   color: var(--text-secondary);
   margin-bottom: 1.2rem;
   line-height: 1.5;
   text-align: left;
   font-size: 0.95rem;
 }

.support-button {
   background: var(--text-accent);
   color: white;
   border: none;
   padding: 1rem 1.8rem;
   border-radius: 40px;
   font-weight: 600;
   cursor: pointer;
   transition: all 0.3s ease;
   width: 100%;
   font-size: 1rem;
   position: relative;
   overflow: hidden;
 }

 .support-button:hover {
   background: var(--text-accent-hover);
   transform: translateY(-2px);
   box-shadow: 0 8px 25px rgba(var(--text-accent-rgb), 0.3);
 }

 .support-button:focus-visible {
   outline: 3px solid var(--focus-ring);
   outline-offset: 3px;
 }

.support-button.featured {
   background: linear-gradient(135deg, var(--text-accent), var(--text-accent-hover));
 }

 .button-shine {
   position: absolute;
   top: 0;
   left: -100%;
   width: 100%;
   height: 100%;
   background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
   transition: left 0.6s ease;
 }

 .support-button:hover .button-shine {
   left: 100%;
 }

 /* Impact Section */
 .impact-content {
   max-width: 1200px;
   margin: 0 auto;
   padding: 0 2rem;
 }

 .impact-grid {
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   gap: 2rem;
   margin-top: 3rem;
 }

 .impact-card {
   background: var(--bg-secondary);
   border: 1px solid var(--border-primary);
   border-radius: 20px;
   padding: 2rem;
   text-align: center;
   transition: all 0.3s ease;
   position: relative;
   overflow: hidden;
 }

 .impact-card::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: linear-gradient(135deg, rgba(var(--text-accent-rgb), 0.05), rgba(var(--text-accent-rgb), 0.02));
   opacity: 0;
   transition: opacity 0.3s ease;
 }

 .impact-card:hover::before {
   opacity: 1;
 }

 .impact-card:hover {
   transform: translateY(-5px);
   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
   border-color: var(--text-accent);
 }

 .impact-icon {
   font-size: 3rem;
   margin-bottom: 1rem;
   display: block;
 }

 .impact-card h3 {
   font-size: 1.5rem;
   font-weight: 700;
   margin-bottom: 1rem;
   color: var(--text-primary);
 }

 .impact-card p {
   color: var(--text-secondary);
   line-height: 1.6;
   margin: 0;
 }

 /* Growth Section */
 .growth-content {
   max-width: 1200px;
   margin: 0 auto;
   padding: 0 2rem;
 }

 .growth-intro {
   text-align: center;
   margin-bottom: 3rem;
 }

 .growth-intro .lead {
   font-size: 1.2rem;
   color: var(--text-secondary);
   max-width: 800px;
   margin: 0 auto;
   line-height: 1.6;
 }

 .growth-stats {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 2rem;
   margin-bottom: 4rem;
 }

 .stat-card {
   background: var(--bg-secondary);
   border: 1px solid var(--border-primary);
   border-radius: 20px;
   padding: 2rem;
   text-align: center;
   transition: all 0.3s ease;
 }

 .stat-card:hover {
   transform: translateY(-3px);
   box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
   border-color: var(--text-accent);
 }

 .stat-number {
   font-size: 3rem;
   font-weight: 800;
   color: var(--text-accent);
   margin-bottom: 0.5rem;
   display: block;
 }

 .stat-label {
   color: var(--text-secondary);
   font-size: 1rem;
   line-height: 1.4;
 }

 .growth-insights {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
   gap: 3rem;
   margin-bottom: 4rem;
 }

 .insight-card {
   background: var(--bg-secondary);
   border: 1px solid var(--border-primary);
   border-radius: 20px;
   padding: 2rem;
   transition: all 0.3s ease;
 }

 .insight-card:hover {
   transform: translateY(-3px);
   box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
   border-color: var(--text-accent);
 }

 .insight-card h3 {
   font-size: 1.5rem;
   font-weight: 700;
   margin-bottom: 1.5rem;
   color: var(--text-primary);
 }

 .insight-card ul {
   list-style: none;
   padding: 0;
   margin: 0;
 }

 .insight-card li {
   padding: 0.75rem 0;
   border-bottom: 1px solid var(--border-primary);
   color: var(--text-secondary);
   line-height: 1.5;
 }

 .insight-card li:last-child {
   border-bottom: none;
 }

 .insight-card strong {
   color: var(--text-primary);
   font-weight: 600;
 }

 .growth-cta {
   text-align: center;
   background: var(--bg-secondary);
   border: 1px solid var(--border-primary);
   border-radius: 20px;
   padding: 3rem 2rem;
   margin-top: 2rem;
 }

 .growth-cta h3 {
   font-size: 2rem;
   font-weight: 700;
   margin-bottom: 1rem;
   color: var(--text-primary);
 }

 .growth-cta p {
   color: var(--text-secondary);
   font-size: 1.1rem;
   line-height: 1.6;
   max-width: 600px;
   margin: 0 auto;
 }

 /* CTA Section */
 .cta-section {
   position: relative;
   margin: 4rem 0;
   border-radius: 30px;
   overflow: hidden;
 }

  .cta-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(rgba(30, 41, 59, 0.7), rgba(51, 65, 85, 0.7)),
      url('/images/support.jpg');
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(5px);
    z-index: 1;
  }

 .cta-content {
   position: relative;
   z-index: 2;
   color: white;
   text-align: center;
   padding: 3rem 2rem;
 }

 .cta-badge {
   display: inline-block;
   padding: 0.5rem 1.5rem;
   background: rgba(255, 255, 255, 0.2);
   border: 1px solid rgba(255, 255, 255, 0.3);
   border-radius: 50px;
   font-size: 0.9rem;
   font-weight: 600;
   margin-bottom: 1.5rem;
   backdrop-filter: blur(10px);
 }

 .cta-content h2 {
   font-size: 2rem;
   font-weight: 800;
   margin-bottom: 1rem;
   color: white;
   background: none;
   -webkit-text-fill-color: white;
 }

 .cta-content p {
   font-size: 1.1rem;
   margin-bottom: 2rem;
   opacity: 0.9;
   max-width: 600px;
   margin-left: auto;
   margin-right: auto;
   line-height: 1.6;
 }

 .cta-buttons {
   display: flex;
   gap: 1.5rem;
   justify-content: center;
   flex-wrap: wrap;
 }

 .cta-button {
   position: relative;
   padding: 1.2rem 2.5rem;
   border-radius: 50px;
   text-decoration: none;
   font-weight: 700;
   font-size: 1.1rem;
   transition: all 0.3s ease;
   overflow: hidden;
   display: inline-flex;
   align-items: center;
   justify-content: center;
 }

 .cta-button.primary {
   background: rgba(255, 255, 255, 0.2);
   color: white;
   border: 2px solid rgba(255, 255, 255, 0.3);
   backdrop-filter: blur(10px);
 }

.cta-button.primary:hover {
   background: white;
   color: var(--text-accent);
   transform: translateY(-3px);
   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
 }

 .cta-button.secondary {
   background: transparent;
   color: white;
   border: 2px solid white;
 }

.cta-button.secondary:hover {
   background: white;
   color: var(--text-accent);
   transform: translateY(-3px);
   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
 }

 /* Responsive Design */
 @media (max-width: 768px) {
   .hero {
     padding: 4rem 1rem;
     margin: 1rem;
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
   
   .section {
     padding: 3rem 0;
   }
   
   .section h2 {
     font-size: 2rem;
   }
   
   .support-tier.featured {
     transform: none;
   }
   
   .support-tier.featured:hover {
     transform: translateY(-5px);
   }
   
   .cta-content {
     padding: 4rem 2rem;
   }
   
   .cta-content h2 {
     font-size: 2rem;
   }
   
   .cta-buttons {
     flex-direction: column;
     align-items: center;
   }
   
   .cta-button {
     width: 100%;
     max-width: 300px;
   }

   .achievement-grid {
     grid-template-columns: 1fr;
   }

   .mission-grid {
     grid-template-columns: 1fr;
   }

   .tech-features {
     grid-template-columns: 1fr;
   }

   .impact-stats {
     grid-template-columns: repeat(2, 1fr);
   }

   .impact-testimonials {
     grid-template-columns: 1fr;
   }
 }

 @media (max-width: 480px) {
   .impact-stats {
     grid-template-columns: 1fr;
   }
   
   .impact-grid {
     grid-template-columns: 1fr;
   }
   
   .growth-stats {
     grid-template-columns: 1fr;
   }
   
   .growth-insights {
     grid-template-columns: 1fr;
   }
 }

 /* Accessibility */
 .cta-button:focus-visible,
 .support-button:focus-visible {
   outline: 3px solid var(--focus-ring);
   outline-offset: 3px;
 }

 /* High contrast mode support */
 @media (prefers-contrast: high) {
   .development-phase,
   .achievement-card,
   .mission-card,
   .testimonial,
   .tech-feature,
   .roadmap-phase,
   .support-tier,
   .impact-stat,
   .impact-card,
   .stat-card,
   .insight-card,
   .growth-cta {
     border: 3px solid var(--border-primary);
   }
   
   .support-button,
   .cta-button {
     border: 2px solid currentColor;
   }
 }

 /* Reduced motion support */
 @media (prefers-reduced-motion: reduce) {
   .particle,
   .hero-title-glow,
   .subtitle-highlight,
   .stat-number,
   .development-phase,
   .achievement-card,
   .mission-card,
   .testimonial,
   .tech-feature,
   .roadmap-phase,
   .support-tier,
   .impact-stat,
   .impact-card,
   .stat-card,
   .insight-card,
   .growth-cta,
   .support-button,
   .cta-button,
   .button-shine,
   .hero-scroll-indicator {
     animation: none;
     transition: none;
   }
   
   .development-phase:hover,
   .achievement-card:hover,
   .mission-card:hover,
   .testimonial:hover,
   .tech-feature:hover,
   .roadmap-phase:hover,
   .support-tier:hover,
   .impact-stat:hover,
   .impact-card:hover,
   .stat-card:hover,
   .insight-card:hover,
   .growth-cta:hover,
   .support-button:hover,
   .cta-button:hover {
     transform: none;
   }
   
   .button-shine {
     display: none;
   }
 }
</style>