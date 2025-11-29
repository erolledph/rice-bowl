import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rice-bowl.vercel.app'

	return (
		<Html lang='en'>
			<Head>
				{/* Character Set and Viewport - MUST be first */}
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover' />

				{/* Primary Meta Tags */}
				<meta name='title' content='Rice Bowl - Discover Delicious Recipes Daily' />
				<meta
					name='description'
					content='Discover delicious recipes from around the world. Daily recipe posts with detailed ingredients, instructions, and cooking tips.'
				/>
				<meta name='keywords' content='recipes, cooking, food, meals, ingredients, cuisine, international recipes' />
				<meta name='author' content='Rice Bowl Team' />
				<meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
				<meta name='googlebot' content='index, follow' />
				<meta name='bingbot' content='index, follow' />

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content={siteUrl} />
				<meta property='og:title' content='Rice Bowl - Discover Delicious Recipes Daily' />
				<meta
					property='og:description'
					content='Explore a collection of recipes from around the world. Daily posts with detailed ingredients and cooking instructions.'
				/>
				<meta property='og:image' content={`${siteUrl}/images/icon-512.png`} />
				<meta property='og:image:width' content='512' />
				<meta property='og:image:height' content='512' />
				<meta property='og:site_name' content='Rice Bowl' />
				<meta property='og:locale' content='en_US' />

				{/* Twitter */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:url' content={siteUrl} />
				<meta name='twitter:title' content='Rice Bowl - Discover Delicious Recipes Daily' />
				<meta
					name='twitter:description'
					content='Explore a collection of recipes from around the world. Daily posts with detailed ingredients and cooking instructions.'
				/>
				<meta name='twitter:image' content={`${siteUrl}/images/icon-512.png`} />
				<meta name='twitter:creator' content='@ricebowlrecipes' />

				{/* Canonical URL */}
				<link rel='canonical' href={siteUrl} />

				{/* Icons and Branding */}
				<link rel='icon' type='image/png' href='/images/favicon.png' />
				<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
				<link rel='manifest' href='/manifest.json' />
				<link rel='sitemap' type='application/xml' href='/sitemap.xml' />

				{/* Theme Color */}
				<meta name='theme-color' content='#fb923c' />
				<meta name='theme-color' content='#18181b' media='(prefers-color-scheme: dark)' />

				{/* PWA and Mobile */}
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
				<meta name='apple-mobile-web-app-title' content='Rice Bowl' />
				<meta name='mobile-web-app-capable' content='yes' />

				{/* Alternative Language Versions */}
				<link rel='alternate' hrefLang='en' href={siteUrl} />

				{/* Preconnect to external resources */}
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
				<link rel='dns-prefetch' href='https://www.google-analytics.com' />

				{/* Google Analytics 4 */}
				{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
						/>
						<script
							dangerouslySetInnerHTML={{
								__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
								page_path: window.location.pathname,
								anonymize_ip: true,
							});
						`,
							}}
						/>
					</>
				)}

				{/* Organization Schema */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'Organization',
							'name': 'Rice Bowl',
							'url': siteUrl,
							'logo': `${siteUrl}/images/icon-512.png`,
							'description': 'Discover delicious recipes from around the world',
							'sameAs': [
								'https://twitter.com/ricebowlrecipes',
								'https://facebook.com/ricebowlrecipes',
							],
						}),
					}}
				/>

				{/* Website Schema for Search */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'WebSite',
							'name': 'Rice Bowl',
							'url': siteUrl,
							'description': 'Discover delicious recipes from around the world',
							'potentialAction': {
								'@type': 'SearchAction',
								'target': {
									'@type': 'EntryPoint',
									'urlTemplate': `${siteUrl}/search?q={search_term_string}`,
								},
								'query-input': 'required name=search_term_string',
							},
						}),
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
