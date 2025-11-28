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

	const getFilteredRecipes = (searchQuery: string) => {
		if (!searchQuery.trim()) return recipes

		const query = searchQuery.toLowerCase()
		return recipes.filter(
			(recipe) =>
				recipe.name.toLowerCase().includes(query) ||
				recipe.description.toLowerCase().includes(query) ||
				recipe.tags.ingredient.some((ing) => ing.toLowerCase().includes(query)) ||
				recipe.tags.meat.toLowerCase().includes(query) ||
				recipe.tags.taste.some((taste) => taste.toLowerCase().includes(query)) ||
				recipe.tags.country.toLowerCase().includes(query) ||
				recipe.tags.meal.toLowerCase().includes(query)
		)
	}

	const getFavoriteRecipes = () => {
		return recipes.filter((recipe) => favorites.includes(recipe.slug))
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
		getAllTags,
		loading,
		refetchRecipes,
	}
}
