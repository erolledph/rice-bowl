import { useState } from 'react'
import { useRouter } from 'next/router'
import { useRecipes } from '@/hooks/useRecipes'

interface HeroProps {
	onSearch?: (query: string, tags: string[]) => void
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const router = useRouter()
	const { getAllTags, loading } = useRecipes()
	const tags = getAllTags()

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		const query = searchQuery.trim() || selectedTags.join(' ')
		if (query) {
			if (onSearch) {
				onSearch(query, selectedTags)
			} else {
				router.push(`/search?q=${encodeURIComponent(query)}&tags=${encodeURIComponent(selectedTags.join(','))}`)
			}
		}
	}

	const handleTagClick = (tag: string) => {
		setSelectedTags((prev) => {
			if (prev.includes(tag)) {
				return prev.filter((t) => t !== tag)
			} else {
				return [...prev, tag]
			}
		})
	}

	const removeTag = (tag: string) => {
		setSelectedTags((prev) => prev.filter((t) => t !== tag))
	}

	const isTagSelected = (tag: string) => selectedTags.includes(tag)

	return (
		<div className='relative bg-gradient-to-b from-orange-50 to-transparent dark:from-zinc-800 dark:to-transparent py-12 px-6'>
			<div className='mx-auto max-w-screen-md'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3'>
						Welcome to The Cook Book
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-300 mb-8'>
						Discover delicious recipes for every occasion
					</p>
				</div>

				<form onSubmit={handleSearch} className='mb-10'>
					<div className='relative'>
						<div className='w-full px-6 py-3 rounded-full bg-white dark:bg-zinc-700 border-2 border-transparent hover:border-orange-300 focus-within:border-orange-500 transition-colors shadow-lg flex flex-wrap items-center gap-2'>
							{/* Selected Tags as Chips */}
							{selectedTags.map((tag) => (
								<div
									key={tag}
									className='flex items-center gap-1 bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 px-3 py-1 rounded-full text-sm font-medium'
								>
									<span>{tag}</span>
									<button
										type='button'
										onClick={() => removeTag(tag)}
										className='ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 font-bold'
									>
										×
									</button>
								</div>
							))}

							{/* Search Input */}
							<input
								type='text'
								placeholder={selectedTags.length > 0 ? 'Add more...' : 'Search for recipes (e.g., pasta, chicken, desserts)...'}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='flex-1 min-w-0 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none'
							/>

							{/* Search Button */}
							<button
								type='submit'
								className='px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors whitespace-nowrap'
							>
								Search
							</button>
						</div>
					</div>
				</form>

				{/* Category Tags */}
				<div className='space-y-4'>
					{/* Meals */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Meal Type
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meals.slice(0, 4).map((meal) => (
								<button
									key={meal}
									type='button'
									onClick={() => handleTagClick(meal)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
										isTagSelected(meal)
											? 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-700'
											: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600 hover:bg-orange-100 dark:hover:bg-orange-900'
									}`}
								>
									{meal}
								</button>
							))}
						</div>
					</div>

					{/* Popular Ingredients */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Popular Ingredients
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.ingredients.slice(0, 5).map((ingredient) => (
								<button
									key={ingredient}
									type='button'
									onClick={() => handleTagClick(ingredient)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
										isTagSelected(ingredient)
											? 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-700'
											: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600 hover:bg-orange-100 dark:hover:bg-orange-900'
									}`}
								>
									{ingredient}
								</button>
							))}
						</div>
					</div>

					{/* Protein */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Protein
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meats.map((meat) => (
								<button
									key={meat}
									type='button'
									onClick={() => handleTagClick(meat)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
										isTagSelected(meat)
											? 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-700'
											: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600 hover:bg-orange-100 dark:hover:bg-orange-900'
									}`}
								>
									{meat}
								</button>
							))}
						</div>
					</div>

					{/* Taste */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Taste
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.tastes.map((taste) => (
								<button
									key={taste}
									type='button'
									onClick={() => handleTagClick(taste)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
										isTagSelected(taste)
											? 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-700'
											: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600 hover:bg-orange-100 dark:hover:bg-orange-900'
									}`}
								>
									{taste}
								</button>
							))}
						</div>
					</div>

					{/* Countries */}
					<div>
						<h3 className='text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-400 mb-2'>
							Country
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.countries.map((country) => (
								<button
									key={country}
									type='button'
									onClick={() => handleTagClick(country)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
										isTagSelected(country)
											? 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-700'
											: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-600 hover:bg-orange-100 dark:hover:bg-orange-900'
									}`}
								>
									{country}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4 text-center text-sm mt-8'>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>
							{loading ? '...' : '10+'}
						</div>
						<div className='text-zinc-600 dark:text-zinc-400'>Recipes</div>
					</div>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>Easy</div>
						<div className='text-zinc-600 dark:text-zinc-400'>To Follow</div>
					</div>
					<div>
						<div className='text-2xl font-bold text-orange-500 mb-1'>Quick</div>
						<div className='text-zinc-600 dark:text-zinc-400'>Cooking Time</div>
					</div>
				</div>
				
				{loading && (
					<div className='text-center mt-4 text-sm text-zinc-500 dark:text-zinc-400'>
						Loading recipes...
					</div>
				)}
			</div>
		</div>
	)
}

export default Hero
