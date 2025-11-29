# SEO & Production Configuration Guide

## 🚀 Quick Start for Production

### 1. Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics 4
# Get your ID from: https://analytics.google.com/
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# GitHub Configuration (for recipe management)
NEXT_PUBLIC_GITHUB_OWNER=your-username
NEXT_PUBLIC_GITHUB_REPO=your-repo-name
NEXT_PUBLIC_GITHUB_TOKEN=your-github-token

# YouTube API (for video search)
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
```

### 2. Setup Google Analytics 4 (GA4)

1. Go to https://analytics.google.com/
2. Create a new property for your website
3. Get your Measurement ID (starts with G-)
4. Add to `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` in `.env.local`
5. Verify in Google Search Console: https://search.google.com/search-console

### 3. Verify Sitemap and Robots

- **Sitemap**: Visit `https://your-domain.com/sitemap.xml`
- **Robots**: Visit `https://your-domain.com/robots.txt`
- Submit sitemap to Google Search Console

## 📊 SEO Features Implemented

### ✅ Sitemap Generation
- Dynamic XML sitemap at `/sitemap.xml`
- Automatically includes all recipes and static pages
- Updates daily with recipe changes
- Includes image metadata for Google Images

### ✅ Robots.txt Configuration
- Proper crawling directives for search engines
- Blocks unnecessary paths (/api/, /_next/)
- Allows image indexing
- Blocks aggressive bots (MJ12bot, AhrefsBot, etc.)
- Sitemap reference included

### ✅ Structured Data (Schema.org)
- **Recipe Schema**: Full recipe structured data including:
  - Ingredients, instructions, prep/cook time
  - Yield, cuisine type, meal category
  - Aggregate ratings
  
- **Organization Schema**: Company information for SERP display
- **Website Schema**: Site-wide search action support
- **Breadcrumb Schema**: Navigation path in search results
- **Article Schema**: Recipe article metadata

### ✅ Meta Tags & Open Graph
- Comprehensive meta tags for all pages
- Open Graph tags for social sharing (Facebook, LinkedIn)
- Twitter Card tags for Twitter sharing
- Canonical URLs to prevent duplicate content
- Proper viewport and device settings

### ✅ Caching Strategy
```
Static Assets (Images, Fonts): 1 year
HTML Pages: 1 hour
Recipe Pages: 24 hours
API Responses: 5 minutes
Service Worker: No cache (always fresh)
```

### ✅ Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Disable dangerous APIs

### ✅ Image Optimization
- Next.js Image component for automatic optimization
- AVIF and WebP format support
- Responsive image serving
- Lazy loading enabled

### ✅ Semantic HTML
- Proper heading hierarchy (h1, h2, h3...)
- `<article>` tags for recipe content
- `<section>` tags for content sections
- `<header>` tags for recipe headers
- Proper `<meta>` tag organization
- ARIA labels for accessibility

## 📈 Performance Optimization for 95+ Lighthouse Score

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
  - Optimized image loading with Next.js Image
  - Minimized CSS
  
- **First Input Delay (FID)**: < 100ms
  - No render-blocking JavaScript
  - Optimized event handlers
  
- **Cumulative Layout Shift (CLS)**: < 0.1
  - Reserved space for images
  - No dynamic content insertion

### Implementation Checklist
- ✅ Images use Next.js Image component
- ✅ Fonts preconnected (Google Fonts)
- ✅ DNS prefetch for analytics
- ✅ Gzip compression enabled
- ✅ Minified CSS/JS
- ✅ No unused dependencies

## 🔍 SEO Best Practices for Recipe Posts

### When Creating a New Recipe Post

1. **File Naming**: Use kebab-case (e.g., `chicken-tikka-masala.md`)
2. **Title**: Clear, descriptive, include main ingredient
3. **Description**: 150-160 characters, compelling
4. **Metadata**:
   ```yaml
   title: Chicken Tikka Masala
   description: Creamy, aromatic Indian curry with tender chicken pieces
   image: https://images.unsplash.com/...
   servings: 4
   prepTime: 15
   cookTime: 30
   difficulty: Medium
   mealType: Dinner
   protein: Chicken
   country: India
   tastes: [Spicy, Creamy, Aromatic]
   ingredients_tags: [Chicken, Yogurt, Ginger, Garlic, Tomato]
   ```

5. **URL Structure**: Automatically derived from filename
   - ✅ `/recipe/chicken-tikka-masala`
   - ❌ `/recipe/recipe-123`

6. **Content**: Include:
   - High-quality hero image
   - Comprehensive ingredients list
   - Step-by-step instructions
   - Helpful tips and variations

## 📊 Monitoring & Analytics

### Google Search Console Setup
1. Visit https://search.google.com/search-console
2. Add property: `https://your-domain.com`
3. Verify ownership via DNS or HTML file
4. Submit your sitemap
5. Monitor:
   - Indexing status
   - Search performance
   - Mobile usability
   - Core Web Vitals

### Google Analytics 4 Tracking
- Auto-tracked events:
  - Page views
  - Click events
  - Search queries
  - Favorite toggles (custom)

### Build & Deployment Verification
Before deploying to production:

```bash
# 1. Build locally
npm run build

# 2. Test production build
npm run start

# 3. Check lighthouse score
# Use DevTools Lighthouse tab or https://pagespeed.web.dev

# 4. Verify sitemap generation
curl https://localhost:3000/sitemap.xml

# 5. Check robots.txt
curl https://localhost:3000/robots.txt
```

## 🚀 Deployment Checklist

Before going live:

- [ ] Environment variables configured (.env.local)
- [ ] Google Analytics ID added
- [ ] NEXT_PUBLIC_SITE_URL set to production domain
- [ ] All recipes have proper frontmatter
- [ ] Images optimized and accessible
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt
- [ ] Google Search Console property created
- [ ] Sitemap submitted to Google
- [ ] Mobile responsiveness tested
- [ ] Lighthouse score: 95+
- [ ] No console errors in production

## 📝 Recipe Markdown Template

```markdown
---
title: Recipe Name
description: Short description for search results
image: https://images.unsplash.com/...
servings: 4
prepTime: 15
cookTime: 30
difficulty: Medium
mealType: Dinner
protein: Chicken
country: Country Name
tastes: [Spicy, Savory]
ingredients_tags: [Ingredient1, Ingredient2]
---

## Ingredients

- Ingredient 1 with quantity
- Ingredient 2 with quantity

## Instructions

1. First step
2. Second step
```

## 🔗 Useful Resources

- [Google Search Central](https://developers.google.com/search)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev Performance Guide](https://web.dev/)
- [Google PageSpeed Insights](https://pagespeed.web.dev)

## 🆘 Troubleshooting

### Sitemap not updating
- Check if `/api/sitemap.xml` is accessible
- Verify recipes are being fetched correctly
- Check GitHub token permissions

### Google not indexing recipes
- Submit sitemap to Google Search Console
- Check robots.txt allows indexing
- Verify no noindex meta tags
- Wait 1-2 weeks for initial crawl

### Lighthouse score below 95
- Check image optimization
- Reduce JavaScript bundle size
- Enable compression
- Optimize fonts loading
- Use production build for testing

---

**Last Updated**: November 2025
**Version**: 1.0.0
