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
	const [allVideos, setAllVideos] = useState<CookingVideo[]>([]) // All videos from API
	const [displayedVideos, setDisplayedVideos] = useState<CookingVideo[]>([]) // Videos currently displayed (pagination)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedVideo, setSelectedVideo] = useState<CookingVideo | null>(null)
	const [playerOpen, setPlayerOpen] = useState(false)
	const [page, setPage] = useState(1)
	const observerTarget = useRef<HTMLDivElement>(null)
	const VIDEOS_PER_PAGE = 12

	// Fetch initial videos from API
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
					setAllVideos(data.videos)
					// Show first page of videos
					setDisplayedVideos(data.videos.slice(0, VIDEOS_PER_PAGE))
					setPage(1)
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

	// Filter videos based on search query - real-time like YouTube
	const filteredVideos = useMemo(() => {
		if (!searchQuery.trim()) return allVideos

		const query = searchQuery.toLowerCase()
		return allVideos.filter(
			(video) =>
				video.title.toLowerCase().includes(query) ||
				video.description.toLowerCase().includes(query) ||
				video.channelTitle.toLowerCase().includes(query)
		)
	}, [allVideos, searchQuery])

	// When search changes, reset pagination and show new filtered results
	useEffect(() => {
		const newDisplayed = filteredVideos.slice(0, VIDEOS_PER_PAGE)
		setDisplayedVideos(newDisplayed)
		setPage(1)
	}, [filteredVideos])

	// Infinite scroll observer - load more videos when user scrolls to bottom
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && !loadingMore && filteredVideos.length > 0) {
					// Load next page of videos
					const nextPage = page + 1
					const startIdx = (nextPage - 1) * VIDEOS_PER_PAGE
					const endIdx = startIdx + VIDEOS_PER_PAGE

					// Only load if there are more videos to show
					if (startIdx < filteredVideos.length) {
						setLoadingMore(true)
						// Simulate network delay for smooth UX
						setTimeout(() => {
							const newVideos = filteredVideos.slice(startIdx, endIdx)
							setDisplayedVideos((prev) => [...prev, ...newVideos])
							setPage(nextPage)
							setLoadingMore(false)
						}, 300)
					}
				}
			},
			{ 
				threshold: 0.1,
				rootMargin: '200px' // Load videos before user reaches bottom
			}
		)

		if (observerTarget.current) {
			observer.observe(observerTarget.current)
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current)
			}
		}
	}, [page, loading, loadingMore, filteredVideos])

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
		setAllVideos([])
		setDisplayedVideos([])
		window.location.reload()
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Search query is already being updated on input change
		// This just handles form submission for UX
	}

	const handleClearSearch = () => {
		setSearchQuery('')
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

					{/* Search Info */}
					{allVideos.length > 0 && (
						<p className='text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
							Showing results for: <span className='font-medium text-zinc-700 dark:text-zinc-300'>"{searchQuery || 'all videos'}"</span>
						</p>
					)}

					{/* Search Bar - Form with Submit */}
					<form onSubmit={handleSearchSubmit} className='flex gap-3 items-center mb-8'>
						<div className='flex-1'>
							<input
								type='text'
								placeholder='Search cooking videos, recipes, tutorials...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all'
							/>
						</div>
						<button 
							type='submit'
							className='px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={loading}
						>
							<Search size={20} />
							<span className='hidden sm:inline'>Search</span>
						</button>
						{searchQuery && (
							<button
								type='button'
								onClick={handleClearSearch}
								className='px-3 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium'
							>
								Clear
							</button>
						)}
					</form>
				</div>

				{/* Loading State - Show Skeleton */}
				{loading && (
					<div className='mt-12'>
						<VideosSkeleton count={6} />
					</div>
				)}

				{/* Error State - Graceful Display */}
				{error && !loading && allVideos.length === 0 && (
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

				{/* Success State - Show Videos Grid with Infinite Scroll */}
				{!loading && allVideos.length > 0 && displayedVideos.length > 0 && (
					<>
						<div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24'>
							{displayedVideos.map((video) => (
								<VideoCard
									key={`${video.videoId}-${Math.random()}`}
									video={video}
									onClick={handleVideoClick}
								/>
							))}
						</div>

						{/* Infinite scroll observer target */}
						<div
							ref={observerTarget}
							className='flex justify-center items-center py-12'
						>
							{loadingMore ? (
								<div className='flex items-center gap-3'>
									<Loader size={24} className='animate-spin text-orange-600 dark:text-orange-400' />
									<span className='text-zinc-600 dark:text-zinc-400 font-medium'>Loading more videos...</span>
								</div>
							) : (
								displayedVideos.length < filteredVideos.length && (
									<p className='text-zinc-500 dark:text-zinc-500 text-sm'>
										Scroll down to load more videos
									</p>
								)
							)}
						</div>

						{/* End of Results Message */}
						{displayedVideos.length >= filteredVideos.length && filteredVideos.length > VIDEOS_PER_PAGE && (
							<div className='text-center py-8'>
								<p className='text-zinc-500 dark:text-zinc-500 text-sm font-medium'>
									✓ All {filteredVideos.length} videos loaded
								</p>
							</div>
						)}
					</>
				)}

				{/* No Results for Search */}
				{!loading && allVideos.length > 0 && displayedVideos.length === 0 && searchQuery && (
					<div className='mt-12 text-center py-16'>
						<Search className='w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4' />
						<p className='text-lg text-zinc-600 dark:text-zinc-400 font-medium mb-2'>
							No videos found
						</p>
						<p className='text-zinc-500 dark:text-zinc-500 mb-6'>
							Try adjusting your search keywords. Search by title, channel, or description.
						</p>
						<button
							onClick={handleClearSearch}
							className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors'
						>
							Clear Search & View All
						</button>
					</div>
				)}

				{/* No Videos - With Error */}
				{!loading && !error && allVideos.length === 0 && (
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

				{/* Loading More Indicator */}
				{!loading && displayedVideos.length > 0 && displayedVideos.length < filteredVideos.length && (
					<div ref={observerTarget} className='flex justify-center items-center py-12'>
						<div className='flex items-center gap-3'>
							<Loader size={24} className='animate-spin text-orange-600 dark:text-orange-400' />
							<span className='text-zinc-600 dark:text-zinc-400 font-medium'>Loading more videos...</span>
						</div>
					</div>
				)}

				{/* End of Results Indicator */}
				{!loading && displayedVideos.length > 0 && displayedVideos.length >= filteredVideos.length && filteredVideos.length > VIDEOS_PER_PAGE && (
					<div className='text-center py-8 mt-4'>
						<p className='text-zinc-500 dark:text-zinc-500 font-medium'>
							✓ No more videos to load
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
