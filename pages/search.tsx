import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const SearchPage = () => {
	const router = useRouter()
	const { q, tags } = router.query
	const { getFilteredRecipes, toggleFavorite, isFavorite } = useRecipes()

	const searchQuery = typeof q === 'string' ? q : ''
	const selectedTags = typeof tags === 'string' ? tags.split(',').filter((t) => t) : []

	// Get results based on search query and tags
	const allResults = getFilteredRecipes(searchQuery)
	const results = selectedTags.length > 0
		? allResults.filter((recipe) => {
				const recipeTags = [
					recipe.name,
					recipe.description,
					recipe.tags.meal,
					recipe.tags.meat,
					recipe.tags.country,
					...recipe.tags.ingredient,
					...recipe.tags.taste,
				].map((t) => t.toLowerCase())
				return selectedTags.some((tag) =>
					recipeTags.some((recipeTag) =>
						recipeTag.includes(tag.toLowerCase())
					)
				)
			})
		: allResults

	return (
		<Page>
			<Section>
				{/* Header */}
				<div className='mb-12'>
					<Link href='/' className='inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold mb-4 group'>
						<span className='transform group-hover:-translate-x-1 transition-transform'>←</span>
						Back Home
					</Link>
					<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>
						Search Results
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium'>
						{searchQuery || selectedTags.length > 0
							? `Found ${results.length} recipe${results.length !== 1 ? 's' : ''}`
							: 'Enter a search query'}
					</p>

					{/* Active Tags Display */}
					{selectedTags.length > 0 && (
						<div className='mt-6 flex flex-wrap gap-2 pb-4 border-b border-orange-200 dark:border-orange-900'>
							{selectedTags.map((tag) => (
								<div
									key={tag}
									className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 text-orange-900 dark:text-orange-100 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm'
								>
									<span>🏷️ {tag}</span>
									<button
										onClick={() => {
											const newTags = selectedTags.filter((t) => t !== tag)
											if (newTags.length > 0) {
												router.push(`/search?q=${encodeURIComponent(searchQuery)}&tags=${encodeURIComponent(newTags.join(','))}`)
											} else {
												router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
											}
										}}
										className='ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 font-bold hover:scale-125 transition-transform'
									>
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Results Count */}
				<div className='mb-6 text-sm text-zinc-600 dark:text-zinc-400'>
					Found {results.length} recipe{results.length !== 1 ? 's' : ''}
				</div>

				{/* Results Grid */}
				{results.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
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
							{searchQuery || selectedTags.length > 0
								? 'No recipes found matching your search'
								: 'Try searching for recipes by name, ingredients, or cuisine'}
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 mb-8'>
							Browse all recipes or adjust your filters
						</p>
						<Link
							href='/'
							className='inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl'
						>
							← Back to Recipes
						</Link>
					</div>
				)}
			</Section>
		</Page>
	)
}

export default SearchPage
