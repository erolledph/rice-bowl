const RecipeCardsSkeleton = ({ count = 3 }: { count?: number }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className='animate-pulse rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg'>
					{/* Image Skeleton */}
					<div className='w-full h-48 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600'></div>

					{/* Content Skeleton */}
					<div className='p-4 space-y-3'>
						{/* Title */}
						<div className='h-6 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-3/4'></div>

						{/* Description */}
						<div className='space-y-2'>
							<div className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded'></div>
							<div className='h-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded w-5/6'></div>
						</div>

						{/* Info Badges */}
						<div className='flex gap-2 pt-2'>
							<div className='h-5 w-20 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
							<div className='h-5 w-20 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-full'></div>
						</div>

						{/* Footer Stats */}
						<div className='flex justify-between pt-3'>
							<div className='h-4 w-16 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded'></div>
							<div className='h-4 w-16 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded'></div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default RecipeCardsSkeleton
