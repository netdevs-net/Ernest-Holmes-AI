#!/bin/bash

# Quick SEO Registration Script for Holmes AI
# This script helps quickly register the site with major search engines

echo "🚀 Quick SEO Registration for Holmes AI"
echo "========================================"

# Configuration
DOMAIN="https://holmesai.com"
SITEMAP_URL="$DOMAIN/sitemap.xml"
NEWS_SITEMAP_URL="$DOMAIN/news-sitemap.xml"

echo "📋 Registration URLs for manual submission:"
echo ""
echo "🔍 Google Search Console:"
echo "   https://search.google.com/search-console"
echo "   Add property: $DOMAIN"
echo "   Submit sitemap: $SITEMAP_URL"
echo ""

echo "🔍 Bing Webmaster Tools:"
echo "   https://www.bing.com/webmasters"
echo "   Add site: $DOMAIN"
echo "   Submit sitemap: $SITEMAP_URL"
echo ""

echo "🔍 Yandex Webmaster:"
echo "   https://webmaster.yandex.com"
echo "   Add site: $DOMAIN"
echo "   Submit sitemap: $SITEMAP_URL"
echo ""

echo "🔍 DuckDuckGo:"
echo "   https://duckduckgo.com/feedback.html"
echo "   Submit: $DOMAIN"
echo ""

echo "📡 Direct Sitemap Submission URLs:"
echo ""
echo "Google:"
echo "https://www.google.com/ping?sitemap=$SITEMAP_URL"
echo ""

echo "Bing:"
echo "https://www.bing.com/ping?sitemap=$SITEMAP_URL"
echo ""

echo "Yandex:"
echo "https://blogs.yandex.com/pings/?status=success&url=$SITEMAP_URL"
echo ""

echo "🔗 Social Media Registration:"
echo ""
echo "Facebook:"
echo "   https://developers.facebook.com/tools/debug/"
echo "   Enter URL: $DOMAIN"
echo ""

echo "Twitter:"
echo "   https://cards-dev.twitter.com/validator"
echo "   Enter URL: $DOMAIN"
echo ""

echo "LinkedIn:"
echo "   https://www.linkedin.com/post-inspector/"
echo "   Enter URL: $DOMAIN"
echo ""

echo "📊 Analytics Setup:"
echo ""
echo "Google Analytics:"
echo "   https://analytics.google.com"
echo "   Create property for: $DOMAIN"
echo ""

echo "Google Tag Manager:"
echo "   https://tagmanager.google.com"
echo "   Create container for: $DOMAIN"
echo ""

echo "🎯 Quick Actions:"
echo ""
echo "1. Submit sitemap to Google:"
echo "   curl 'https://www.google.com/ping?sitemap=$SITEMAP_URL'"
echo ""

echo "2. Submit sitemap to Bing:"
echo "   curl 'https://www.bing.com/ping?sitemap=$SITEMAP_URL'"
echo ""

echo "3. Test robots.txt:"
echo "   curl '$DOMAIN/robots.txt'"
echo ""

echo "4. Test sitemap:"
echo "   curl '$SITEMAP_URL'"
echo ""

echo "✅ Quick registration complete!"
echo ""
echo "Next steps:"
echo "1. Manually submit to Google Search Console"
echo "2. Manually submit to Bing Webmaster Tools"
echo "3. Set up Google Analytics"
echo "4. Monitor indexing progress"
echo "5. Submit to additional directories" 