import Link from 'next/link'
import Image from 'next/image'
import Page from '@/components/page'
import Hero from '@/components/hero'
import Section from '@/components/section'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const Index = () => {
	const { recipes, toggleFavorite, isFavorite } = useRecipes()
	const featuredRecipes = recipes.slice(0, 6)

	return (
		<Page>
			<Hero />
			<Section>
				{/* Featured Recipes Section */}
				<div className='mb-16'>
					<div className='mb-8'>
						<span className='text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider'>✨ FEATURED</span>
						<h2 className='text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mt-2 mb-3'>
							Trending Now
						</h2>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl'>
							Discover our most loved recipes, handpicked for flavor and simplicity
						</p>
					</div>

					{/* Featured Grid */}
					{featuredRecipes.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
							{featuredRecipes.map((recipe) => (
								<RecipeCard
									key={recipe.slug}
									recipe={recipe}
									isFavorite={isFavorite(recipe.slug)}
									onToggleFavorite={toggleFavorite}
								/>
							))}
						</div>
					) : null}

					{/* CTA Button */}
					<div className='text-center'>
						<Link
							href='/recipes'
							className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
						>
							Explore All Recipes
							<span>→</span>
						</Link>
					</div>
				</div>

				{/* Magazine-style divider */}
				<div className='my-16 border-t-2 border-orange-200 dark:border-orange-900'></div>

				{/* Why Choose Us Section */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
					<div className='text-center'>
						<div className='text-5xl mb-4'>🍴</div>
						<h3 className='text-xl font-bold text-zinc-900 dark:text-white mb-2'>
							Easy to Follow
						</h3>
						<p className='text-zinc-600 dark:text-zinc-400'>
							Step-by-step instructions that anyone can follow, from beginners to pros
						</p>
					</div>
					<div className='text-center'>
						<div className='text-5xl mb-4'>🌍</div>
						<h3 className='text-xl font-bold text-zinc-900 dark:text-white mb-2'>
							World Cuisines
						</h3>
						<p className='text-zinc-600 dark:text-zinc-400'>
							Explore authentic recipes from different cuisines around the globe
						</p>
					</div>
					<div className='text-center'>
						<div className='text-5xl mb-4'>💝</div>
						<h3 className='text-xl font-bold text-zinc-900 dark:text-white mb-2'>
							Save Favorites
						</h3>
						<p className='text-zinc-600 dark:text-zinc-400'>
							Bookmark recipes you love for easy access anytime, anywhere
						</p>
					</div>
				</div>

				{/* Call to Action Banner */}
				<div className='bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white text-center'>
					<h3 className='text-3xl md:text-4xl font-black mb-3'>
						🎉 Start Cooking Today
					</h3>
					<p className='text-lg text-white/90 mb-6'>
						Find your next favorite recipe and impress with amazing dishes
					</p>
					<Link
						href='/recipes'
						className='inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all transform hover:scale-105'
					>
						Browse Recipes →
					</Link>
				</div>
			</Section>
		</Page>
	)
}

export default Index
