import { useState, useMemo } from 'react'
import { Search, Sliders, Heart, UtensilsCrossed, Leaf, Globe, Beef, Zap } from 'lucide-react'
import FilterDropdown from './filter-dropdown'

interface SearchFilterBarProps {
	searchQuery: string
	onSearchChange: (query: string) => void
	showFavoritesButton?: boolean
	showFavoritesOnly?: boolean
	onFavoritesToggle?: (show: boolean) => void
	favoriteCount?: number
	mealFilters?: string[]
	onMealFiltersChange?: (filters: string[]) => void
	ingredientFilters?: string[]
	onIngredientFiltersChange?: (filters: string[]) => void
	countryFilters?: string[]
	onCountryFiltersChange?: (filters: string[]) => void
	meatFilters?: string[]
	onMeatFiltersChange?: (filters: string[]) => void
	tasteFilters?: string[]
	onTasteFiltersChange?: (filters: string[]) => void
	allMeals?: string[]
	allIngredients?: string[]
	allCountries?: string[]
	allMeats?: string[]
	allTastes?: string[]
	resultCount?: number
}

const SearchFilterBar = ({
	searchQuery,
	onSearchChange,
	showFavoritesButton = false,
	showFavoritesOnly = false,
	onFavoritesToggle,
	favoriteCount = 0,
	mealFilters = [],
	onMealFiltersChange,
	ingredientFilters = [],
	onIngredientFiltersChange,
	countryFilters = [],
	onCountryFiltersChange,
	meatFilters = [],
	onMeatFiltersChange,
	tasteFilters = [],
	onTasteFiltersChange,
	allMeals = [],
	allIngredients = [],
	allCountries = [],
	allMeats = [],
	allTastes = [],
	resultCount = 0,
}: SearchFilterBarProps) => {
	const [showFilters, setShowFilters] = useState(false)

	const activeFilterCount = useMemo(() => {
		return (
			(mealFilters?.length || 0) +
			(ingredientFilters?.length || 0) +
			(countryFilters?.length || 0) +
			(meatFilters?.length || 0) +
			(tasteFilters?.length || 0)
		)
	}, [mealFilters, ingredientFilters, countryFilters, meatFilters, tasteFilters])

	const handleClearAllFilters = () => {
		onMealFiltersChange?.([])
		onIngredientFiltersChange?.([])
		onCountryFiltersChange?.([])
		onMeatFiltersChange?.([])
		onTasteFiltersChange?.([])
	}

	return (
		<div className='space-y-6'>
			{/* Main Search Bar */}
			<div className='flex gap-3 items-end'>
				<div className='flex-1'>
					<input
						type='text'
						placeholder='Search recipes by name, ingredient, taste, country...'
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className='w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors'
					/>
				</div>

				{/* Favorites Button */}
				{showFavoritesButton && onFavoritesToggle && (
					<button
						onClick={() => onFavoritesToggle(!showFavoritesOnly)}
						className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
							showFavoritesOnly
								? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
								: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
						}`}
					>
						<Heart className='w-5 h-5' fill={showFavoritesOnly ? 'currentColor' : 'none'} /> Favorites
						{favoriteCount > 0 && (
							<span className='ml-1 px-2 py-0.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full text-xs font-bold'>
								{favoriteCount}
							</span>
						)}
					</button>
				)}

				{/* Filters Toggle */}
				<button
					onClick={() => setShowFilters(!showFilters)}
					className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap relative ${
						showFilters
							? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
							: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
					}`}
				>
					<Sliders className='w-5 h-5' /> Filters
					{activeFilterCount > 0 && (
						<span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
							{activeFilterCount}
						</span>
					)}
				</button>
			</div>

			{/* Filter Panel */}
			{showFilters && (
				<div className='bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800/30 space-y-4'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-bold text-zinc-900 dark:text-white flex items-center gap-2'>
							<Search className='w-5 h-5' /> Advanced Filters
						</h3>
						{activeFilterCount > 0 && (
							<button
								onClick={handleClearAllFilters}
								className='text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors'
							>
								Clear All
							</button>
						)}
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{allMeals && allMeals.length > 0 && onMealFiltersChange && (
							<FilterDropdown
								title='Meal Type'
								icon={<UtensilsCrossed className='w-4 h-4' />}
								options={allMeals}
								selectedOptions={mealFilters}
								onSelectionChange={onMealFiltersChange}
								placeholder='All meals'
							/>
						)}

						{allIngredients && allIngredients.length > 0 && onIngredientFiltersChange && (
							<FilterDropdown
								title='Ingredient'
								icon={<Leaf className='w-4 h-4' />}
								options={allIngredients}
								selectedOptions={ingredientFilters}
								onSelectionChange={onIngredientFiltersChange}
								placeholder='All ingredients'
							/>
						)}

						{allCountries && allCountries.length > 0 && onCountryFiltersChange && (
							<FilterDropdown
								title='Country'
								icon={<Globe className='w-4 h-4' />}
								options={allCountries}
								selectedOptions={countryFilters}
								onSelectionChange={onCountryFiltersChange}
								placeholder='All countries'
							/>
						)}

						{allMeats && allMeats.length > 0 && onMeatFiltersChange && (
							<FilterDropdown
								title='Protein'
								icon={<Beef className='w-4 h-4' />}
								options={allMeats}
								selectedOptions={meatFilters}
								onSelectionChange={onMeatFiltersChange}
								placeholder='All proteins'
							/>
						)}

						{allTastes && allTastes.length > 0 && onTasteFiltersChange && (
							<FilterDropdown
								title='Taste'
								icon={<Zap className='w-4 h-4' />}
								options={allTastes}
								selectedOptions={tasteFilters}
								onSelectionChange={onTasteFiltersChange}
								placeholder='All tastes'
							/>
						)}
					</div>

					{/* Active Filters Display */}
					{activeFilterCount > 0 && (
						<div className='mt-4 pt-4 border-t border-orange-200 dark:border-orange-800/30'>
							<p className='text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>Active Filters:</p>
							<div className='flex flex-wrap gap-2'>
								{mealFilters.map((filter) => (
									<span
										key={filter}
										className='px-3 py-1 bg-orange-200 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100 text-xs rounded-full font-medium'
									>
										{filter}
									</span>
								))}
								{ingredientFilters.map((filter) => (
									<span
										key={filter}
										className='px-3 py-1 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 text-xs rounded-full font-medium'
									>
										{filter}
									</span>
								))}
								{countryFilters.map((filter) => (
									<span
										key={filter}
										className='px-3 py-1 bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-100 text-xs rounded-full font-medium'
									>
										{filter}
									</span>
								))}
								{meatFilters.map((filter) => (
									<span
										key={filter}
										className='px-3 py-1 bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-100 text-xs rounded-full font-medium'
									>
										{filter}
									</span>
								))}
								{tasteFilters.map((filter) => (
									<span
										key={filter}
										className='px-3 py-1 bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 text-xs rounded-full font-medium'
									>
										{filter}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default SearchFilterBar
