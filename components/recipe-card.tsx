import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Recipe } from '@/hooks/useRecipes'

interface RecipeCardProps {
	recipe: Recipe
	isFavorite: boolean
	onToggleFavorite: (recipeSlug: string) => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onToggleFavorite }) => {
	return (
		<Link href={`/recipe/${recipe.slug}`}>
			<div className='group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full flex flex-col'>
				{/* Image Container */}
				<div className='relative h-56 overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800'>
					<Image
						src={recipe.image}
						alt={recipe.name}
						fill
						className='object-cover group-hover:scale-110 transition-transform duration-300'
					/>
					
					{/* Overlay Gradient */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
					
					{/* Difficulty Badge */}
					<div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
						recipe.difficulty === 'Easy'
							? 'bg-green-500/80 text-white'
							: recipe.difficulty === 'Medium'
								? 'bg-yellow-500/80 text-white'
								: 'bg-red-500/80 text-white'
					}`}>
						{recipe.difficulty}
					</div>
					
					{/* Favorite Button */}
					<button
						onClick={(e) => {
							e.preventDefault()
							onToggleFavorite(recipe.slug)
						}}
						className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${
							isFavorite 
								? 'bg-red-500/80 text-white shadow-lg' 
								: 'bg-white/20 text-white hover:bg-white/40'
						}`}
					>
						<Heart className='w-5 h-5' fill={isFavorite ? 'currentColor' : 'none'} />
					</button>
				</div>
				
				{/* Content */}
				<div className='p-5 flex-1 flex flex-col'>
					{/* Title */}
					<h3 className='text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors'>
						{recipe.name}
					</h3>
					
					{/* Description */}
					<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 flex-1'>
						{recipe.description}
					</p>
					
					{/* Tags Row */}
					<div className='flex flex-wrap gap-1 mb-4'>
						<span className='inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 rounded-full'>
							{recipe.tags.meal}
						</span>
						<span className='inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full'>
							{recipe.tags.meat !== 'None' ? recipe.tags.meat : 'Vegetarian'}
						</span>
						<span className='inline-block px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded-full'>
							{recipe.tags.country}
						</span>
					</div>
					
					{/* Footer Stats */}
					<div className='flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-200 dark:border-zinc-700'>
						<div className='flex items-center gap-1'>
							<span>⏱️</span>
							<span className='font-semibold'>{recipe.totalTime}m</span>
						</div>
						<div className='flex items-center gap-1'>
							<span>👥</span>
							<span className='font-semibold'>{recipe.servings}</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='text-orange-500'>★</span>
							<span className='font-semibold'>4.8</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default RecipeCard
