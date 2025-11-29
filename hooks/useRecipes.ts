import { useEffect, useState } from 'react'

export interface Recipe {
	slug: string
	name: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	totalTime: number
	difficulty: string
	image: string
	tags: {
		meal: string
		ingredient: string[]
		meat: string
		sideDish: boolean
		taste: string[]
		country: string
	}
	ingredients: string[]
	instructions: string[]
}

export const useRecipes = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([])
	const [favorites, setFavorites] = useState<string[]>([])
	const [mounted, setMounted] = useState(false)
	const [loading, setLoading] = useState(true)

	// Fetch recipes from API on mount
	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await fetch('/api/recipes')
				if (response.ok) {
					const data = await response.json()
					if (Array.isArray(data)) {
						setRecipes(data)
					}
				}
			} catch (error) {
				console.error('Failed to fetch recipes from GitHub:', error)
			} finally {
				setLoading(false)
			}
		}

		const stored = localStorage.getItem('favorite_recipes')
		if (stored) {
			setFavorites(JSON.parse(stored))
		}
		setMounted(true)

		fetchRecipes()
	}, [])

	// Refetch recipes function
	const refetchRecipes = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/recipes')
			if (response.ok) {
				const data = await response.json()
				if (Array.isArray(data)) {
					setRecipes(data)
				}
			}
		} catch (error) {
			console.error('Failed to refetch recipes:', error)
		} finally {
			setLoading(false)
		}
	}

	// Save favorites to localStorage whenever they change
	useEffect(() => {
		if (mounted) {
			localStorage.setItem('favorite_recipes', JSON.stringify(favorites))
		}
	}, [favorites, mounted])

	const toggleFavorite = (recipeSlug: string) => {
		setFavorites((prev) =>
			prev.includes(recipeSlug) ? prev.filter((slug) => slug !== recipeSlug) : [...prev, recipeSlug]
		)
	}

	const isFavorite = (recipeSlug: string) => favorites.includes(recipeSlug)

	// Fuzzy search helper function
	const fuzzyMatch = (text: string, query: string): boolean => {
		const textLower = text.toLowerCase()
		const queryLower = query.toLowerCase()
		
		// Exact substring match gets priority
		if (textLower.includes(queryLower)) return true
		
		// Word boundary match - match against individual words
		const words = textLower.split(/[\s\-,]+/)
		if (words.some(word => word.startsWith(queryLower))) return true
		
		// Partial word match at word boundaries
		const queryWords = queryLower.split(/[\s\-,]+/).filter(w => w.length > 0)
		return queryWords.some(qWord => words.some(word => word.includes(qWord)))
	}

	const getFilteredRecipes = (searchQuery: string) => {
		if (!searchQuery.trim()) return recipes

		const query = searchQuery.toLowerCase().trim()
		
		// Split search query into individual words for better matching
		const searchTerms = query.split(/[\s\-,]+/).filter(term => term.length > 0)
		
		return recipes.filter((recipe) => {
			// Check recipe name
			if (fuzzyMatch(recipe.name, query)) return true
			
			// Check description
			if (fuzzyMatch(recipe.description, query)) return true
			
			// Check ingredients - match if any ingredient contains any search term
			if (recipe.tags.ingredient.some((ing) => 
				searchTerms.some(term => fuzzyMatch(ing, term))
			)) return true
			
			// Check meat/protein
			if (fuzzyMatch(recipe.tags.meat, query)) return true
			
			// Check tastes - match if any taste contains any search term
			if (recipe.tags.taste.some((taste) =>
				searchTerms.some(term => fuzzyMatch(taste, term))
			)) return true
			
			// Check country
			if (fuzzyMatch(recipe.tags.country, query)) return true
			
			// Check meal type
			if (fuzzyMatch(recipe.tags.meal, query)) return true
			
			// Check raw ingredients list
			if (recipe.ingredients.some((ing) =>
				searchTerms.some(term => fuzzyMatch(ing, term))
			)) return true
			
			return false
		})
	}

	const getFavoriteRecipes = () => {
		return recipes.filter((recipe) => favorites.includes(recipe.slug))
	}

	const getMatchingKeywords = (recipe: Recipe, searchQuery: string): string[] => {
		if (!searchQuery.trim()) return []
		
		const query = searchQuery.toLowerCase().trim()
		const searchTerms = query.split(/[\s\-,]+/).filter(term => term.length > 0)
		const matchedKeywords = new Set<string>()
		
		// Check recipe name
		if (fuzzyMatch(recipe.name, query)) {
			matchedKeywords.add(recipe.name)
		}
		
		// Check ingredients
		recipe.tags.ingredient.forEach(ing => {
			searchTerms.forEach(term => {
				if (fuzzyMatch(ing, term)) {
					matchedKeywords.add(ing)
				}
			})
		})
		
		// Check tastes
		recipe.tags.taste.forEach(taste => {
			searchTerms.forEach(term => {
				if (fuzzyMatch(taste, term)) {
					matchedKeywords.add(taste)
				}
			})
		})
		
		// Check meat
		if (fuzzyMatch(recipe.tags.meat, query)) {
			matchedKeywords.add(recipe.tags.meat)
		}
		
		// Check country
		if (fuzzyMatch(recipe.tags.country, query)) {
			matchedKeywords.add(recipe.tags.country)
		}
		
		// Check meal type
		if (fuzzyMatch(recipe.tags.meal, query)) {
			matchedKeywords.add(recipe.tags.meal)
		}
		
		// Check raw ingredients list
		recipe.ingredients.forEach(ing => {
			searchTerms.forEach(term => {
				if (fuzzyMatch(ing, term)) {
					matchedKeywords.add(ing)
				}
			})
		})
		
		return Array.from(matchedKeywords)
	}

	const getAllTags = () => {
		const tags = {
			meals: new Set<string>(),
			ingredients: new Set<string>(),
			meats: new Set<string>(),
			tastes: new Set<string>(),
			countries: new Set<string>(),
		}

		recipes.forEach((recipe) => {
			tags.meals.add(recipe.tags.meal)
			recipe.tags.ingredient.forEach((ing) => tags.ingredients.add(ing))
			if (recipe.tags.meat !== 'None') tags.meats.add(recipe.tags.meat)
			recipe.tags.taste.forEach((taste) => tags.tastes.add(taste))
			tags.countries.add(recipe.tags.country)
		})

		return {
			meals: Array.from(tags.meals).sort(),
			ingredients: Array.from(tags.ingredients).sort(),
			meats: Array.from(tags.meats).sort(),
			tastes: Array.from(tags.tastes).sort(),
			countries: Array.from(tags.countries).sort(),
		}
	}

	return {
		recipes,
		favorites,
		toggleFavorite,
		isFavorite,
		getFilteredRecipes,
		getFavoriteRecipes,
		getMatchingKeywords,
		getAllTags,
		loading,
		refetchRecipes,
	}
}
