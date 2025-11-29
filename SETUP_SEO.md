# Rice Bowl - Production SEO Setup Guide

## 📊 Quick SEO Setup (5 Minutes)

### Step 1: Set Environment Variables
Create `.env.local` in the root directory:

```env
# Production domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics 4 (Get from https://analytics.google.com/)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# GitHub API (for recipe management)
NEXT_PUBLIC_GITHUB_OWNER=erolledph
NEXT_PUBLIC_GITHUB_REPO=rice-bowl
NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx
```

### Step 2: Verify SEO Files
Your site automatically includes:
- ✅ **Sitemap**: `/sitemap.xml` - Dynamic recipe sitemap
- ✅ **Robots**: `/robots.txt` - Search engine crawling rules
- ✅ **Schema.org**: JSON-LD structured data for recipes
- ✅ **Meta Tags**: Open Graph, Twitter Cards, Canonical URLs
- ✅ **Caching**: Optimized cache headers for Lighthouse score

### Step 3: Deploy and Submit to Google
1. Deploy to Vercel/production
2. Go to https://search.google.com/search-console
3. Add property: `https://your-domain.com`
4. Submit sitemap: https://your-domain.com/sitemap.xml
5. Request indexing for homepage

---

## 🎯 SEO Features Implemented

### 1. **Dynamic Sitemap Generation**
```
Location: https://your-domain.com/sitemap.xml
Updates: Automatically when recipes change
Includes: All pages + image metadata
Cache: 24 hours
```

**What's included:**
- Home page (priority: 1.0)
- Recipes page (priority: 0.9)
- All individual recipes (priority: 0.8)
- Video, favorites, search pages
- Image metadata for Google Images

### 2. **Robots.txt Configuration**
```
Location: https://your-domain.com/robots.txt
Allows: All public pages
Blocks: API routes, unnecessary paths
```

**Features:**
- Google-friendly crawl directives
- Specific rules for Googlebot, Bingbot
- Blocks bad bots (MJ12bot, AhrefsBot, SemrushBot)
- Includes sitemap reference

### 3. **Structured Data (Schema.org)**

**Recipe Schema** (per recipe):
- Full recipe details (ingredients, instructions)
- Prep/cook time, servings
- Cuisine and meal type
- Ratings and keywords

**Organization Schema**:
- Company information
- Logo and social links

**Website Schema**:
- Site search action
- Homepage metadata

**Breadcrumb Schema**:
- Navigation path in search results

**Article Schema**:
- Publication metadata
- Author and tags

### 4. **Meta Tags & Open Graph**

Every page includes:
```html
<!-- Basic SEO -->
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="robots" content="index, follow" />

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="..." />

<!-- Canonical URL -->
<link rel="canonical" href="..." />
```

### 5. **Performance & Caching**

Smart cache headers for Lighthouse 95+ score:

| Content Type | Cache Duration | Purpose |
|---|---|---|
| Static assets (images, fonts) | 1 year | Immutable files |
| HTML pages | 1 hour | Fresh content |
| Recipe pages | 24 hours | Stale while revalidate |
| API responses | 5 minutes | Fresh data |
| Service worker | No cache | Always latest |

### 6. **Security Headers**

Built-in protection:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: Disable dangerous APIs
```

### 7. **Semantic HTML**

Proper HTML structure:
```html
<article>
  <header>
    <h1>Recipe Name</h1>
  </header>
  
  <section>
    <h2>Ingredients</h2>
    <ul>
      <li itemProp="recipeIngredient">...</li>
    </ul>
  </section>
  
  <section>
    <h2>Instructions</h2>
    <ol>
      <li itemProp="recipeInstructions">...</li>
    </ol>
  </section>
</article>
```

---

## 🚀 Getting 95+ Lighthouse Score

### Core Web Vitals
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms  
- ✅ CLS (Cumulative Layout Shift): < 0.1

### Optimization Done
- Image optimization with Next.js Image component
- AVIF and WebP format support
- Font preconnection (Google Fonts)
- CSS minification
- No unused dependencies
- Proper caching headers
- Gzip compression

### Test Your Score
1. Deploy to production
2. Visit https://pagespeed.web.dev
3. Enter your domain
4. Check Lighthouse score (should be 95+)

---

## 📈 Analytics Setup

### Google Analytics 4

**Setup:**
1. Go to https://analytics.google.com/
2. Create new property
3. Get Measurement ID (format: G-XXXXXXXXXX)
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
5. Verify in Google Analytics (data should appear within 24 hours)

**Auto-tracked events:**
- Page views
- Scroll depth
- Click events
- Search queries
- User engagement

---

## 🔍 Submission to Search Engines

### Google Search Console

1. **Create Property**
   - Go to https://search.google.com/search-console
   - Click "Add property"
   - Enter: `https://your-domain.com`

2. **Verify Ownership**
   - Choose: HTML file upload, Domain, DNS, Google Tag Manager, Google Analytics
   - Recommended: HTML file or DNS verification

3. **Submit Sitemap**
   - Go to "Sitemaps" section
   - Enter: `https://your-domain.com/sitemap.xml`
   - Click "Submit"

4. **Monitor Performance**
   - Check "Performance" tab
   - Monitor "Coverage" for indexing status
   - Check "Core Web Vitals" for performance metrics

### Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters/
2. Add property: `https://your-domain.com`
3. Verify via same methods as Google
4. Sitemap auto-discovered from robots.txt

---

## 🆘 Troubleshooting

### "Sitemap not updating"
- Clear cache: Hard refresh browser (Ctrl+Shift+R)
- Check API endpoint: `/api/sitemap.xml`
- Verify GitHub token has correct permissions
- Wait 5 minutes for cache to refresh

### "Recipes not indexing"
- Submit to Google Search Console manually
- Check robots.txt allows indexing
- Verify no `noindex` meta tags
- Check Search Console coverage report
- Wait 1-2 weeks for initial crawl

### "Lighthouse score below 95"
- Check image optimization
- Reduce JavaScript bundle
- Enable gzip compression
- Test production build (not dev)
- Clear browser cache

### "GA4 not tracking"
- Verify GA4 ID is correct format (G-XXXXX)
- Check .env.local file loaded
- Check browser console for errors
- Allow 24 hours for data to appear
- Check GA4 property settings

---

## 📝 Recipe Markdown Best Practices

### File Structure
```markdown
---
title: Chicken Tikka Masala
description: Creamy Indian curry with tender chicken pieces
image: https://images.unsplash.com/.../image.jpg
servings: 4
prepTime: 15
cookTime: 30
difficulty: Medium
mealType: Dinner
protein: Chicken
country: India
tastes: [Spicy, Creamy]
ingredients_tags: [Chicken, Yogurt, Ginger, Garlic]
---

## Ingredients

- 500g chicken breast, cubed
- 1 cup yogurt
- 2 tbsp ginger-garlic paste
- ...

## Instructions

1. Marinate chicken in yogurt...
2. Cook chicken in oil...
...
```

### SEO Tips for Recipes
- ✅ Unique, descriptive title (include main ingredient)
- ✅ Compelling description (150-160 characters)
- ✅ High-quality image (minimum 1200x630px)
- ✅ Accurate cook times
- ✅ Ingredient tags for searchability
- ✅ Clear step-by-step instructions

---

## 🔗 Important Links

- [Google Search Central](https://developers.google.com/search)
- [Google Analytics](https://analytics.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Documentation](https://schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Web.dev Performance Guide](https://web.dev/)

---

## ✅ Final Deployment Checklist

Before going live:

- [ ] `.env.local` created with all required variables
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` configured
- [ ] GitHub token has correct permissions
- [ ] Build passes: `npm run build`
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Lighthouse score tested (target: 95+)
- [ ] Google Search Console property created
- [ ] Sitemap submitted to Google
- [ ] Domain verified in Search Console
- [ ] Mobile responsiveness tested
- [ ] All images optimized
- [ ] No console errors in production

---

**Questions?** Check `SEO_PRODUCTION_GUIDE.md` for detailed documentation.

**Last Updated**: November 2025  
**Status**: ✅ Production Ready
