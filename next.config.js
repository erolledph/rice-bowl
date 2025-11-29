/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
})

module.exports = withPWA({
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
		formats: ['image/avif', 'image/webp'],
	},
	// Headers for caching and security
	async headers() {
		return [
			// Cache static assets for 1 year
			{
				source: '/images/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			// Cache fonts
			{
				source: '/fonts/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			// Cache service worker
			{
				source: '/sw.js',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=0, must-revalidate',
					},
				],
			},
			// Cache HTML pages (recipes)
			{
				source: '/recipe/:slug',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, s-maxage=86400, stale-while-revalidate=604800',
					},
				],
			},
			// Cache API responses
			{
				source: '/api/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, s-maxage=300, stale-while-revalidate=600',
					},
				],
			},
			// Security headers
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
				],
			},
		]
	},
	// Redirects for SEO
	async redirects() {
		return [
			{
				source: '/sitemap',
				destination: '/api/sitemap.xml',
				permanent: true,
			},
		]
	},
	// Rewrite sitemap
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: '/sitemap.xml',
					destination: '/api/sitemap.xml',
				},
			],
		}
	},
})
