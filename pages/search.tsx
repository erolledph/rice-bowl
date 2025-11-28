import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const SearchPage = () => {
	const router = useRouter()
	const { q } = router.query
	const { getFilteredRecipes, toggleFavorite, isFavorite } = useRecipes()

	const searchQuery = typeof q === 'string' ? q : ''
	const results = getFilteredRecipes(searchQuery)

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
						{searchQuery ? `Showing results for "${searchQuery}"` : 'Enter a search query'}
					</p>
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
							{searchQuery
								? "No recipes found matching your search"
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
