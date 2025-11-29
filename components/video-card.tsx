import React from 'react'
import { useVideoPlayer } from '@/contexts/VideoPlayerContext'

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
	const { playingVideoId, setPlayingVideoId } = useVideoPlayer()
	const isPlaying = playingVideoId === video.videoId

	const handleClick = () => {
		setPlayingVideoId(video.videoId)
	}

	const handleStop = () => {
		setPlayingVideoId(null)
	}

	return (
		<div className='rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group'>
			{/* Video Container */}
			<div className='relative w-full h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700'>
				{!isPlaying ? (
					<>
						{/* Thumbnail */}
						<img
							src={video.thumbnailUrl}
							alt={video.title}
							className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
						/>

						{/* Play Button Overlay */}
						<div
							onClick={handleClick}
							className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors cursor-pointer'
						>
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
					</>
				) : (
					<div className='relative w-full h-full'>
						<iframe
							width='100%'
							height='100%'
							src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
							title={video.title}
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
							className='w-full h-full'
						/>
						{/* Stop Button */}
						<button
							onClick={(e) => {
								e.stopPropagation()
								handleStop()
							}}
							className='absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors'
						>
							Stop
						</button>
					</div>
				)}
			</div>

			{/* Content - Only Title */}
			<div className='p-4'>
				<h3 className='font-bold text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'>
					{video.title}
				</h3>
			</div>
		</div>
	)
}
