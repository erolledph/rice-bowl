/**
 * Server-side video cache to minimize YouTube API calls
 * Caches results in memory with configurable TTL
 * Falls back to mock data when cache is invalid or API fails
 */

interface CachedVideoData {
  videos: any[];
  nextPageToken: string | null;
  timestamp: number;
  source: 'youtube' | 'mock';
}

interface CacheEntry {
  data: CachedVideoData;
  expiresAt: number;
}

// In-memory cache storage
const videoCache: Map<string, CacheEntry> = new Map();

// Configuration
const CACHE_TTL_MS = 7200000; // 2 hours in milliseconds (safely handles 5k users @ 5 searches/day)
const CACHE_TTL_MIN = CACHE_TTL_MS / 60000; // Convert to minutes for logging

/**
 * Generate cache key for a search query
 */
function getCacheKey(query: string, pageToken?: string): string {
  const normalizedQuery = query.toLowerCase().trim();
  return pageToken ? `${normalizedQuery}:${pageToken}` : normalizedQuery;
}

/**
 * Get cached video data if valid, otherwise return null
 */
export function getCachedVideos(query: string, pageToken?: string): CachedVideoData | null {
  const key = getCacheKey(query, pageToken);
  const entry = videoCache.get(key);

  if (!entry) {
    return null;
  }

  // Check if cache has expired
  if (Date.now() > entry.expiresAt) {
    videoCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Store video data in cache with TTL
 */
export function setCachedVideos(
  query: string,
  data: CachedVideoData,
  pageToken?: string
): void {
  const key = getCacheKey(query, pageToken);
  const expiresAt = Date.now() + CACHE_TTL_MS;

  videoCache.set(key, {
    data,
    expiresAt,
  });

  console.log(
    `[Video Cache] Cached ${data.videos.length} videos for query "${query}" (expires in ${CACHE_TTL_MIN}min, source: ${data.source})`
  );
}

/**
 * Clear all cache or specific query cache
 */
export function clearVideoCache(query?: string): void {
  if (query) {
    const key = getCacheKey(query);
    const deleted = videoCache.delete(key);
    if (deleted) {
      console.log(`[Video Cache] Cleared cache for query "${query}"`);
    }
  } else {
    const size = videoCache.size;
    videoCache.clear();
    console.log(`[Video Cache] Cleared entire cache (${size} entries removed)`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  entries: number;
  size: string;
  queries: string[];
} {
  const entries = videoCache.size;
  const queries = Array.from(videoCache.keys());

  // Rough estimate of cache size in KB
  const sizeBytes = JSON.stringify(Array.from(videoCache.values())).length;
  const sizeKB = (sizeBytes / 1024).toFixed(2);

  return {
    entries,
    size: `${sizeKB} KB`,
    queries,
  };
}

/**
 * Initialize cache cleanup interval
 * Removes expired entries every 5 minutes
 */
export function initializeCacheCleanup(): void {
  setInterval(() => {
    const now = Date.now();
    let cleaned = 0;

    videoCache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        videoCache.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`[Video Cache] Cleaned up ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000); // Run every 5 minutes

  console.log('[Video Cache] Cleanup interval initialized (5 min intervals)');
}
