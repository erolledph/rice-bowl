// YouTube API configuration
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_TTL_SECONDS = 7200; // 2 hours

// Quota tracking
let quotaUsedToday = 0;
let quotaResetTime = Date.now() + 24 * 60 * 60 * 1000; // UTC midnight

// In-memory cache store (with versioning)
interface VideoCache {
	data: CookingVideo[] | null;
	timestamp: number;
	etag: string | null;
	quotaUsed: number;
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
	quotaUsed: 0,
};

/**
 * Mock videos for development/fallback when API key is not available
 */
function getMockVideos(): CookingVideo[] {
	return [
		{
			videoId: 'dQw4w9WgXcQ',
			title: 'Easy Chocolate Chip Cookies Recipe',
			thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/medium.jpg',
			description: 'Learn how to make delicious homemade chocolate chip cookies with this easy step-by-step tutorial.',
			channelTitle: 'Cooking Basics',
			publishedAt: '2023-01-15T10:00:00Z',
		},
		{
			videoId: 'jNQXAC9IVRw',
			title: 'Perfect Pasta Carbonara - Italian Recipe',
			thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/medium.jpg',
			description: 'Master the classic Italian pasta carbonara with authentic technique and fresh ingredients.',
			channelTitle: 'Italian Cooking',
			publishedAt: '2023-02-20T14:30:00Z',
		},
		{
			videoId: 'E07s5ZFNsHo',
			title: 'Homemade Pizza Dough Tutorial',
			thumbnailUrl: 'https://i.ytimg.com/vi/E07s5ZFNsHo/medium.jpg',
			description: 'Step-by-step guide to making perfect pizza dough from scratch. Tips and tricks included!',
			channelTitle: 'Pizza Master',
			publishedAt: '2023-03-10T09:15:00Z',
		},
		{
			videoId: '9bZkp7q19f0',
			title: 'Thai Green Curry - Restaurant Quality',
			thumbnailUrl: 'https://i.ytimg.com/vi/9bZkp7q19f0/medium.jpg',
			description: 'Create authentic Thai green curry at home with professional cooking techniques.',
			channelTitle: 'Asian Cuisine',
			publishedAt: '2023-04-05T11:45:00Z',
		},
		{
			videoId: 'MNyUw0d5bXY',
			title: 'Sushi Rolling Masterclass',
			thumbnailUrl: 'https://i.ytimg.com/vi/MNyUw0d5bXY/medium.jpg',
			description: 'Learn the art of sushi rolling with expert techniques and fresh ingredients.',
			channelTitle: 'Sushi Chef Academy',
			publishedAt: '2023-05-12T16:20:00Z',
		},
		{
			videoId: 'cRpdIrq7Rbo',
			title: 'Beef Stir Fry - Quick & Easy',
			thumbnailUrl: 'https://i.ytimg.com/vi/cRpdIrq7Rbo/medium.jpg',
			description: 'Fast and delicious beef stir fry recipe perfect for weeknight dinners.',
			channelTitle: 'Quick Meals',
			publishedAt: '2023-06-08T13:00:00Z',
		},
		{
			videoId: 'gQvQvERMoW0',
			title: 'Creamy Salmon Pasta',
			thumbnailUrl: 'https://i.ytimg.com/vi/gQvQvERMoW0/medium.jpg',
			description: 'Elegant and simple salmon pasta with creamy sauce - perfect for special occasions.',
			channelTitle: 'Fine Dining at Home',
			publishedAt: '2023-07-22T10:30:00Z',
		},
		{
			videoId: 'gODZzSOelME',
			title: 'Homemade Bread Baking Guide',
			thumbnailUrl: 'https://i.ytimg.com/vi/gODZzSOelME/medium.jpg',
			description: 'Complete guide to baking perfect artisan bread at home with professional tips.',
			channelTitle: 'Bread Bakers',
			publishedAt: '2023-08-14T15:45:00Z',
		},
		{
			videoId: 'pFUJEm8nTOE',
			title: 'Chicken Tikka Masala Recipe',
			thumbnailUrl: 'https://i.ytimg.com/vi/pFUJEm8nTOE/medium.jpg',
			description: 'Authentic Indian chicken tikka masala made with aromatic spices and cream.',
			channelTitle: 'Indian Cooking',
			publishedAt: '2023-09-03T12:15:00Z',
		},
		{
			videoId: 'Bxc_6fVbPLc',
			title: 'Chocolate Lava Cake - Dessert',
			thumbnailUrl: 'https://i.ytimg.com/vi/Bxc_6fVbPLc/medium.jpg',
			description: 'Impress your guests with this elegant chocolate lava cake recipe.',
			channelTitle: 'Dessert Creations',
			publishedAt: '2023-10-11T14:20:00Z',
		},
		{
			videoId: 'e4NLzh5Pq7Y',
			title: 'Spanish Paella - Traditional Recipe',
			thumbnailUrl: 'https://i.ytimg.com/vi/e4NLzh5Pq7Y/medium.jpg',
			description: 'Learn to cook authentic Spanish paella with seafood and saffron.',
			channelTitle: 'Spanish Cuisine',
			publishedAt: '2023-11-05T17:00:00Z',
		},
		{
			videoId: 'Y2WwLVcVZAA',
			title: 'Vegetable Curry - Vegan Recipe',
			thumbnailUrl: 'https://i.ytimg.com/vi/Y2WwLVcVZAA/medium.jpg',
			description: 'Delicious and healthy vegan vegetable curry packed with flavor and nutrition.',
			channelTitle: 'Plant Based Kitchen',
			publishedAt: '2023-12-02T11:30:00Z',
		},
	];
}
export async function refreshCookingVideosCache(): Promise<CookingVideo[] | null> {
	try {
		// Check if API key is configured
		if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_api_key') {
			console.log('[YouTube API] No valid API key. Using fallback mock data.');
			// Use mock data when API key is not configured
			return getMockVideos();
		}

		// Reset quota counter if new day
		if (Date.now() > quotaResetTime) {
			quotaUsedToday = 0;
			quotaResetTime = Date.now() + 24 * 60 * 60 * 1000;
		}

		// Warn if approaching quota limit (10,000 units/day typical)
		if (quotaUsedToday > 9000) {
			console.warn(`[YouTube API] ⚠️ High quota usage: ${quotaUsedToday}/10000`);
			// Return cached data instead of making new request
			if (videoCache.data) {
				console.log('[YouTube API] Using cache due to quota concerns');
				return videoCache.data;
			}
		}

		// Search parameters optimized for cooking content
		const params = new URLSearchParams({
			part: 'snippet',
			q: 'cooking tutorial recipe', // Specific query for cooking
			videoCategoryId: '26', // Howto & Style category
			type: 'video',
			maxResults: '12', // Show 12 videos in dropdown
			key: YOUTUBE_API_KEY || '',
			order: 'relevance',
			// Optimization: only get snippet to save quota
			// Alternative: use part=id then batch fetch snippets
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
			console.log('[YouTube API] Content not modified (304). Cache still valid. Quota saved: 100');
			videoCache.timestamp = Date.now();
			return videoCache.data;
		}

		// HTTP 200 OK: New data received (100 quota units cost)
		if (!response.ok) {
			throw new Error(`YouTube API error: ${response.statusText}`);
		}

		const data = await response.json();

		// Track quota usage
		quotaUsedToday += 100; // Standard search: 100 units
		console.log(`[YouTube API] Quota used: ${quotaUsedToday}/10000 (updated +100)`);

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
			quotaUsed: quotaUsedToday,
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
		// Fall back to mock data on error
		console.log('[YouTube API] Falling back to mock data due to error');
		return getMockVideos();
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
 * Get current quota usage
 */
export function getQuotaStatus(): {
	used: number;
	limit: number;
	percentUsed: number;
	resetIn: string;
	status: 'ok' | 'warning' | 'critical';
} {
	const now = Date.now();
	const timeUntilReset = quotaResetTime - now;
	const hours = Math.floor(timeUntilReset / (60 * 60 * 1000));
	const minutes = Math.floor((timeUntilReset % (60 * 60 * 1000)) / (60 * 1000));
	const resetIn = `${hours}h ${minutes}m`;

	const limit = 10000; // YouTube API default daily limit
	const percentUsed = (quotaUsedToday / limit) * 100;

	let status: 'ok' | 'warning' | 'critical' = 'ok';
	if (percentUsed > 90) status = 'critical';
	else if (percentUsed > 70) status = 'warning';

	return {
		used: quotaUsedToday,
		limit,
		percentUsed: parseFloat(percentUsed.toFixed(2)),
		resetIn,
		status,
	};
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
