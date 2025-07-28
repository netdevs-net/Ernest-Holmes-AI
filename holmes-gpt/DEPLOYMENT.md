# HolmesGPT Deployment Guide

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

**Easiest deployment for MVP:**

1. **Connect Repository**

   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Initial HolmesGPT setup"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `ANTHROPIC_API_KEY`
   - Deploy automatically

3. **Environment Variables**
   ```bash
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

### 2. Netlify

**Alternative easy deployment:**

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.svelte-kit/output/client`
3. **Environment Variables**: Add `ANTHROPIC_API_KEY`

### 3. Railway

**Good for full-stack deployment:**

1. **Connect GitHub repository**
2. **Add environment variables**
3. **Automatic deployment on push**

## 🔧 Manual Deployment

### Prerequisites

- Node.js 18+
- Anthropic API key
- Domain (optional)

### Steps

1. **Build the Application**

   ```bash
   npm run build
   ```

2. **Set Environment Variables**

   ```bash
   export ANTHROPIC_API_KEY=your-api-key-here
   ```

3. **Start Production Server**
   ```bash
   npm run preview
   ```

## 🌐 Production Considerations

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Optional (for future features)
DATABASE_URL=your-database-url
NODE_ENV=production
```

### Performance Optimization

1. **Enable Compression**

   ```javascript
   // vite.config.ts
   export default defineConfig({
     plugins: [sveltekit()],
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ["svelte"],
           },
         },
       },
     },
   });
   ```

2. **Caching Headers**
   ```javascript
   // svelte.config.js
   const config = {
     kit: {
       adapter: adapter(),
       headers: {
         "/*": [
           {
             key: "Cache-Control",
             value: "public, max-age=31536000, immutable",
           },
         ],
       },
     },
   };
   ```

### Security

1. **API Key Protection**
   - Never expose API keys in client-side code
   - Use environment variables
   - Consider API key rotation

2. **Rate Limiting**

   ```javascript
   // Add to API route
   import rateLimit from "express-rate-limit";

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });
   ```

## 📊 Monitoring & Analytics

### Basic Monitoring

- **Vercel Analytics**: Built-in with Vercel deployment
- **Google Analytics**: Add tracking code
- **Error Tracking**: Sentry integration

### Performance Monitoring

```javascript
// Add to app.html
<script>
  // Basic performance monitoring
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Load time:', perfData.loadEventEnd - perfData.loadEventStart);
  });
</script>
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **API Key Issues**
   - Verify environment variable is set
   - Check API key permissions
   - Ensure key is valid

3. **CORS Issues**
   ```javascript
   // Add to API route if needed
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
   ```

### Performance Issues

1. **Slow Loading**
   - Enable compression
   - Optimize images
   - Use CDN for static assets

2. **API Timeouts**
   - Increase timeout limits
   - Implement retry logic
   - Use streaming responses

## 📈 Scaling Considerations

### For High Traffic

1. **Database Integration**
   - Add Supabase/PostgreSQL for chat history
   - Implement user sessions
   - Add conversation persistence

2. **Caching Strategy**
   - Redis for session storage
   - CDN for static assets
   - API response caching

3. **Load Balancing**
   - Multiple server instances
   - Geographic distribution
   - Auto-scaling configuration

## 🔐 Security Checklist

- [ ] Environment variables properly set
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] Error messages sanitized
- [ ] CORS properly configured
- [ ] Security headers set

## 📞 Support

For deployment issues:

1. Check the [SvelteKit documentation](https://kit.svelte.dev/docs)
2. Review [Vercel deployment guide](https://vercel.com/docs)
3. Check [Anthropic API documentation](https://docs.anthropic.com)

---

_Ready to share Holmes' wisdom with the world! 🌟_
