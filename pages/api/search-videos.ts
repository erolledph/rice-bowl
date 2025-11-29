import { NextApiRequest, NextApiResponse } from 'next';

interface YouTubeVideo {
	videoId: string;
	title: string;
	thumbnailUrl: string;
	description: string;
	channelTitle: string;
	publishedAt: string;
}

interface ApiResponse {
	status: 'success' | 'error';
	videos?: YouTubeVideo[];
	message?: string;
	nextPageToken?: string | null;
	source?: 'youtube' | 'mock';
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// Mock videos for development/fallback
function generateMockVideos(query: string, count: number = 20): YouTubeVideo[] {
	const mockTitles = [
		`${query} - Easy Recipe`,
		`How to Cook ${query} - Tutorial`,
		`Best ${query} Recipe - Professional`,
		`Quick ${query} - 30 Minutes`,
		`Homemade ${query} - Step by Step`,
		`${query} Masterclass - Chef Guide`,
		`${query} for Beginners`,
		`Restaurant Style ${query}`,
		`Healthy ${query} Recipe`,
		`Traditional ${query} - Authentic`,
		`${query} with Fresh Ingredients`,
		`Pro Tips for ${query}`,
		`${query} Cooking Challenge`,
		`${query} - Multiple Variations`,
		`Street Food ${query} Recipe`,
		`${query} - Budget Friendly`,
		`Crispy ${query} Recipe`,
		`${query} - Kitchen Hack`,
		`Perfect ${query} Every Time`,
		`${query} - Secret Ingredient`,
	];

	const mockChannels = [
		'Food Channel',
		'Cooking Basics',
		'Chef Academy',
		'Home Chef',
		'Food Network',
		'Kitchen Chronicles',
		'Recipe Masters',
		'Culinary Arts',
		'Food Lab',
		'Pro Cooking',
	];

	const videos: YouTubeVideo[] = [];
	for (let i = 0; i < Math.min(count, mockTitles.length); i++) {
		videos.push({
			videoId: `mock_${query.replace(/\s/g, '_')}_${i}`,
			title: mockTitles[i],
			thumbnailUrl: `https://i.ytimg.com/vi/mock_${i}/medium.jpg`,
			description: `Learn how to make delicious ${query} with this comprehensive cooking guide. Perfect for home cooks and beginners.`,
			channelTitle: mockChannels[i % mockChannels.length],
			publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
		});
	}

	return videos;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>
) {
	// Allow CORS for frontend requests
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	try {
		const { q, pageToken } = req.query;

		// Require search query
		if (!q || typeof q !== 'string' || q.trim().length === 0) {
			return res.status(400).json({
				status: 'error',
				message: 'Search query required',
			});
		}

		// Check if API key is configured
		if (!YOUTUBE_API_KEY) {
			console.log('[Search Videos API] No YouTube API key, using mock data');
			const mockVideos = generateMockVideos(q.trim(), 20);
			return res.status(200).json({
				status: 'success',
				videos: mockVideos,
				nextPageToken: null,
				source: 'mock',
			});
		}

		// Build search parameters
		const params = new URLSearchParams({
			part: 'snippet',
			q: q.trim(), // Use user's search query
			type: 'video',
			maxResults: '20', // Fetch 20 videos per request for better results
			key: YOUTUBE_API_KEY,
			order: 'relevance',
		});

		// Add page token for pagination
		if (pageToken && typeof pageToken === 'string') {
			params.append('pageToken', pageToken);
		}

		console.log(`[Search Videos API] Searching YouTube for: "${q.trim()}"`);

		const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('[Search Videos API] YouTube API error:', errorData);

			// Fallback to mock data on API error
			console.log('[Search Videos API] Falling back to mock data due to YouTube API error');
			const mockVideos = generateMockVideos(q.trim(), 20);
			return res.status(200).json({
				status: 'success',
				videos: mockVideos,
				nextPageToken: null,
				source: 'mock',
				message: 'Using mock data due to API limitations',
			});
		}

		const data = await response.json();

		// Process and map videos
		const videos: YouTubeVideo[] = (data.items || [])
			.map((item: any) => {
				// Skip if not a valid video
				if (!item.id.videoId) return null;

				return {
					videoId: item.id.videoId,
					title: item.snippet.title,
					thumbnailUrl:
						item.snippet.thumbnails.medium?.url ||
						item.snippet.thumbnails.default?.url ||
						'',
					description: item.snippet.description || '',
					channelTitle: item.snippet.channelTitle || '',
					publishedAt: item.snippet.publishedAt || '',
				};
			})
			.filter((video: YouTubeVideo | null) => video !== null);

		console.log(
			`[Search Videos API] Found ${videos.length} real YouTube videos for "${q}"`
		);

		return res.status(200).json({
			status: 'success',
			videos,
			nextPageToken: data.nextPageToken || null,
			source: 'youtube',
		});
	} catch (error: any) {
		console.error('[Search Videos API] Error:', error.message);

		// Fallback to mock data on any error
		const q = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
		const mockVideos = generateMockVideos((q as string) || 'cooking', 20);

		return res.status(200).json({
			status: 'success',
			videos: mockVideos,
			nextPageToken: null,
			source: 'mock',
			message: 'Using mock data due to connectivity issues',
		});
	}
}
