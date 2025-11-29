/**
 * GitHub API utilities for managing recipes as content
 */

const GITHUB_API_BASE = 'https://api.github.com'

interface GitHubCommitResponse {
	sha: string
	node_id: string
	url: string
	html_url: string
	author: {
		date: string
		name: string
		email: string
	}
	committer: {
		date: string
		name: string
		email: string
	}
	message: string
	tree: {
		sha: string
		url: string
	}
	parents: Array<{
		sha: string
		url: string
		html_url: string
	}>
	verification: {
		verified: boolean
		reason: string
		signature: string | null
		payload: string | null
	}
}

interface RecipeData {
	name: string
	slug: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	difficulty: 'Easy' | 'Medium' | 'Hard'
	image: string
	mealType: string
	protein: string
	country: string
	ingredients: string[]
	instructions: string[]
	tastes: string[]
	ingredients_tags: string[]
}

/**
 * Get the base64 encoded content of a file from GitHub
 */
export async function getFileContent(
	owner: string,
	repo: string,
	path: string,
	token: string
): Promise<{ content: string; sha: string } | null> {
	try {
		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/vnd.github.v3+json',
				},
			}
		)

		if (response.status === 404) {
			return null
		}

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`)
		}

		const data = await response.json()
		return {
			content: data.content,
			sha: data.sha,
		}
	} catch (error) {
		console.error('Error fetching file from GitHub:', error)
		throw error
	}
}

/**
 * Create or update a file on GitHub
 */
export async function createOrUpdateFile(
	owner: string,
	repo: string,
	path: string,
	content: string,
	message: string,
	token: string,
	sha?: string
): Promise<GitHubCommitResponse> {
	try {
		const encodedContent = Buffer.from(content).toString('base64')

		const body: Record<string, string> = {
			message,
			content: encodedContent,
		}

		if (sha) {
			body.sha = sha
		}

		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(`GitHub API error: ${errorData.message}`)
		}

		const data = await response.json()
		return data.commit
	} catch (error) {
		console.error('Error creating/updating file on GitHub:', error)
		throw error
	}
}

/**
 * Format recipe data into markdown format
 */
export function formatRecipeAsMarkdown(recipe: RecipeData): string {
	return `---
title: ${recipe.name}
description: ${recipe.description}
servings: ${recipe.servings}
prepTime: ${recipe.prepTime}
cookTime: ${recipe.cookTime}
difficulty: ${recipe.difficulty}
image: ${recipe.image}
mealType: ${recipe.mealType}
protein: ${recipe.protein}
country: ${recipe.country}
tastes: ${recipe.tastes.join(', ')}
ingredients_tags: ${recipe.ingredients_tags.join(', ')}
---

# ${recipe.name}

${recipe.description}

## Ingredients

${recipe.ingredients.map((ing) => `- ${ing}`).join('\n')}

## Instructions

${recipe.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}
`
}

/**
 * Parse markdown recipe content
 */
export function parseRecipeMarkdown(
	content: string
): RecipeData | null {
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

	const ingredientsMatch = body.match(/## Ingredients\n([\s\S]*?)(?:## Instructions|$)/)
	const instructionsMatch = body.match(/## Instructions\n([\s\S]*)$/)

	const ingredients = ingredientsMatch
		? ingredientsMatch[1]
				.split('\n')
				.filter((line) => line.startsWith('-'))
				.map((line) => line.replace(/^-\s*/, ''))
		: []

	const instructions = instructionsMatch
		? instructionsMatch[1]
				.split('\n')
				.filter((line) => line.match(/^\d+\./))
				.map((line) => line.replace(/^\d+\.\s*/, ''))
		: []

	return {
		name: parseField('title'),
		slug: '', // Will be set separately
		description: parseField('description'),
		servings: parseInt(parseField('servings')) || 2,
		cookTime: parseInt(parseField('cookTime')) || 0,
		prepTime: parseInt(parseField('prepTime')) || 0,
		difficulty: (parseField('difficulty') as 'Easy' | 'Medium' | 'Hard') || 'Easy',
		image: parseField('image'),
		mealType: parseField('mealType'),
		protein: parseField('protein'),
		country: parseField('country'),
		ingredients,
		instructions,
		tastes: parseArrayField('tastes'),
		ingredients_tags: parseArrayField('ingredients_tags'),
	}
}

/**
 * Create a recipe post and commit to GitHub
 */
export async function createRecipePost(
	recipe: RecipeData,
	owner: string,
	repo: string,
	token: string
): Promise<GitHubCommitResponse> {
	const filePath = `app/recipes/${recipe.slug}.md`
	const content = formatRecipeAsMarkdown(recipe)
	const message = `Add recipe: ${recipe.name}`

	return createOrUpdateFile(
		owner,
		repo,
		filePath,
		content,
		message,
		token
	)
}

/**
 * Update an existing recipe post on GitHub
 */
export async function updateRecipePost(
	recipe: RecipeData,
	owner: string,
	repo: string,
	token: string
): Promise<GitHubCommitResponse> {
	const filePath = `app/recipes/${recipe.slug}.md`
	const content = formatRecipeAsMarkdown(recipe)
	const message = `Update recipe: ${recipe.name}`

	try {
		// Fetch the current file to get its SHA
		const fileData = await getFileContent(owner, repo, filePath, token)

		if (!fileData) {
			throw new Error('Recipe file not found')
		}

		return createOrUpdateFile(
			owner,
			repo,
			filePath,
			content,
			message,
			token,
			fileData.sha
		)
	} catch (error) {
		console.error('Error updating recipe on GitHub:', error)
		throw error
	}
}

/**
 * Delete a recipe post from GitHub
 */
export async function deleteRecipePost(
	slug: string,
	owner: string,
	repo: string,
	token: string
): Promise<GitHubCommitResponse> {
	try {
		const filePath = `app/recipes/${slug}.md`
		const fileData = await getFileContent(owner, repo, filePath, token)

		if (!fileData) {
			throw new Error('Recipe file not found')
		}

		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: `Delete recipe: ${slug}`,
					sha: fileData.sha,
				}),
			}
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(`GitHub API error: ${errorData.message}`)
		}

		const data = await response.json()
		return data.commit
	} catch (error) {
		console.error('Error deleting recipe from GitHub:', error)
		throw error
	}
}
