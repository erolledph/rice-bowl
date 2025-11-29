import { NextApiRequest, NextApiResponse } from 'next';
import {
	refreshCookingVideosCache,
	getCachedVideos,
} from '../../lib/youtube-api';

interface ApiResponse {
	status: 'success' | 'error';
	source?: 'cache' | 'fresh' | 'stale-cache';
	videos?: any[];
	message?: string;
}

const CACHE_TTL_SECONDS = 3600; // 1 hour
let lastRefreshTime = 0;

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
		// Check if we should refresh the cache
		const now = Date.now();
		const shouldRefresh = now - lastRefreshTime > CACHE_TTL_SECONDS * 1000;

		let videos = getCachedVideos();

		if (!videos || shouldRefresh) {
			console.log('[API] Cache expired or missing. Refreshing...');

			// Await the refresh to ensure we have data
			videos = await refreshCookingVideosCache();
			lastRefreshTime = Date.now();
			console.log('[API] Cache refresh complete');

			if (!videos) {
				// This shouldn't happen, but handle it gracefully
				return res.status(500).json({
					status: 'error',
					message: 'Failed to fetch cooking videos.',
				});
			}

			return res.status(200).json({
				status: 'success',
				source: 'fresh',
				videos,
			});
		}

		// Cache hit
		return res.status(200).json({
			status: 'success',
			source: 'cache',
			videos,
		});
	} catch (error: any) {
		console.error('[API] Error:', error);

		return res.status(500).json({
			status: 'error',
			message: `Failed to fetch cooking videos: ${error.message}`,
		});
	}
}
