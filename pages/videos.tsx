import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Play, Search, Loader } from 'lucide-react'
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
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedVideo, setSelectedVideo] = useState<CookingVideo | null>(null)
	const [playerOpen, setPlayerOpen] = useState(false)
	const observerTarget = useRef<HTMLDivElement>(null)

	// Fetch initial videos
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
					// Duplicate videos to simulate more content for infinite scroll
					const allVideos = [...data.videos, ...data.videos, ...data.videos]
					setVideos(allVideos)
				} else if (data.status === 'error' && data.message) {
					console.warn('Videos API message:', data.message)
					setError(data.message)
				}
			} catch (err: any) {
				console.error('Error fetching videos:', err)
				setError('Unable to load videos at the moment. Please refresh to try again.')
			} finally {
				setLoading(false)
			}
		}

		fetchVideos()
	}, [])

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && !loadingMore && videos.length > 0) {
					// Load more videos
					setLoadingMore(true)
					setTimeout(() => {
						// Simulate loading more videos by duplicating existing ones
						setVideos((prev) => [...prev, ...prev.slice(0, 12)])
						setLoadingMore(false)
					}, 500)
				}
			},
			{ threshold: 0.1 }
		)

		if (observerTarget.current) {
			observer.observe(observerTarget.current)
		}

		return () => observer.disconnect()
	}, [loading, loadingMore, videos.length])

	// Filter videos based on search query - real-time like YouTube
	const filteredVideos = useMemo(() => {
		if (!searchQuery.trim()) return videos

		const query = searchQuery.toLowerCase()
		return videos.filter(
			(video) =>
				video.title.toLowerCase().includes(query) ||
				video.description.toLowerCase().includes(query) ||
				video.channelTitle.toLowerCase().includes(query)
		)
	}, [videos, searchQuery])

	const handleVideoClick = (video: CookingVideo) => {
		setSelectedVideo(video)
		setPlayerOpen(true)
	}

	const handleClosePlayer = () => {
		setPlayerOpen(false)
		// Clear selected video after animation
		setTimeout(() => setSelectedVideo(null), 300)
	}

	const handleRefresh = () => {
		setLoading(true)
		setError(null)
		setVideos([])
		window.location.reload()
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

					{/* Search Bar */}
					<div className='flex gap-3 items-end mb-8'>
						<div className='flex-1'>
							<input
								type='text'
								placeholder='Search cooking videos...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all'
							/>
						</div>
						<button className='px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2'>
							<Search size={20} />
							<span className='hidden sm:inline'>Search</span>
						</button>
					</div>
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
						<p className='text-zinc-500 dark:text-zinc-500 max-w-md mx-auto mb-6'>
							{error || 'We are having trouble loading videos right now. Please refresh the page to try again.'}
						</p>
						<button
							onClick={handleRefresh}
							className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors'
						>
							Refresh Videos
						</button>
					</div>
				)}

				{/* Success State - Show Videos Grid */}
				{!loading && videos.length > 0 && filteredVideos.length > 0 && (
					<>
						<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24'>
							{filteredVideos.map((video) => (
								<VideoCard
									key={video.videoId}
									video={video}
									onClick={handleVideoClick}
								/>
							))}
						</div>

						{/* Infinite scroll observer target */}
						<div
							ref={observerTarget}
							className='flex justify-center items-center py-8'
						>
							{loadingMore && (
								<div className='flex items-center gap-2 text-orange-600 dark:text-orange-400'>
									<Loader size={20} className='animate-spin' />
									<span>Loading more videos...</span>
								</div>
							)}
						</div>
					</>
				)}

				{/* No Results for Search */}
				{!loading && videos.length > 0 && filteredVideos.length === 0 && searchQuery && (
					<div className='mt-12 text-center py-16'>
						<Search className='w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4' />
						<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-2'>
							No videos found
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 mb-6'>
							Try adjusting your search keywords
						</p>
						<button
							onClick={() => setSearchQuery('')}
							className='px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors'
						>
							Clear Search
						</button>
					</div>
				)}

				{/* No Videos - With Error */}
				{!loading && !error && videos.length === 0 && (
					<div className='mt-12 text-center py-16'>
						<Play className='w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4' />
						<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-2'>
							No Videos Available
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 mb-6'>
							Please try refreshing the page
						</p>
						<button
							onClick={handleRefresh}
							className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors'
						>
							Refresh Videos
						</button>
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
