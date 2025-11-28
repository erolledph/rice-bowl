const RecipeSkeleton = () => {
	return (
		<div className='animate-pulse'>
			{/* Action Buttons Skeleton */}
			<div className='flex gap-2 justify-end mb-4'>
				<div className='w-12 h-12 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
				<div className='w-12 h-12 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
				<div className='w-12 h-12 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
			</div>

			{/* Hero Image Skeleton */}
			<div className='relative h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600'></div>

			{/* Header Section */}
			<div className='mb-8 pb-6 border-b-2 border-orange-200 dark:border-orange-900'>
				{/* Title Skeleton */}
				<div className='mb-4'>
					<div className='h-12 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-3/4 mb-2'></div>
					<div className='h-12 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-2/3'></div>
				</div>

				{/* Description Skeleton */}
				<div className='space-y-2 mb-4'>
					<div className='h-5 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded'></div>
					<div className='h-5 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-5/6'></div>
				</div>

				{/* Badges Skeleton */}
				<div className='flex flex-wrap gap-2'>
					<div className='h-7 w-32 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
					<div className='h-7 w-32 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
					<div className='h-7 w-32 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
				</div>
			</div>

			{/* Recipe Info Grid Skeleton */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-900'>
				{[1, 2, 3, 4].map((i) => (
					<div key={i}>
						<div className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-20 mb-2'></div>
						<div className='h-6 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-16'></div>
					</div>
				))}
			</div>

			{/* Tags Section Skeleton */}
			<div className='mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg space-y-4'>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i}>
						<div className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-32 mb-2'></div>
						<div className='flex flex-wrap gap-2'>
							<div className='h-6 w-24 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
							<div className='h-6 w-24 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
						</div>
					</div>
				))}
			</div>

			{/* Ingredients Section Skeleton */}
			<div className='mb-8'>
				<div className='h-6 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-40 mb-4'></div>
				<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-3'>
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-4/5'></div>
					))}
				</div>
			</div>

			{/* Instructions Section Skeleton */}
			<div className='mb-8'>
				<div className='h-6 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-40 mb-4'></div>
				<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-3'>
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-full'></div>
					))}
				</div>
			</div>

			{/* Back Button Skeleton */}
			<div className='h-12 w-40 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded'></div>
		</div>
	)
}

export default RecipeSkeleton
