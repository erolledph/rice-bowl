import { useState, useEffect } from 'react'
import { Play, Loader } from 'lucide-react'
import Page from '@/components/page'
import Section from '@/components/section'

interface CookingVideo {
	videoId: string
	title: string
	thumbnailUrl: string
	description: string
	channelTitle: string
	publishedAt: string
}

const VideosPage = () => {
	const [videos, setVideos] = useState<CookingVideo[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await fetch('/api/cooking-videos')

				if (!response.ok) {
					throw new Error('Failed to fetch videos')
				}

				const data = await response.json()

				if (data.status === 'success' && data.videos) {
					setVideos(data.videos)
				} else if (data.message) {
					setError(data.message)
				}
			} catch (err: any) {
				console.error('Error fetching videos:', err)
				setError(err.message || 'Failed to load videos')
			} finally {
				setLoading(false)
			}
		}

		fetchVideos()
	}, [])

	return (
		<Page>
			<Section>
				<div className='space-y-4'>
					<div className='flex items-center gap-2'>
						<h1 className='text-2xl font-bold'>🎥 Cooking Videos</h1>
					</div>
					<p className='text-sm text-zinc-600 dark:text-zinc-400'>
						Explore amazing cooking tutorials and recipes
					</p>
				</div>

				{/* Loading State */}
				{loading && (
					<div className='mt-8 flex justify-center items-center py-16'>
						<div className='flex flex-col items-center gap-3'>
							<Loader className='w-8 h-8 animate-spin text-indigo-500' />
							<p className='text-zinc-600 dark:text-zinc-400'>Loading videos...</p>
						</div>
					</div>
				)}

				{/* Error State */}
				{error && !loading && (
					<div className='mt-8 p-6 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800'>
						<p className='text-red-600 dark:text-red-400 font-semibold'>Error</p>
						<p className='text-red-600 dark:text-red-400 text-sm mt-1'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors'
						>
							Try Again
						</button>
					</div>
				)}

				{/* Videos Grid */}
				{!loading && !error && videos.length === 0 && (
					<div className='mt-8 text-center py-12'>
						<p className='text-zinc-600 dark:text-zinc-400'>
							No videos found. Please try again later.
						</p>
					</div>
				)}

				{!loading && !error && videos.length > 0 && (
					<div className='mt-8 grid grid-cols-1 gap-4 pb-24'>
						{videos.map((video) => (
							<a
								key={video.videoId}
								href={`https://www.youtube.com/watch?v=${video.videoId}`}
								target='_blank'
								rel='noopener noreferrer'
								className='group rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-700'
							>
								<div className='relative'>
									{/* Thumbnail Container */}
									<div className='relative w-full h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700'>
										<img
											src={video.thumbnailUrl}
											alt={video.title}
											className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
										/>

										{/* Play Button Overlay */}
										<div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors'>
											<div className='w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
												<Play
													size={24}
													className='text-white fill-white'
													strokeWidth={0}
												/>
											</div>
										</div>

										{/* Duration Badge (if available) */}
										<div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded'>
											YouTube
										</div>
									</div>

									{/* Video Info */}
									<div className='p-4'>
										<h3 className='font-bold text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'>
											{video.title}
										</h3>

										<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-2'>
											{video.channelTitle}
										</p>

										<p className='text-xs text-zinc-500 dark:text-zinc-500 mt-1'>
											{new Date(video.publishedAt).toLocaleDateString()}
										</p>

										<p className='text-xs text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-2'>
											{video.description}
										</p>
									</div>
								</div>
							</a>
						))}
					</div>
				)}
			</Section>
		</Page>
	)
}

export default VideosPage
