import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useHideYouTubeUI } from '@/hooks/useHideYouTubeUI'

interface CookingVideo {
	videoId: string
	title: string
	thumbnailUrl: string
	description: string
	channelTitle: string
	publishedAt: string
}

interface VideoPlayerProps {
	video: CookingVideo | null
	isOpen: boolean
	onClose: () => void
}

export default function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = 'auto'
		}
	}, [isOpen, onClose])

	// Load YouTube IFrame API
	useEffect(() => {
		if (!window.YT) {
			const script = document.createElement('script')
			script.src = 'https://www.youtube.com/iframe_api'
			document.body.appendChild(script)
		}
	}, [])

	// Use hook to hide YouTube UI
	useHideYouTubeUI(video?.videoId || '')

	if (!isOpen || !video) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
			{/* Modal Container */}
			<div className='w-full max-w-4xl mx-auto px-4 max-h-screen overflow-y-auto'>
				<div className='bg-zinc-900 rounded-xl overflow-hidden shadow-2xl'>
					{/* Close Button */}
					<div className='flex justify-between items-center p-4 border-b border-zinc-800'>
						<h2 className='text-white font-bold text-lg line-clamp-1'>{video.title}</h2>
						<button
							onClick={onClose}
							className='text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg'
							aria-label='Close'
						>
							<X size={24} />
						</button>
					</div>

					{/* Video Player */}
					<div className='relative w-full bg-black overflow-hidden' style={{ aspectRatio: '16/9' }}>
						<div className='youtube-container-hidden-details'>
							<iframe
								id={`youtube-modal-player-${video.videoId}`}
								src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&fs=0&iv_load_policy=3`}
								title={video.title}
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								allowFullScreen
								loading='lazy'
								style={{ pointerEvents: 'none' }}
							></iframe>
						</div>
					</div>

					{/* Video Info */}
					<div className='p-6 bg-zinc-900'>
						<h3 className='text-white font-bold text-lg mb-2'>{video.title}</h3>

						<p className='text-red-500 font-semibold text-sm mb-2'>{video.channelTitle}</p>

						<p className='text-zinc-400 text-sm mb-4'>
							Published: {new Date(video.publishedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>

						<p className='text-zinc-300 text-sm leading-relaxed mb-4'>{video.description}</p>

						{/* Watch on YouTube Link */}
						<a
							href={`https://www.youtube.com/watch?v=${video.videoId}`}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-block mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors'
						>
							Watch on YouTube
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
