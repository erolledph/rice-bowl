import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import Page from '@/components/page'
import Section from '@/components/section'
import VideoCard from '@/components/video-card'
import VideoPlayer from '@/components/video-player'
import VideosSkeleton from '@/components/videos-skeleton'

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
	const [selectedVideo, setSelectedVideo] = useState<CookingVideo | null>(null)
	const [playerOpen, setPlayerOpen] = useState(false)

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
				} else if (data.status === 'error' && data.message) {
					// Gracefully handle error - show message but don't fail
					console.warn('Videos API message:', data.message)
					setError(data.message)
				}
			} catch (err: any) {
				console.error('Error fetching videos:', err)
				// Don't show error to user, just set it gracefully
				setError('Unable to load videos at the moment. Please refresh to try again.')
			} finally {
				setLoading(false)
			}
		}

		fetchVideos()
	}, [])

	const handleVideoClick = (video: CookingVideo) => {
		setSelectedVideo(video)
		setPlayerOpen(true)
	}

	const handleClosePlayer = () => {
		setPlayerOpen(false)
		// Clear selected video after animation
		setTimeout(() => setSelectedVideo(null), 300)
	}

	return (
		<Page>
			<Section>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>
						Cooking Videos
					</h1>
					<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-8'>
						Discover amazing cooking tutorials and recipes from professional chefs
					</p>
				</div>

				{/* Loading State - Show Skeleton */}
				{loading && (
					<div className='mt-12'>
						<VideosSkeleton count={6} />
					</div>
				)}

				{/* Error State - Graceful Display */}
				{error && !loading && videos.length === 0 && (
					<div className='mt-12 text-center py-16'>
						<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4'>
							<Play className='w-8 h-8 text-orange-600 dark:text-orange-400' />
						</div>
						<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-2'>
							Unable to Load Videos
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 max-w-md mx-auto'>
							{error || 'We are having trouble loading videos right now. Please refresh the page to try again.'}
						</p>
					</div>
				)}

				{/* Success State - Show Videos Grid */}
				{!loading && videos.length > 0 && (
					<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24'>
						{videos.map((video) => (
							<VideoCard
								key={video.videoId}
								video={video}
								onClick={handleVideoClick}
							/>
						))}
					</div>
				)}

				{/* No Videos - With Error */}
				{!loading && !error && videos.length === 0 && (
					<div className='mt-12 text-center py-16'>
						<Play className='w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4' />
						<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-2'>
							No Videos Available
						</p>
						<p className='text-zinc-500 dark:text-zinc-500'>
							Please try refreshing the page
						</p>
					</div>
				)}

				{/* Video Player Modal */}
				<VideoPlayer
					video={selectedVideo}
					isOpen={playerOpen}
					onClose={handleClosePlayer}
				/>
			</Section>
		</Page>
	)
}

export default VideosPage
