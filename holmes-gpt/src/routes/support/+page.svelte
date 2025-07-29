<script>
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <title>Support Holmes AI - Help Preserve Ernest Holmes' Legacy</title>
  <meta name="description" content="Support Holmes AI and help us preserve Ernest Holmes' wisdom for future generations. Your contribution makes authentic spiritual guidance accessible to all." />
</svelte:head>

<div class="support-page">
  <Header />
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1>Support Holmes AI</h1>
      <p class="hero-subtitle">Help Preserve Ernest Holmes' Legacy for Future Generations</p>
    </div>
  </section>

  <div class="container">
    <!-- Overview Section -->
    <section class="section">
      <h2>Why Support Holmes AI?</h2>
      <div class="overview-content">
        <p class="lead">
          Holmes AI represents a groundbreaking effort to preserve and perpetuate the authentic wisdom of Ernest Holmes 
          through cutting-edge artificial intelligence technology.
        </p>
        <p>
          Since our launch, we've helped thousands of spiritual seekers access Ernest Holmes' teachings in a way that 
          feels personal, immediate, and transformative. Your support ensures this vital spiritual resource remains 
          accessible to all who seek it.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section">
      <h2>Our Mission</h2>
      <div class="mission-content">
        <div class="mission-text">
          <h3>Preserving Authentic Wisdom</h3>
          <p>
            Ernest Holmes' teachings have touched millions of lives, offering practical spiritual wisdom that transcends 
            time and culture. Our mission is to ensure his authentic voice and teachings remain accessible to spiritual 
            seekers worldwide through innovative AI technology.
          </p>
          
          <h3>Making Wisdom Accessible</h3>
          <p>
            We believe spiritual guidance should be available to everyone, regardless of location, time, or financial means. 
            Holmes AI provides 24/7 access to Ernest Holmes' wisdom, making authentic spiritual guidance available whenever 
            it's needed most.
          </p>
          
          <h3>Advancing Spiritual Technology</h3>
          <p>
            We're pioneering the intersection of spirituality and artificial intelligence, developing technologies that 
            preserve the authenticity and effectiveness of traditional spiritual practices while making them accessible 
            in the digital age.
          </p>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="section">
      <h2>Our Impact</h2>
      <div class="impact-content">
        <div class="impact-stats">
          <div class="impact-stat">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Spiritual Conversations</span>
          </div>
          <div class="impact-stat">
            <span class="stat-number">5,000+</span>
            <span class="stat-label">Treatments Generated</span>
          </div>
          <div class="impact-stat">
            <span class="stat-number">100%</span>
            <span class="stat-label">Authentic Voice</span>
          </div>
        </div>
        
        <div class="impact-testimonials">
          <blockquote class="testimonial">
            "Holmes AI has been a constant source of spiritual guidance in my life. It's like having Ernest Holmes 
            available whenever I need wisdom and comfort."
            <cite>- Sarah M., Spiritual Practitioner</cite>
          </blockquote>
          
          <blockquote class="testimonial">
            "The authenticity of the responses is remarkable. It truly feels like I'm conversing with Ernest Holmes himself."
            <cite>- Michael R., Religious Science Minister</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="section">
      <h2>Our Technology</h2>
      <div class="tech-content">
        <p class="lead">
          Holmes AI uses cutting-edge artificial intelligence technology to provide authentic spiritual guidance 
          that maintains the integrity and effectiveness of Ernest Holmes' teachings.
        </p>
        
        <div class="tech-features">
          <div class="tech-feature">
            <h3>Advanced AI Training</h3>
            <p>
              Our AI is trained on Ernest Holmes' complete works, including over 463,000 words from his core texts, 
              ensuring authentic responses that reflect his true voice and teachings.
            </p>
          </div>
          
          <div class="tech-feature">
            <h3>Dual Response Modes</h3>
            <p>
              Users can choose between "In His Words" mode for the authentic Ernest Holmes experience, or "Modern" 
              mode for contemporary accessibility.
            </p>
          </div>
          
          <div class="tech-feature">
            <h3>Treatment Generator</h3>
            <p>
              Our AI can generate authentic spiritual treatments and affirmations that maintain the integrity 
              and effectiveness of Ernest Holmes' healing methods.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Section -->
    <section class="section support-section">
      <h2>How You Can Support</h2>
      <div class="support-content">
        <p class="lead">
          Your support helps us maintain and improve Holmes AI, ensuring Ernest Holmes' wisdom remains accessible 
          to spiritual seekers worldwide.
        </p>
        
        <div class="support-tiers">
          <div class="support-tier">
            <h3>Monthly Supporter</h3>
            <div class="tier-amount">$25/month</div>
            <ul class="tier-benefits">
              <li>Helps maintain server costs</li>
              <li>Supports AI model improvements</li>
              <li>Enables new feature development</li>
              <li>Your name in our supporters list</li>
            </ul>
            <button class="support-button">Support Monthly</button>
          </div>
          
          <div class="support-tier featured">
            <h3>Annual Supporter</h3>
            <div class="tier-amount">$250/year</div>
            <div class="tier-savings">Save $50/year</div>
            <ul class="tier-benefits">
              <li>All monthly benefits</li>
              <li>Priority access to new features</li>
              <li>Exclusive supporter updates</li>
              <li>Recognition on our website</li>
            </ul>
            <button class="support-button featured">Support Annually</button>
          </div>
          
          <div class="support-tier">
            <h3>Custom Amount</h3>
            <div class="tier-amount">Any amount</div>
            <p class="tier-description">
              Choose your own amount to support Holmes AI. Every contribution, no matter the size, 
              helps preserve Ernest Holmes' legacy.
            </p>
            <button class="support-button">Custom Support</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="section cta-section">
      <h2>Join Our Mission</h2>
      <p>
        Help us preserve and perpetuate Ernest Holmes' wisdom for future generations. 
        Your support ensures that authentic spiritual guidance remains accessible to all who seek it.
      </p>
      <div class="cta-buttons">
        <a href="/" class="cta-button primary">Try Holmes AI</a>
        <a href="/about" class="cta-button secondary">Learn More</a>
      </div>
    </section>
  </div>
</div>

<style>
  .support-page {
    background: var(--bg-primary);
    min-height: 100vh;
  }

  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 4rem 2rem;
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section {
    padding: 4rem 0;
  }

  .section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text-primary);
  }

  .lead {
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--accent-color);
  }

  .overview-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .mission-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .mission-text h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .mission-text p {
    margin-bottom: 2rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .impact-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 3rem;
  }

  .impact-stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-color);
  }

  .stat-label {
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .impact-testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .testimonial {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 15px;
    font-style: italic;
    position: relative;
  }

  .testimonial::before {
    content: '"';
    font-size: 4rem;
    color: var(--accent-color);
    position: absolute;
    top: -1rem;
    left: 1rem;
  }

  .testimonial cite {
    display: block;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--accent-color);
  }

  .tech-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .tech-feature {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
  }

  .tech-feature h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  .support-section {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  }

  .support-tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .support-tier {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .support-tier.featured {
    border: 3px solid var(--accent-color);
    transform: scale(1.05);
  }

  .tier-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-color);
    margin: 1rem 0;
  }

  .tier-savings {
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .tier-benefits {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
  }

  .tier-benefits li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-primary);
  }

  .tier-benefits li:last-child {
    border-bottom: none;
  }

  .support-button {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .support-button:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }

  .support-button.featured {
    background: var(--accent-color);
  }

  .cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    border-radius: 15px;
    margin: 2rem 0;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .cta-button {
    padding: 1rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 1.1rem;
  }

  .cta-button.primary {
    background: #ffd700;
    color: #333;
  }

  .cta-button.primary:hover {
    background: #ffed4e;
    transform: translateY(-2px);
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-button.secondary:hover {
    background: white;
    color: #667eea;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }

    .impact-stats {
      flex-direction: column;
      gap: 2rem;
    }

    .support-tiers {
      grid-template-columns: 1fr;
    }

    .support-tier.featured {
      transform: none;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
</style> 