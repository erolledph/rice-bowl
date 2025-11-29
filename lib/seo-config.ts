/**
 * SEO Configuration for Rice Bowl Recipe App
 * Centralized SEO settings for easy maintenance
 */

export const SEO_CONFIG = {
	// Site Information
	siteName: 'Rice Bowl',
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rice-bowl.vercel.app',
	siteDescription: 'Discover delicious recipes from around the world. Daily recipe posts with detailed ingredients, instructions, and cooking tips.',
	author: 'Rice Bowl Team',
	logo: '/images/icon-512.png',

	// Default OG Image
	defaultOgImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=60',

	// Social Media
	socialMedia: {
		twitter: '@ricebowlrecipes',
		facebook: 'ricebowlrecipes',
	},

	// Google Analytics
	googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',

	// Sitemap Configuration
	sitemap: {
		baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rice-bowl.vercel.app',
		changeFreq: 'daily',
		priority: {
			homepage: '1.0',
			recipe: '0.8',
			page: '0.6',
		},
	},

	// Robots Configuration
	robots: {
		index: true,
		follow: true,
		maxSnippet: -1,
		maxImagePreview: 'large',
		maxVideoPreview: -1,
	},

	// Cache Configuration (in seconds)
	cacheControl: {
		static: 31536000, // 1 year for static assets
		html: 3600, // 1 hour for HTML pages
		recipe: 86400, // 24 hours for recipe pages
		api: 300, // 5 minutes for API responses
	},
}

/**
 * Generate structured data for Recipe
 */
export function generateRecipeSchema(recipe: any, baseUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Recipe',
		'@id': `${baseUrl}/recipe/${recipe.slug}`,
		'name': recipe.name,
		'description': recipe.description,
		'image': recipe.image,
		'author': {
			'@type': 'Organization',
			'name': 'Rice Bowl',
			'url': baseUrl,
			'logo': `${baseUrl}/images/icon-512.png`,
		},
		'prepTime': `PT${recipe.prepTime}M`,
		'cookTime': `PT${recipe.cookTime}M`,
		'totalTime': `PT${recipe.totalTime}M`,
		'recipeYield': `${recipe.servings} servings`,
		'recipeCategory': recipe.tags.meal,
		'recipeCuisine': recipe.tags.country,
		'recipeIngredient': recipe.ingredients,
		'recipeInstructions': recipe.instructions.map((instruction: string, index: number) => ({
			'@type': 'HowToStep',
			'position': index + 1,
			'text': instruction,
		})),
		'keywords': [
			recipe.name,
			...recipe.tags.ingredient,
			recipe.tags.country,
			recipe.tags.meal,
			...recipe.tags.taste,
		].join(', '),
		'aggregateRating': {
			'@type': 'AggregateRating',
			'ratingValue': '5',
			'ratingCount': '1',
			'bestRating': '5',
			'worstRating': '1',
		},
	}
}

/**
 * Generate structured data for Organization
 */
export function generateOrganizationSchema(baseUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'name': 'Rice Bowl',
		'url': baseUrl,
		'logo': `${baseUrl}/images/icon-512.png`,
		'description': 'Discover delicious recipes from around the world',
		'sameAs': [
			'https://twitter.com/ricebowlrecipes',
			'https://facebook.com/ricebowlrecipes',
		],
	}
}

/**
 * Generate structured data for WebSite
 */
export function generateWebsiteSchema(baseUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'name': 'Rice Bowl',
		'url': baseUrl,
		'description': 'Discover delicious recipes from around the world',
		'potentialAction': {
			'@type': 'SearchAction',
			'target': {
				'@type': 'EntryPoint',
				'urlTemplate': `${baseUrl}/search?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	}
}
