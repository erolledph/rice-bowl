/**
 * Cache statistics and monitoring endpoint
 * GET /api/cache-stats - View cache performance metrics
 * POST /api/cache-stats?action=clear - Clear cache (admin only)
 * POST /api/cache-stats?action=reset-stats - Reset statistics
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { recipeCache, videoCache, apiCache } from '@/lib/cache';
import { getQuotaStatus } from '@/lib/youtube-api';

interface CacheStatsResponse {
	timestamp: string;
	recipes: ReturnType<typeof recipeCache.getStats>;
	videos: ReturnType<typeof videoCache.getStats>;
	api: ReturnType<typeof apiCache.getStats>;
	quotaStatus: ReturnType<typeof getQuotaStatus>;
	hotKeys: {
		recipes: Array<{ key: string; hits: number; age: number }>;
		videos: Array<{ key: string; hits: number; age: number }>;
	};
	summary: {
		totalEntries: number;
		totalMemory: string;
		overallHitRate: number;
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CacheStatsResponse | { error: string } | { message: string }>
) {
	// Optional: Add admin password check
	const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
	const isAdmin = req.headers['x-admin-token'] === adminPassword;

	if (req.method === 'GET') {
		try {
			const recipeStats = recipeCache.getStats();
			const videoStats = videoCache.getStats();
			const apiStats = apiCache.getStats();
			const quotaStatus = getQuotaStatus();

			// Calculate totals
			const totalEntries = recipeStats.entries + videoStats.entries + apiStats.entries;
			const totalSize = parseFloat(
				(
					parseFloat(recipeStats.totalSize) +
					parseFloat(videoStats.totalSize) +
					parseFloat(apiStats.totalSize)
				).toFixed(2)
			);

			const totalHits = recipeStats.hits + videoStats.hits + apiStats.hits;
			const totalMisses = recipeStats.misses + videoStats.misses + apiStats.misses;
			const overallHitRate =
				totalHits + totalMisses > 0
					? parseFloat(((totalHits / (totalHits + totalMisses)) * 100).toFixed(2))
					: 0;

			return res.status(200).json({
				timestamp: new Date().toISOString(),
				recipes: recipeStats,
				videos: videoStats,
				api: apiStats,
				quotaStatus,
				hotKeys: {
					recipes: recipeCache.getHotKeys(5),
					videos: videoCache.getHotKeys(5),
				},
				summary: {
					totalEntries,
					totalMemory: `${totalSize} KB`,
					overallHitRate,
				},
			});
		} catch (error) {
			return res.status(500).json({
				error: `Failed to get cache stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
			});
		}
	}

	if (req.method === 'POST') {
		if (!isAdmin) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const action = req.query.action as string;

		try {
			if (action === 'clear') {
				const target = req.query.target as string | undefined;
				if (target === 'recipes') {
					recipeCache.clear();
				} else if (target === 'videos') {
					videoCache.clear();
				} else if (target === 'api') {
					apiCache.clear();
				} else {
					recipeCache.clear();
					videoCache.clear();
					apiCache.clear();
				}
				return res.status(200).json({ message: `Cache cleared${target ? ` (${target})` : ''}` });
			}

			if (action === 'reset-stats') {
				recipeCache.resetStats();
				videoCache.resetStats();
				apiCache.resetStats();
				return res.status(200).json({ message: 'Statistics reset' });
			}

			if (action === 'warm') {
				// Placeholder for cache warming logic
				return res.status(200).json({ message: 'Cache warming started' });
			}

			return res.status(400).json({ error: 'Invalid action' });
		} catch (error) {
			return res.status(500).json({
				error: `Failed to perform action: ${error instanceof Error ? error.message : 'Unknown error'}`,
			});
		}
	}

	return res.status(405).json({ error: 'Method not allowed' });
}
