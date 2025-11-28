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
		<div className='relative bg-gradient-to-br from-orange-400 via-red-300 to-pink-300 dark:from-orange-900 dark:via-red-900 dark:to-pink-900 py-20 px-6 overflow-hidden'>
			{/* Decorative background elements */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48'></div>
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48'></div>
			
			<div className='mx-auto max-w-4xl relative z-10'>
				<div className='text-center mb-12'>
					<h1 className='text-5xl md:text-6xl font-black text-white mb-4 leading-tight'>
						Delicious Recipes<br />at Your Fingertips
					</h1>
					<p className='text-xl text-white/90 mb-2 font-light'>
						Discover thousands of recipes from cuisines around the world
					</p>
					<p className='text-sm text-white/70'>Easy • Fresh • Inspiring</p>
				</div>

				<form onSubmit={handleSearch} className='mb-12'>
					<div className='relative'>
						<div className='w-full px-6 py-4 rounded-full bg-white dark:bg-zinc-800 shadow-2xl border-2 border-transparent hover:border-orange-200 focus-within:border-orange-400 transition-all flex flex-wrap items-center gap-2 backdrop-blur-sm'>
							{/* Selected Tags as Chips */}
							{selectedTags.map((tag) => (
								<div
									key={tag}
									className='flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-900 dark:text-orange-100 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm'
								>
									<span>{tag}</span>
									<button
										type='button'
										onClick={() => removeTag(tag)}
										className='ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 font-bold hover:scale-110 transition-transform'
									>
										×
									</button>
								</div>
							))}

							{/* Search Input */}
							<input
								type='text'
								placeholder={selectedTags.length > 0 ? 'Add more keywords...' : 'Search recipes (pasta, chicken, dessert...)'}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='flex-1 min-w-0 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none text-base'
							/>

							{/* Search Button */}
							<button
								type='submit'
								className='px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg whitespace-nowrap active:scale-95'
							>
								Search
							</button>
						</div>
					</div>
				</form>

				{/* Category Tags */}
				<div className='space-y-6 mt-12'>
					{/* Meals */}
					<div>
						<h3 className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>
							Meal Type
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meals.slice(0, 4).map((meal) => (
								<button
									key={meal}
									type='button'
									onClick={() => handleTagClick(meal)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform ${
										isTagSelected(meal)
											? 'bg-white text-orange-600 shadow-lg scale-105'
											: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
									}`}
								>
									{meal}
								</button>
							))}
						</div>
					</div>

					{/* Popular Ingredients */}
					<div>
						<h3 className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>
							Popular Ingredients
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.ingredients.slice(0, 5).map((ingredient) => (
								<button
									key={ingredient}
									type='button'
									onClick={() => handleTagClick(ingredient)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform ${
										isTagSelected(ingredient)
											? 'bg-white text-orange-600 shadow-lg scale-105'
											: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
									}`}
								>
									{ingredient}
								</button>
							))}
						</div>
					</div>

					{/* Protein */}
					<div>
						<h3 className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>
							Protein
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.meats.map((meat) => (
								<button
									key={meat}
									type='button'
									onClick={() => handleTagClick(meat)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform ${
										isTagSelected(meat)
											? 'bg-white text-orange-600 shadow-lg scale-105'
											: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
									}`}
								>
									{meat}
								</button>
							))}
						</div>
					</div>

					{/* Taste */}
					<div>
						<h3 className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>
							Taste
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.tastes.map((taste) => (
								<button
									key={taste}
									type='button'
									onClick={() => handleTagClick(taste)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform ${
										isTagSelected(taste)
											? 'bg-white text-orange-600 shadow-lg scale-105'
											: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
									}`}
								>
									{taste}
								</button>
							))}
						</div>
					</div>

					{/* Countries */}
					<div>
						<h3 className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>
							Country
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.countries.map((country) => (
								<button
									key={country}
									type='button'
									onClick={() => handleTagClick(country)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform ${
										isTagSelected(country)
											? 'bg-white text-orange-600 shadow-lg scale-105'
											: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
									}`}
								>
									{country}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4 text-center mt-12 pt-12 border-t border-white/20'>
					<div>
						<div className='text-3xl md:text-4xl font-black text-white mb-1'>
							{loading ? '∞' : '20+'}
						</div>
						<div className='text-sm text-white/70 font-medium'>Recipes</div>
					</div>
					<div>
						<div className='text-3xl md:text-4xl font-black text-white mb-1'>😋</div>
						<div className='text-sm text-white/70 font-medium'>Delicious</div>
					</div>
					<div>
						<div className='text-3xl md:text-4xl font-black text-white mb-1'>⚡</div>
						<div className='text-sm text-white/70 font-medium'>Quick</div>
					</div>
				</div>
				
				{loading && (
					<div className='text-center mt-6 text-sm text-white/70 font-medium'>
						Loading recipes...
					</div>
				)}
			</div>
		</div>
	)
}

export default Hero
