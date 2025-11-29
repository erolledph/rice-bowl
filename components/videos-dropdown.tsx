import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookingVideo {
	videoId: string;
	title: string;
	thumbnailUrl: string;
	description: string;
	channelTitle: string;
	publishedAt: string;
}

interface VideosDropdownProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function VideosDropdown({
	isOpen = false,
	onClose,
}: VideosDropdownProps) {
	const [videos, setVideos] = useState<CookingVideo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showDropdown, setShowDropdown] = useState(isOpen);

	useEffect(() => {
		if (!showDropdown) return;

		const fetchVideos = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch('/api/cooking-videos');

				if (!response.ok) {
					throw new Error('Failed to fetch videos');
				}

				const data = await response.json();

				if (data.status === 'success' && data.videos) {
					setVideos(data.videos);
				} else if (data.message) {
					setError(data.message);
				}
			} catch (err: any) {
				console.error('Error fetching videos:', err);
				setError(err.message || 'Failed to load videos');
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, [showDropdown]);

	const handleClose = () => {
		setShowDropdown(false);
		onClose?.();
	};

	return (
		<div className="relative group">
			{/* Trigger Button */}
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
				title="Watch cooking videos"
			>
				<span className="text-lg">🎥</span>
				<span className="hidden sm:inline">Videos</span>
			</button>

			{/* Dropdown Menu */}
			{showDropdown && (
				<div
					className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
					onMouseLeave={handleClose}
				>
					{/* Header */}
					<div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-lg">
						<div className="flex items-center justify-between">
							<h3 className="font-bold text-lg">🍳 Cooking Videos</h3>
							<button
								onClick={handleClose}
								className="text-white hover:bg-white/20 rounded p-1"
								aria-label="Close"
							>
								✕
							</button>
						</div>
						<p className="text-sm text-orange-50 mt-1">
							Explore cooking tutorials
						</p>
					</div>

					{/* Content */}
					<div className="p-4">
						{loading ? (
							<div className="flex justify-center items-center py-8">
								<div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
							</div>
						) : error ? (
							<div className="text-center py-6">
								<p className="text-red-600 dark:text-red-400 text-sm">
									{error}
								</p>
								<button
									onClick={() => setShowDropdown(true)}
									className="mt-2 text-orange-600 hover:text-orange-700 text-sm underline"
								>
									Try again
								</button>
							</div>
						) : videos.length === 0 ? (
							<p className="text-gray-500 dark:text-gray-400 text-center py-6">
								No videos found
							</p>
						) : (
							<div className="space-y-3">
								{videos.map((video) => (
									<a
										key={video.videoId}
										href={`https://www.youtube.com/watch?v=${video.videoId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="group/video block hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
									>
										<div className="flex gap-3">
											{/* Thumbnail */}
											<img
												src={video.thumbnailUrl}
												alt={video.title}
												className="w-20 h-20 rounded object-cover flex-shrink-0"
											/>

											{/* Video Info */}
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 group-hover/video:text-orange-600 dark:group-hover/video:text-orange-400 transition-colors">
													{video.title}
												</h4>
												<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
													{video.channelTitle}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
													{new Date(
														video.publishedAt
													).toLocaleDateString()}
												</p>
											</div>

											{/* Play Icon */}
											<div className="flex items-center justify-center">
												<div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white group-hover/video:scale-110 transition-transform">
													▶
												</div>
											</div>
										</div>
									</a>
								))}

								{/* View All Link */}
								<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
									<a
										href="https://www.youtube.com/results?search_query=cooking+tutorial+recipe"
										target="_blank"
										rel="noopener noreferrer"
										className="block text-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm"
									>
										View more on YouTube →
									</a>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
