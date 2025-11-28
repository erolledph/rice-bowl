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
				<div className='mb-8'>
					<Link href='/' className='text-orange-500 hover:text-orange-600 font-semibold mb-4 inline-block'>
						← Back to Home
					</Link>
					<h1 className='text-4xl font-bold text-zinc-900 dark:text-white mb-2'>
						Search Results
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400'>
						{searchQuery || selectedTags.length > 0
							? `Showing results for "${searchQuery || selectedTags.join(', ')}"`
							: 'Enter a search query'}
					</p>

					{/* Active Tags Display */}
					{selectedTags.length > 0 && (
						<div className='mt-4 flex flex-wrap gap-2'>
							{selectedTags.map((tag) => (
								<div
									key={tag}
									className='inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 px-3 py-1 rounded-full text-sm font-medium'
								>
									<span>{tag}</span>
									<button
										onClick={() => {
											const newTags = selectedTags.filter((t) => t !== tag)
											if (newTags.length > 0) {
												router.push(`/search?q=${encodeURIComponent(searchQuery)}&tags=${encodeURIComponent(newTags.join(','))}`)
											} else {
												router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
											}
										}}
										className='text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 font-bold'
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
					<div className='text-center py-12'>
						<p className='text-zinc-600 dark:text-zinc-400 mb-6'>
							{searchQuery || selectedTags.length > 0
								? 'No recipes found matching your search'
								: 'Try searching for recipes by name, ingredients, or cuisine'}
						</p>
						<Link
							href='/'
							className='inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors'
						>
							Back to Home
						</Link>
					</div>
				)}
			</Section>
		</Page>
	)
}

export default SearchPage
