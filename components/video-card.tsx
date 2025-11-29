import React from 'react'

interface CookingVideo {
	videoId: string
	title: string
	thumbnailUrl: string
	description: string
	channelTitle: string
	publishedAt: string
}

interface VideoCardProps {
	video: CookingVideo
	onClick: (video: CookingVideo) => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
	return (
		<div
			className='rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group'
			onClick={() => onClick(video)}
		>
			{/* Thumbnail */}
			<div className='relative w-full h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700'>
				<img
					src={video.thumbnailUrl}
					alt={video.title}
					className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
				/>

				{/* Play Button Overlay */}
				<div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors'>
					<div className='w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
						<svg
							className='w-6 h-6 text-white fill-white'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path d='M8 5v14l11-7z' />
						</svg>
					</div>
				</div>

				{/* YouTube Badge */}
				<div className='absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold'>
					YouTube
				</div>
			</div>

			{/* Content */}
			<div className='p-4'>
				<h3 className='font-bold text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'>
					{video.title}
				</h3>

				<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-2'>{video.channelTitle}</p>

				<p className='text-xs text-zinc-500 dark:text-zinc-500 mt-1'>
					{new Date(video.publishedAt).toLocaleDateString()}
				</p>

				<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-2 leading-relaxed'>
					{video.description}
				</p>
			</div>
		</div>
	)
}
