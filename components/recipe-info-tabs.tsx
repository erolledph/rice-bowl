import { useState } from 'react'

interface RecipeInfoTabsProps {
	difficulty: string
	prepTime: number
	cookTime: number
	servings: number
	tags: {
		meal: string
		meat: string
		country: string
		taste: string[]
		ingredient: string[]
	}
}

const RecipeInfoTabs = ({ difficulty, prepTime, cookTime, servings, tags }: RecipeInfoTabsProps) => {
	const [activeTab, setActiveTab] = useState<'info' | 'details'>('info')

	return (
		<div className='mb-12'>
			{/* Tabs */}
			<div className='flex gap-0 mb-6 border-b border-orange-200 dark:border-orange-900'>
				<button
					onClick={() => setActiveTab('info')}
					className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
						activeTab === 'info'
							? 'text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400'
							: 'text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-white'
					}`}
				>
					📊 Quick Info
				</button>
				<button
					onClick={() => setActiveTab('details')}
					className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
						activeTab === 'details'
							? 'text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400'
							: 'text-zinc-600 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-white'
					}`}
				>
					🏷️ Details
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === 'info' && (
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-900 animate-fadeIn'>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Difficulty
						</div>
						<div
							className={`text-lg font-bold mt-1 ${
								difficulty === 'Easy'
									? 'text-green-600'
									: difficulty === 'Medium'
										? 'text-yellow-600'
										: 'text-red-600'
							}`}
						>
							{difficulty}
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Prep Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{prepTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Cook Time
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{cookTime} min
						</div>
					</div>
					<div>
						<div className='text-sm font-semibold text-zinc-600 dark:text-zinc-400'>
							Servings
						</div>
						<div className='text-lg font-bold text-orange-600 mt-1'>
							{servings} people
						</div>
					</div>
				</div>
			)}

			{activeTab === 'details' && (
				<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4 animate-fadeIn'>
					<div>
						<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Meal Type
						</h3>
						<span className='inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 rounded-full text-sm'>
							{tags.meal}
						</span>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Protein
						</h3>
						<span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm'>
							{tags.meat}
						</span>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Country
						</h3>
						<span className='inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm'>
							{tags.country}
						</span>
					</div>
					<div>
						<h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
							Taste Profile
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.taste.map((taste) => (
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
							Key Ingredients
						</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.ingredient.map((ingredient) => (
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
			)}
		</div>
	)
}

export default RecipeInfoTabs
