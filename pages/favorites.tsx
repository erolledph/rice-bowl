import { useState, useMemo } from 'react'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import SearchFilterBar from '@/components/search-filter-bar'
import RecipeCardsSkeleton from '@/components/recipe-cards-skeleton'
import { useRecipes } from '@/hooks/useRecipes'

const FavoritesPage = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [mealFilters, setMealFilters] = useState<string[]>([])
	const [ingredientFilters, setIngredientFilters] = useState<string[]>([])
	const [countryFilters, setCountryFilters] = useState<string[]>([])
	const [meatFilters, setMeatFilters] = useState<string[]>([])
	const [tasteFilters, setTasteFilters] = useState<string[]>([])

	const { getFavoriteRecipes, loading, toggleFavorite, isFavorite, getAllTags } = useRecipes()

	const tags = getAllTags()
	const favoriteRecipes = getFavoriteRecipes()

	const filteredRecipes = useMemo(() => {
		let results = favoriteRecipes

		// Apply search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			results = results.filter(
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

		// Apply meal filters
		if (mealFilters.length > 0) {
			results = results.filter((recipe) => mealFilters.includes(recipe.tags.meal))
		}

		// Apply ingredient filters
		if (ingredientFilters.length > 0) {
			results = results.filter((recipe) =>
				ingredientFilters.some((ing) => recipe.tags.ingredient.includes(ing))
			)
		}

		// Apply country filters
		if (countryFilters.length > 0) {
			results = results.filter((recipe) => countryFilters.includes(recipe.tags.country))
		}

		// Apply meat filters
		if (meatFilters.length > 0) {
			results = results.filter((recipe) => meatFilters.includes(recipe.tags.meat))
		}

		// Apply taste filters
		if (tasteFilters.length > 0) {
			results = results.filter((recipe) =>
				tasteFilters.some((taste) => recipe.tags.taste.includes(taste))
			)
		}

		return results
	}, [searchQuery, mealFilters, ingredientFilters, countryFilters, meatFilters, tasteFilters, favoriteRecipes])

	return (
		<Page>
			<Section>
				<div className='mb-8'>
					{/* Header */}
					<Link href='/' className='inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold mb-4 group'>
						<span className='transform group-hover:-translate-x-1 transition-transform'>←</span>
						Back Home
					</Link>
					<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>
						♥ My Favorite Recipes
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-6'>
						Your personal collection of recipes you love
					</p>

					{/* Search and Filter Bar */}
					<SearchFilterBar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						favoriteCount={favoriteRecipes.length}
						mealFilters={mealFilters}
						onMealFiltersChange={setMealFilters}
						ingredientFilters={ingredientFilters}
						onIngredientFiltersChange={setIngredientFilters}
						countryFilters={countryFilters}
						onCountryFiltersChange={setCountryFilters}
						meatFilters={meatFilters}
						onMeatFiltersChange={setMeatFilters}
						tasteFilters={tasteFilters}
						onTasteFiltersChange={setTasteFilters}
						allMeals={tags.meals}
						allIngredients={tags.ingredients}
						allCountries={tags.countries}
						allMeats={tags.meats}
						allTastes={tags.tastes}
						resultCount={filteredRecipes.length}
					/>

				{/* Recipes Grid */}
				{loading ? (
					<div className='mt-12'>
						<RecipeCardsSkeleton count={6} />
					</div>
				) : filteredRecipes.length > 0 ? (
					<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredRecipes.map((recipe) => (
							<RecipeCard
								key={recipe.slug}
								recipe={recipe}
								isFavorite={isFavorite(recipe.slug)}
								onToggleFavorite={toggleFavorite}
							/>
						))}
					</div>
				) : favoriteRecipes.length === 0 ? (
						<div className='text-center py-20'>
							<div className='text-6xl mb-4'>🍽️</div>
							<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4 font-medium'>
								You {`haven't`} marked any recipes as favorites yet
							</p>
							<p className='text-zinc-500 dark:text-zinc-500 mb-8'>
								Explore recipes and mark them with ♥ to add them to your favorites
							</p>
							<Link
								href='/recipes'
								className='inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl'
							>
								Browse Recipes
							</Link>
						</div>
					) : (
						<div className='text-center py-20'>
							<div className='text-6xl mb-4'>🔍</div>
							<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4 font-medium'>
								No recipes found matching your filters
							</p>
							<p className='text-zinc-500 dark:text-zinc-500 mb-8'>
								Try adjusting your search or filters
							</p>
							<button
								onClick={() => {
									setSearchQuery('')
									setMealFilters([])
									setIngredientFilters([])
									setCountryFilters([])
									setMeatFilters([])
									setTasteFilters([])
								}}
								className='inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl'
							>
								Clear All Filters
							</button>
						</div>
					)}
				</div>
			</Section>
		</Page>
	)
}

export default FavoritesPage
