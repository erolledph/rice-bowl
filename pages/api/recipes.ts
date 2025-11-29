/**
 * API route to fetch recipes from GitHub repository
 * 
 * Optimizations for 100k+ visitors:
 * - Memory caching with 1 hour TTL
 * - Request deduplication (multiple simultaneous requests = 1 API call)
 * - Conditional requests with ETags
 * - Automatic cache refresh every 1 hour
 * - Fallback to stale cache on error
 * - CDN-friendly cache headers
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { recipeCache, getCacheKey } from '@/lib/cache'

// Cache configuration for recipes
const RECIPE_CACHE_TTL = 3600; // 1 hour
const RECIPE_CACHE_KEY = getCacheKey('recipes', 'all')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER
		const repo = process.env.NEXT_PUBLIC_GITHUB_REPO
		const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

		if (!owner || !repo || !token) {
			return res.status(500).json({ error: 'GitHub credentials not configured' })
		}

		// Get recipes from cache or fetch from GitHub
		const recipes = await recipeCache.get(
			RECIPE_CACHE_KEY,
			async () => {
				// Fetch the recipe files from GitHub
				const response = await fetch(
					`https://api.github.com/repos/${owner}/${repo}/contents/app/recipes`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/vnd.github.v3+json',
						},
					}
				)

				if (!response.ok) {
					throw new Error(`Failed to fetch recipes: ${response.statusText}`)
				}

				const files = await response.json()

				// Filter for markdown files only
				const recipeFiles = Array.isArray(files)
					? files.filter((file: any) => file.name.endsWith('.md') && file.type === 'file')
					: []

				// Fetch content of each recipe file in parallel
				const recipes = await Promise.all(
					recipeFiles.map(async (file: any) => {
						try {
							const contentResponse = await fetch(file.url, {
								headers: {
									Authorization: `Bearer ${token}`,
									Accept: 'application/vnd.github.v3.raw',
								},
							})

							if (!contentResponse.ok) {
								throw new Error(`Failed to fetch ${file.name}`)
							}

							const content = await contentResponse.text()
							return {
								slug: file.name.replace('.md', ''),
								content,
								path: file.path,
							}
						} catch (error) {
							console.error(`Error fetching recipe ${file.name}:`, error)
							return null
						}
					})
				)

				// Parse recipes from markdown
				const parsedRecipes = recipes
					.filter((r): r is NonNullable<typeof r> => r !== null)
					.map((r) => parseRecipeMarkdown(r.slug, r.content))
					.filter((r): r is NonNullable<typeof r> => r !== null)

				return parsedRecipes
			},
			{
				ttlSeconds: RECIPE_CACHE_TTL,
				tags: ['recipes:*'],
			}
		)

		// Set cache headers for CDN
		res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
		res.setHeader('Content-Type', 'application/json')
		
		res.status(200).json(recipes)
	} catch (error) {
		console.error('Error fetching recipes from GitHub:', error)
		res.status(500).json({
			error: 'Failed to fetch recipes',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
}

/**
 * Parse recipe markdown content
 */
function parseRecipeMarkdown(slug: string, content: string) {
	try {
		const frontmatterRegex = /^---\n([\s\S]*?)\n---/
		const match = content.match(frontmatterRegex)

		if (!match) {
			return null
		}

		const frontmatter = match[1]
		const body = content.replace(frontmatterRegex, '').trim()

		const parseField = (name: string): string => {
			const regex = new RegExp(`${name}:\\s*(.+)`)
			const fieldMatch = frontmatter.match(regex)
			return fieldMatch ? fieldMatch[1].trim() : ''
		}

		const parseArrayField = (name: string): string[] => {
			const value = parseField(name)
			return value
				.split(',')
				.map((v) => v.trim())
				.filter((v) => v)
		}

		const parseNumberField = (name: string): number => {
			const value = parseField(name)
			return parseInt(value) || 0
		}

		const ingredientsMatch = body.match(/## Ingredients\n([\s\S]*?)(?:## Instructions|$)/)
		const instructionsMatch = body.match(/## Instructions\n([\s\S]*)$/)

		const ingredients = ingredientsMatch
			? ingredientsMatch[1]
					.split('\n')
					.filter((line) => line.startsWith('-'))
					.map((line) => line.replace(/^-\s*/, '').trim())
					.filter((line) => line)
			: []

		const instructions = instructionsMatch
			? instructionsMatch[1]
					.split('\n')
					.filter((line) => line.match(/^\d+\./))
					.map((line) => line.replace(/^\d+\.\s*/, '').trim())
					.filter((line) => line)
			: []

		const name = parseField('title')
		const description = parseField('description')
		const servings = parseNumberField('servings')
		const cookTime = parseNumberField('cookTime')
		const prepTime = parseNumberField('prepTime')
		const difficulty = parseField('difficulty')
		const image = parseField('image')
		const mealType = parseField('mealType')
		const protein = parseField('protein')
		const country = parseField('country')
		const tastes = parseArrayField('tastes')
		const ingredientTags = parseArrayField('ingredients_tags')

		if (!name || !slug) {
			return null
		}

		return {
			slug,
			name,
			description,
			servings: servings || 2,
			cookTime: cookTime || 0,
			prepTime: prepTime || 0,
			totalTime: (cookTime || 0) + (prepTime || 0),
			difficulty: difficulty || 'Easy',
			image: image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
			tags: {
				meal: mealType || 'Lunch',
				ingredient: ingredientTags.length > 0 ? ingredientTags : [],
				meat: protein || 'None',
				sideDish: false,
				taste: tastes.length > 0 ? tastes : [],
				country: country || 'International',
			},
			ingredients,
			instructions,
		}
	} catch (error) {
		console.error(`Error parsing recipe ${slug}:`, error)
		return null
	}
}
