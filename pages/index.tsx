import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'
import Hero from '@/components/hero'
import RecipeCard from '@/components/recipe-card'
import { useRecipes } from '@/hooks/useRecipes'

const Index = () => {
	const { recipes, toggleFavorite, isFavorite } = useRecipes()
	const featuredRecipes = recipes.slice(0, 12)

	return (
		<>
			<Head>
				<title>Rice Bowl | Home</title>
			</Head>

			<Appbar />

			<main className='mx-auto min-h-screen bg-white dark:bg-zinc-900 pt-20 pb-24 sm:pb-0'>
			<Hero />

			{/* Featured Recipes Section - Full Width Airbnb Style */}
			<div className='w-full py-12 px-6 md:px-10 lg:px-20'>
				<div className='max-w-[2520px] mx-auto'>
					<div className='mb-8'>
						<h2 className='text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
							Featured recipes
						</h2>
						<p className='text-zinc-600 dark:text-zinc-400'>
							Popular picks for your next meal
						</p>
					</div>

					{/* Featured Grid - Responsive Airbnb-style */}
					{featuredRecipes.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
							{featuredRecipes.map((recipe) => (
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
							<p className='text-zinc-500 dark:text-zinc-400'>Loading recipes...</p>
						</div>
					)}
				</div>
			</div>

			{/* Browse All Section */}
			<div className='w-full py-12 px-6 md:px-10 lg:px-20 bg-zinc-50 dark:bg-zinc-900/50'>
				<div className='max-w-[2520px] mx-auto'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-6'>
						<div className='flex-1'>
							<h2 className='text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
								Explore more recipes
							</h2>
							<p className='text-zinc-600 dark:text-zinc-400'>
								Browse our entire collection and find your next favorite dish
							</p>
						</div>
						<Link
							href='/recipes'
							className='inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
						>
							View all recipes
						</Link>
					</div>
				</div>
			</div>
			</main>

			<BottomNav />
		</>
	)
}

export default Index
