import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Printer, Heart, Download } from 'lucide-react'
import { useRef, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import RecipeSkeleton from '@/components/recipe-skeleton'
import RecipeInfoTabs from '@/components/recipe-info-tabs'
import SocialShare from '@/components/social-share'
import { useRecipes } from '@/hooks/useRecipes'

const RecipeDetail = () => {
	const router = useRouter()
	const { slug } = router.query
	const { recipes, loading, toggleFavorite, isFavorite } = useRecipes()
	const contentRef = useRef<HTMLDivElement>(null)
	const [downloading, setDownloading] = useState(false)

	const handleDownloadRecipe = async () => {
		if (!contentRef.current) return

		try {
			setDownloading(true)
			// Dynamically import html2canvas
			const html2canvas = (await import('html2canvas')).default

			const canvas = await html2canvas(contentRef.current, {
				scale: 2,
				useCORS: true,
				logging: false,
			})

			// Download as image
			const link = document.createElement('a')
			link.href = canvas.toDataURL('image/png')
			link.download = `${recipe?.slug || 'recipe'}.png`
			link.click()

			// Show alert for multi-page support
			if (contentRef.current.scrollHeight > canvas.height) {
				alert('Recipe saved! Note: For best results with long recipes, consider printing to PDF (use Print button and select "Save as PDF")')
			}
		} catch (error) {
			console.error('Download failed:', error)
			alert('Download failed. Please try again.')
		} finally {
			setDownloading(false)
		}
	}

	// Show skeleton while data is loading
	if (loading) {
		return (
			<Page>
				<Section>
					<RecipeSkeleton />
				</Section>
			</Page>
		)
	}

	const recipe = recipes.find((r) => r.slug === slug)

	// Show 404 only after loading completes and recipe is not found
	if (!recipe) {
		return (
			<Page>
				<Section>
					<div className='text-center py-20'>
						<div className='mb-4 flex justify-center'>
							<Heart className='w-16 h-16 text-red-500' />
						</div>
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

	// Generate full URL for social sharing
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rice-bowl.com'
	const recipeUrl = `${baseUrl}/recipe/${recipe.slug}`

	// SEO Schema Markup
	const schemaMarkup = {
		'@context': 'https://schema.org',
		'@type': 'Recipe',
		'@id': recipeUrl,
		'name': recipe.name,
		'description': recipe.description,
		'image': recipe.image,
		'author': {
			'@type': 'Organization',
			'name': 'Rice Bowl'
		},
		'prepTime': `PT${recipe.prepTime}M`,
		'cookTime': `PT${recipe.cookTime}M`,
		'totalTime': `PT${recipe.prepTime + recipe.cookTime}M`,
		'recipeYield': `${recipe.servings} servings`,
		'recipeCategory': recipe.tags.meal,
		'recipeCuisine': recipe.tags.country,
		'recipeIngredient': recipe.ingredients,
		'recipeInstructions': recipe.instructions.map((instruction, index) => ({
			'@type': 'HowToStep',
			'position': index + 1,
			'text': instruction
		})),
		'keywords': `${recipe.tags.ingredient.join(', ')}, ${recipe.name}`,
		'aggregateRating': {
			'@type': 'AggregateRating',
			'ratingValue': '5',
			'ratingCount': '1'
		}
	}

	return (
		<>
			<Head>
				{/* Basic Meta Tags */}
				<title>{recipe.name} | Rice Bowl - Recipe</title>
				<meta name='description' content={recipe.description} />
				<meta name='keywords' content={`${recipe.tags.ingredient.join(', ')}, ${recipe.name}, recipe`} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />

				{/* Open Graph Tags */}
				<meta property='og:title' content={recipe.name} />
				<meta property='og:description' content={recipe.description} />
				<meta property='og:image' content={recipe.image} />
				<meta property='og:url' content={recipeUrl} />
				<meta property='og:type' content='website' />

				{/* Twitter Card Tags */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content={recipe.name} />
				<meta name='twitter:description' content={recipe.description} />
				<meta name='twitter:image' content={recipe.image} />

				{/* Canonical URL */}
				<link rel='canonical' href={recipeUrl} />

				{/* Schema Markup */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
				/>
			</Head>

		<Page>
			<Section>
				{/* Action Buttons - Above Image */}
				<div className='print-buttons flex gap-2 justify-end mb-4'>
					{/* Download Button */}
					<button
						onClick={handleDownloadRecipe}
						disabled={downloading}
						className='p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-full shadow-lg transition-all hover:scale-110'
						title='Download recipe as image'
					>
						<Download className={`w-6 h-6 ${downloading ? 'animate-spin' : ''}`} />
					</button>

					{/* Print Button */}
					<button
						onClick={() => window.print()}
						className='p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all hover:scale-110'
						title='Print this recipe'
					>
						<Printer className='w-6 h-6' />
					</button>

					{/* Favorite Button */}
					<button
						onClick={() => toggleFavorite(recipe.slug)}
						className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
							isFav
								? 'bg-red-500 hover:bg-red-600 text-white'
								: 'bg-zinc-300 hover:bg-zinc-400 text-zinc-900'
						}`}
						title={isFav ? 'Remove from favorites' : 'Add to favorites'}
					>
						<Heart className='w-6 h-6' fill={isFav ? 'currentColor' : 'none'} />
					</button>
				</div>				{/* Content wrapper for download */}
				<div ref={contentRef} className='bg-white dark:bg-zinc-900'>
					{/* Hero Image */}
					<div className='print-content relative h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-2xl'>
						<Image
							src={recipe.image}
							alt={recipe.name}
							fill
							className='object-cover'
							priority
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent print:hidden'></div>
					</div>					{/* Header */}
					<div className='print-content mb-8 pb-6 border-b-2 border-orange-200 dark:border-orange-900'>
						<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>
							{recipe.name}
						</h1>
						<p className='text-xl text-zinc-600 dark:text-zinc-400 mb-4'>
							{recipe.description}
						</p>
					</div>

					{/* Recipe Info Tabs */}
					<RecipeInfoTabs
						difficulty={recipe.difficulty}
						prepTime={recipe.prepTime}
						cookTime={recipe.cookTime}
						servings={recipe.servings}
						tags={recipe.tags}
					/>

					{/* Ingredients Section */}
					<div className='print-content mb-8'>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
							Ingredients
						</h2>
						<div className='ingredients-list bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
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
					<div className='print-content mb-12'>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4'>
							Instructions
						</h2>
						<div className='instructions-list bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg'>
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

					{/* Social Share Section */}
					<div className='social-share'>
						<SocialShare
							title={recipe.name}
							description={recipe.description}
							url={recipeUrl}
						/>
					</div>
				</div>					{/* Back Button - Only at bottom */}
					<div className='back-button mt-12 flex justify-center'>
						<button
							onClick={() => window.history.back()}
							className='px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg'
						>
							← Back to Recipes
						</button>
					</div>
				</Section>
			</Page>
		</>
	)
}

export default RecipeDetail
