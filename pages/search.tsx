import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import SearchFilterBar from '@/components/search-filter-bar'
import RecipeCardsSkeleton from '@/components/recipe-cards-skeleton'
import { useRecipes } from '@/hooks/useRecipes'

const SearchPage = () => {
	const router = useRouter()
	const { q } = router.query
	const [searchQuery, setSearchQuery] = useState(typeof q === 'string' ? q : '')
	const [mealFilters, setMealFilters] = useState<string[]>([])
	const [ingredientFilters, setIngredientFilters] = useState<string[]>([])
	const [countryFilters, setCountryFilters] = useState<string[]>([])
	const [meatFilters, setMeatFilters] = useState<string[]>([])
	const [tasteFilters, setTasteFilters] = useState<string[]>([])

	const { getFilteredRecipes, toggleFavorite, isFavorite, getAllTags, loading } = useRecipes()

	const tags = getAllTags()
	const allResults = getFilteredRecipes(searchQuery)

	const results = useMemo(() => {
		let filtered = allResults

		// Apply meal filters
		if (mealFilters.length > 0) {
			filtered = filtered.filter((recipe) => mealFilters.includes(recipe.tags.meal))
		}

		// Apply ingredient filters
		if (ingredientFilters.length > 0) {
			filtered = filtered.filter((recipe) =>
				ingredientFilters.some((ing) => recipe.tags.ingredient.includes(ing))
			)
		}

		// Apply country filters
		if (countryFilters.length > 0) {
			filtered = filtered.filter((recipe) => countryFilters.includes(recipe.tags.country))
		}

		// Apply meat filters
		if (meatFilters.length > 0) {
			filtered = filtered.filter((recipe) => meatFilters.includes(recipe.tags.meat))
		}

		// Apply taste filters
		if (tasteFilters.length > 0) {
			filtered = filtered.filter((recipe) =>
				tasteFilters.some((taste) => recipe.tags.taste.includes(taste))
			)
		}

		return filtered
	}, [allResults, mealFilters, ingredientFilters, countryFilters, meatFilters, tasteFilters])

	return (
		<Page>
			<Section>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center gap-3 mb-3'>
						<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
							Search Results
						</h1>
					</div>
					<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-8'>
						{searchQuery ? `Results for "${searchQuery}"` : 'Search recipes from our collection'}
					</p>

					{/* Search and Filter Bar */}
					<SearchFilterBar
						searchQuery={searchQuery}
						onSearchChange={(query) => {
							setSearchQuery(query)
							if (query.trim()) {
								router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true })
							} else {
								router.push('/search', undefined, { shallow: true })
							}
						}}
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
						resultCount={results.length}
					/>
				</div>

				{/* Results Grid */}
				{loading ? (
					<RecipeCardsSkeleton count={8} />
				) : results.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{results.map((recipe) => (
							<RecipeCard
								key={recipe.slug}
								recipe={recipe}
								isFavorite={isFavorite(recipe.slug)}
								onToggleFavorite={toggleFavorite}
							/>
						))}
					</div>
				) : (
					<div className='text-center py-20'>
						<div className='text-6xl mb-4'>🍳</div>
						<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4 font-medium'>
							{searchQuery
								? 'No recipes found matching your search'
								: 'Try searching for recipes by name, ingredients, or cuisine'}
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 mb-8'>
							Browse all recipes or adjust your filters
						</p>
						<Link
							href='/recipes'
							className='inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl'
						>
							Browse All Recipes
						</Link>
					</div>
				)}
			</Section>
		</Page>
	)
}

export default SearchPage
