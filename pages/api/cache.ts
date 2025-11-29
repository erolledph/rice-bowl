import { NextApiRequest, NextApiResponse } from 'next';
import { getCacheStats, clearVideoCache } from '@/lib/video-cache';

interface CacheResponse {
  status: 'success' | 'error';
  message?: string;
  stats?: {
    entries: number;
    size: string;
    queries: string[];
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CacheResponse>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get cache statistics
      const stats = getCacheStats();
      console.log('[Cache API] Stats requested:', stats);

      return res.status(200).json({
        status: 'success',
        message: 'Cache statistics',
        stats,
      });
    } else if (req.method === 'DELETE') {
      // Clear cache
      const { query } = req.query;
      const queryStr = query ? (Array.isArray(query) ? query[0] : query) : undefined;

      if (queryStr) {
        clearVideoCache(queryStr);
        console.log(`[Cache API] Cleared cache for query: "${queryStr}"`);
        return res.status(200).json({
          status: 'success',
          message: `Cache cleared for query: "${queryStr}"`,
        });
      } else {
        clearVideoCache();
        console.log('[Cache API] Cleared entire cache');
        return res.status(200).json({
          status: 'success',
          message: 'Entire cache cleared',
        });
      }
    } else if (req.method === 'POST') {
      // POST can also clear cache
      const { action, query } = req.body;

      if (action === 'clear') {
        if (query) {
          clearVideoCache(query);
          console.log(`[Cache API] Cleared cache for query: "${query}"`);
          return res.status(200).json({
            status: 'success',
            message: `Cache cleared for query: "${query}"`,
          });
        } else {
          clearVideoCache();
          console.log('[Cache API] Cleared entire cache');
          return res.status(200).json({
            status: 'success',
            message: 'Entire cache cleared',
          });
        }
      }

      return res.status(400).json({
        status: 'error',
        message: 'Invalid action. Use action: "clear"',
      });
    }

    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Use GET, POST, or DELETE',
    });
  } catch (error: any) {
    console.error('[Cache API] Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
