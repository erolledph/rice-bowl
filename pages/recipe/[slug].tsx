import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Page from '@/components/page'
import Section from '@/components/section'
import { useRecipes } from '@/hooks/useRecipes'

const RecipeDetail = () => {
	const router = useRouter()
	const { slug } = router.query
	const { recipes, toggleFavorite, isFavorite } = useRecipes()

	const recipe = recipes.find((r) => r.slug === slug)

	if (!recipe) {
		return (
			<Page>
				<Section>
					<div className='text-center py-20'>
						<div className='text-6xl mb-4'>😟</div>
						<h1 className='text-4xl font-bold text-zinc-900 dark:text-white mb-2'>
							Recipe Not Found
						</h1>
						<p className='text-zinc-600 dark:text-zinc-400 mb-8 text-lg'>
							Sorry, we couldn&apos;t find the recipe you&apos;re looking for.
						</p>
						<Link
							href='/'
							className='inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg'
						>
							← Back to Home
						</Link>
					</div>
				</Section>
			</Page>
		)
	}

	const isFav = isFavorite(recipe.slug)

	return (
		<Page>
			<Section>
				{/* Back Link */}
				<Link href='/' className='inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold mb-6 group'>
					<span className='transform group-hover:-translate-x-1 transition-transform'>←</span>
					Back Home
				</Link>

				{/* Hero Image with Overlay */}
				<div className='relative h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-2xl'>
					<Image
						src={recipe.image}
						alt={recipe.name}
						fill
						className='object-cover'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
				</div>

			{/* Header */}
			<div className='mb-8 pb-6 border-b-2 border-orange-200 dark:border-orange-900'>
				<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>
					{recipe.name}
				</h1>
				<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4'>
					{recipe.description}
				</p>
				
				{/* Quick Info Badges */}
				<div className='flex flex-wrap gap-2'>
					<span className='inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 rounded-full text-sm font-bold'>
						🍽️ {recipe.tags.meal}
					</span>
					<span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-sm font-bold'>
						🥩 {recipe.tags.meat !== 'None' ? recipe.tags.meat : 'Vegetarian'}
					</span>
					<span className='inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded-full text-sm font-bold'>
						🌍 {recipe.tags.country}
					</span>
				</div>
			</div>				{/* Recipe Info Grid */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-900'>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Difficulty
						</div>
						<div className={`text-lg font-bold mt-1 ${
							recipe.difficulty === 'Easy'
								? 'text-green-600'
								: recipe.difficulty === 'Medium'
									? 'text-yellow-600'
									: 'text-red-600'
						}`}>
							{recipe.difficulty}
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Prep Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.prepTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Cook Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.cookTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Servings
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{recipe.servings} people
						</div>
					</div>
				</div>

				{/* Tags */}
				<div className='mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg'>
					<div className='space-y-3'>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Meal Type
							</h3>
							<span className='inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 rounded-full text-sm'>
								{recipe.tags.meal}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Protein
							</h3>
							<span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm'>
								{recipe.tags.meat}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Country
							</h3>
							<span className='inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm'>
								{recipe.tags.country}
							</span>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Taste
							</h3>
							<div className='flex flex-wrap gap-2'>
								{recipe.tags.taste.map((taste) => (
									<span
										key={taste}
										className='inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100 rounded-full text-sm'
									>
										{taste}
									</span>
								))}
							</div>
						</div>
						<div>
							<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
								Ingredients
							</h3>
							<div className='flex flex-wrap gap-2'>
								{recipe.tags.ingredient.map((ingredient) => (
									<span
										key={ingredient}
										className='inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm'
									>
										{ingredient}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Ingredients Section */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
						Ingredients
					</h2>
					<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
						<ul className='space-y-2'>
							{recipe.ingredients.map((ingredient, index) => (
								<li
									key={index}
									className='flex items-start text-zinc-800 dark:text-zinc-200'
								>
									<span className='mr-3 text-orange-500 font-bold'>•</span>
									<span>{ingredient}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Instructions Section */}
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
						Instructions
					</h2>
					<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
						<ol className='space-y-3'>
							{recipe.instructions.map((instruction, index) => (
								<li
									key={index}
									className='flex items-start text-zinc-800 dark:text-zinc-200'
								>
									<span className='mr-3 w-6 h-6 flex items-center justify-center bg-orange-500 text-white font-bold text-sm rounded-full flex-shrink-0'>
										{index + 1}
									</span>
									<span className='pt-0.5'>{instruction}</span>
								</li>
							))}
						</ol>
					</div>
				</div>

				{/* Back Button */}
				<Link
					href='/recipes'
					className='inline-block px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-semibold rounded-lg transition-colors'
				>
					← Back to Recipes
				</Link>
			</Section>
		</Page>
	)
}

export default RecipeDetail
