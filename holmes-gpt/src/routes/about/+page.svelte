<script>
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <title>About Holmes AI - The Story Behind the Technology</title>
  <meta name="description" content="Learn about the creation of Holmes AI, our mission to preserve Ernest Holmes' wisdom, and the technology behind authentic spiritual guidance." />
</svelte:head>

<div class="about-page">
  <Header />
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1>About Holmes AI</h1>
      <p class="hero-subtitle">Preserving Ernest Holmes' Wisdom for the Digital Age</p>
    </div>
  </section>

  <div class="container">
    <!-- Mission Section -->
    <section class="section">
      <h2>Our Mission</h2>
      <div class="mission-content">
        <div class="mission-text">
          <p class="lead">
            Holmes AI was born from a deep reverence for Ernest Holmes' teachings and a vision to make his 
            timeless wisdom accessible to spiritual seekers worldwide.
          </p>
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

    <!-- Team Section -->
    <section class="section">
      <h2>Our Team</h2>
      <div class="team-content">
        <p class="lead">
          Holmes AI is developed by a dedicated team of spiritual practitioners, AI researchers, and technology 
          experts who share a deep commitment to preserving Ernest Holmes' legacy.
        </p>
        
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <img src="/images/ryan-iguchi.jpg" alt="Ryan Iguchi" />
            </div>
            <h3>Ryan Iguchi</h3>
            <p class="member-role">Founder & Lead Developer</p>
            <p class="member-bio">
              Ryan is a passionate technologist and spiritual seeker who dedicated months to studying Ernest Holmes' 
              teachings and developing the AI systems that bring his wisdom to life. With expertise in AI, web development, 
              and spiritual technology, Ryan created Holmes AI to make authentic spiritual guidance accessible to everyone.
            </p>
            <div class="member-links">
              <a href="https://NetDevs.net" target="_blank" rel="noopener" class="member-link">
                🌐 NetDevs.net
              </a>
              <a href="https://ryan-iguchi.com" target="_blank" rel="noopener" class="member-link">
                👤 ryan-iguchi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sponsorship Section -->
    <section class="section sponsorship-section">
      <h2>Special Thanks</h2>
      <div class="sponsorship-content">
        <div class="sponsor-card">
          <div class="sponsor-avatar">
            <img src="/images/linda-gauthier.jpg" alt="Linda Gauthier" />
          </div>
          <div class="sponsor-info">
            <h3>Sponsored by Linda Gauthier</h3>
            <p class="sponsor-role">Generous Supporter & Spiritual Practitioner</p>
            <p class="sponsor-message">
              Thank you, Linda, for your generous sponsorship and support of Holmes AI. Your commitment to 
              making spiritual wisdom accessible to all has made this project possible. Your dedication to 
              healing and spiritual growth inspires us all.
            </p>
            <div class="sponsor-links">
              <a href="https://OceanHealing.health" target="_blank" rel="noopener" class="sponsor-link">
                🌊 OceanHealing.health
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="section cta-section">
      <h2>Experience Holmes AI</h2>
      <p>
        Ready to experience authentic spiritual guidance from Ernest Holmes? 
        Start your journey with Holmes AI today.
      </p>
      <div class="cta-buttons">
        <a href="/" class="cta-button primary">Start Chatting</a>
        <a href="/support" class="cta-button secondary">Support Us</a>
      </div>
    </section>
  </div>
</div>

<style>
  .about-page {
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

  .mission-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .team-member {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .member-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 1rem;
    border: 4px solid var(--accent-color);
  }

  .member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .member-role {
    color: var(--accent-color);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .member-bio {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  .member-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .member-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--bg-primary);
    color: var(--accent-color);
    text-decoration: none;
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .member-link:hover {
    background: var(--accent-color);
    color: white;
  }

  .sponsorship-section {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  }

  .sponsor-card {
    background: var(--bg-secondary);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .sponsor-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 6px solid var(--accent-color);
    flex-shrink: 0;
  }

  .sponsor-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sponsor-info {
    flex: 1;
  }

  .sponsor-info h3 {
    color: var(--accent-color);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .sponsor-role {
    color: var(--text-secondary);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .sponsor-message {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  .sponsor-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--accent-color);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .sponsor-link:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
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

    .sponsor-card {
      flex-direction: column;
      text-align: center;
      padding: 2rem;
    }

    .sponsor-avatar {
      width: 120px;
      height: 120px;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
</style> 