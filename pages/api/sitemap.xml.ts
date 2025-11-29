/**
 * Sitemap generation for Next.js
 * Generates dynamic sitemap.xml for all recipes and static pages
 */

import { NextApiRequest, NextApiResponse } from 'next'

function escapeXml(unsafe: string) {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case '<':
				return '&lt;'
			case '>':
				return '&gt;'
			case '&':
				return '&amp;'
			case "'":
				return '&apos;'
			case '"':
				return '&quot;'
			default:
				return c
		}
	})
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rice-bowl.vercel.app'

		// Fetch recipes from API
		const recipesResponse = await fetch(`${baseUrl}/api/recipes`)
		const recipes = await recipesResponse.ok ? await recipesResponse.json() : []

		// Static pages with their priorities and change frequencies
		const staticPages = [
			{
				url: '/',
				changefreq: 'daily',
				priority: '1.0',
				lastmod: new Date().toISOString().split('T')[0],
			},
			{
				url: '/recipes',
				changefreq: 'daily',
				priority: '0.9',
				lastmod: new Date().toISOString().split('T')[0],
			},
			{
				url: '/videos',
				changefreq: 'weekly',
				priority: '0.7',
				lastmod: new Date().toISOString().split('T')[0],
			},
			{
				url: '/favorites',
				changefreq: 'weekly',
				priority: '0.5',
				lastmod: new Date().toISOString().split('T')[0],
			},
			{
				url: '/search',
				changefreq: 'daily',
				priority: '0.8',
				lastmod: new Date().toISOString().split('T')[0],
			},
		]

		// Build sitemap XML
		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${staticPages
		.map(
			(page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
		)
		.join('')}
  ${recipes
		.map(
			(recipe: any) => `
  <url>
    <loc>${baseUrl}/recipe/${escapeXml(recipe.slug)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${escapeXml(recipe.image)}</image:loc>
      <image:title>${escapeXml(recipe.name)}</image:title>
    </image:image>
  </url>
`
		)
		.join('')}
</urlset>`

		// Cache the sitemap for 24 hours
		res.setHeader('Content-Type', 'application/xml; charset=utf-8')
		res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800')
		res.write(sitemapXml)
		res.end()
	} catch (error) {
		console.error('Sitemap generation error:', error)
		res.status(500).json({ error: 'Failed to generate sitemap' })
	}
}
