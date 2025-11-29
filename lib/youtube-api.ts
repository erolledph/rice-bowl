// YouTube API configuration
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_TTL_SECONDS = 3600; // 1 hour

// In-memory cache store
interface VideoCache {
	data: CookingVideo[] | null;
	timestamp: number;
	etag: string | null;
}

interface CookingVideo {
	videoId: string;
	title: string;
	thumbnailUrl: string;
	description: string;
	channelTitle: string;
	publishedAt: string;
}

let videoCache: VideoCache = {
	data: null,
	timestamp: 0,
	etag: null,
};

/**
 * Fetch and cache cooking videos from YouTube API
 * Uses ETag for zero-cost update checks
 */
export async function refreshCookingVideosCache(): Promise<CookingVideo[] | null> {
	try {
		// Search parameters optimized for cooking content
		const params = new URLSearchParams({
			part: 'snippet',
			q: 'cooking tutorial recipe', // Specific query for cooking
			videoCategoryId: '26', // Howto & Style category
			type: 'video',
			maxResults: '12', // Show 12 videos in dropdown
			key: YOUTUBE_API_KEY || '',
			order: 'relevance',
		});

		const headers: HeadersInit = {};

		// Use ETag for efficient caching (no quota used if unchanged)
		if (videoCache.etag) {
			headers['If-None-Match'] = videoCache.etag;
		}

		console.log('[YouTube API] Fetching cooking videos...');

		const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`, {
			headers,
			next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
		});

		// HTTP 304 Not Modified: Cache is still fresh (0 quota cost)
		if (response.status === 304) {
			console.log('[YouTube API] Content not modified (304). Cache still valid.');
			videoCache.timestamp = Date.now();
			return videoCache.data;
		}

		// HTTP 200 OK: New data received (100 quota units cost)
		if (!response.ok) {
			throw new Error(`YouTube API error: ${response.statusText}`);
		}

		const data = await response.json();

		// Extract ETag for next request
		const newEtag = response.headers.get('etag');

		// Process and store videos
		const videos: CookingVideo[] = (data.items || []).map(
			(item: any) => ({
				videoId: item.id.videoId,
				title: item.snippet.title,
				thumbnailUrl:
					item.snippet.thumbnails.medium?.url ||
					item.snippet.thumbnails.default?.url,
				description: item.snippet.description,
				channelTitle: item.snippet.channelTitle,
				publishedAt: item.snippet.publishedAt,
			})
		);

		// Update cache
		videoCache = {
			data: videos,
			timestamp: Date.now(),
			etag: newEtag,
		};

		console.log(`[YouTube API] Cache updated with ${videos.length} videos.`);
		return videos;
	} catch (error) {
		console.error('[YouTube API] Error fetching videos:', error);
		// Return stale cache if available
		if (videoCache.data) {
			console.log(
				'[YouTube API] Returning stale cache data due to error'
			);
			return videoCache.data;
		}
		return null;
	}
}

/**
 * Get cached videos or refresh if expired
 */
export function getCachedVideos(): CookingVideo[] | null {
	const isCacheExpired = Date.now() > videoCache.timestamp + CACHE_TTL_SECONDS * 1000;

	if (videoCache.data && !isCacheExpired) {
		console.log('[YouTube API] Serving from cache');
		return videoCache.data;
	}

	return null;
}

/**
 * Get video watch URL
 */
export function getVideoUrl(videoId: string): string {
	return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Get video embed URL
 */
export function getVideoEmbedUrl(videoId: string): string {
	return `https://www.youtube.com/embed/${videoId}`;
}
