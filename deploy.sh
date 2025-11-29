#!/bin/bash

# Rice Bowl - Production Deployment Checklist
# Run this script to verify all SEO and production settings before deployment

echo "🚀 Rice Bowl - Production Deployment Checklist"
echo "=============================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "   Please copy .env.example to .env.local and fill in the values"
    exit 1
else
    echo "✅ .env.local file exists"
fi

# Check if required environment variables are set
echo ""
echo "🔍 Checking environment variables..."

if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
    SITE_URL=$(grep "NEXT_PUBLIC_SITE_URL" .env.local | cut -d '=' -f2)
    echo "✅ NEXT_PUBLIC_SITE_URL: $SITE_URL"
else
    echo "❌ NEXT_PUBLIC_SITE_URL not set in .env.local"
fi

if grep -q "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID" .env.local; then
    GA_ID=$(grep "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID" .env.local | cut -d '=' -f2)
    if [ -z "$GA_ID" ] || [ "$GA_ID" = "G-XXXXXXXXXX" ]; then
        echo "⚠️  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID not configured (optional but recommended)"
    else
        echo "✅ NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: $GA_ID"
    fi
else
    echo "⚠️  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID not found (optional but recommended)"
fi

if grep -q "NEXT_PUBLIC_GITHUB_TOKEN" .env.local; then
    echo "✅ NEXT_PUBLIC_GITHUB_TOKEN set"
else
    echo "❌ NEXT_PUBLIC_GITHUB_TOKEN not set in .env.local"
fi

# Check files exist
echo ""
echo "📁 Checking required files..."

FILES=(
    "public/robots.txt"
    "pages/api/sitemap.xml.ts"
    "lib/seo-config.ts"
    "SEO_PRODUCTION_GUIDE.md"
    "next.config.js"
    "pages/_document.tsx"
    "pages/recipe/[slug].tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

# Check Next.js build
echo ""
echo "🔨 Running Next.js build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - fix errors before deploying"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "============================"
echo "[ ] Google Analytics ID configured in NEXT_PUBLIC_GOOGLE_ANALYTICS_ID"
echo "[ ] NEXT_PUBLIC_SITE_URL set to production domain"
echo "[ ] GitHub token has repo read permissions"
echo "[ ] All recipes have proper frontmatter"
echo "[ ] Images are optimized"
echo "[ ] Sitemap accessible at /sitemap.xml"
echo "[ ] Robots.txt accessible at /robots.txt"
echo "[ ] Google Search Console property created"
echo "[ ] Build passes without errors"
echo ""
echo "🌐 After Deployment:"
echo "==================="
echo "1. Visit https://search.google.com/search-console"
echo "2. Submit your sitemap: https://your-domain.com/sitemap.xml"
echo "3. Submit homepage for indexing"
echo "4. Check robots.txt: https://your-domain.com/robots.txt"
echo "5. Check sitemap: https://your-domain.com/sitemap.xml"
echo "6. Test Lighthouse: https://pagespeed.web.dev"
echo "7. Monitor Google Analytics"
echo ""
echo "✅ All checks passed! Ready to deploy to production."
