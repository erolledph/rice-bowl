import React from 'react'
import { Maximize2 } from 'lucide-react'
import { useVideoPlayer } from '@/contexts/VideoPlayerContext'
import Image from 'next/image' // <-- fixes the <img> warning too

interface CookingVideo {
  videoId: string
  title: string
  thumbnailUrl: string
  description: string
  channelTitle: string
  publishedAt: string
}

interface VideoCardProps {
  video: CookingVideo
}

export default function VideoCard({ video }: VideoCardProps) {
  const { playingVideoId, setPlayingVideoId } = useVideoPlayer()
  const isPlaying = playingVideoId === video.videoId

  const handlePlay = () => setPlayingVideoId(video.videoId)
  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPlayingVideoId(null)
  }

  // Properly typed fullscreen with Safari/iOS support
  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const iframe = document.querySelector(
      `iframe[data-videoid="${video.videoId}"]`
    ) as HTMLIFrameElement | null

    if (!iframe) return

    const requestFs = 
      iframe.requestFullscreen ||
      // @ts-ignore - Safari still uses webkit prefix in 2025
      iframe.webkitRequestFullscreen ||
      // @ts-ignore - very old Android
      (iframe as any).mozRequestFullScreen ||
      (iframe as any).msRequestFullscreen

    if (requestFs) {
      requestFs.call(iframe)
    }
  }

  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
      {/* Thumbnail / Player */}
      <div className="relative w-full bg-black">
        {!isPlaying ? (
          <>
            {/* Optimized Next.js Image */}
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={480}
              height={270}
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized // YouTube thumbnails are already optimized
            />

            {/* Play Overlay */}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </>
        ) : (
          /* ──────── Super Clean YouTube Embed (2025) ──────── */
          <div className="youtube-clean">
            <iframe
              data-videoid={video.videoId}
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&cc_load_policy=0&iv_load_policy=3`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="pointer-events-auto"
            />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>
      </div>

      {/* Floating Controls */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleFullscreen}
            className="p-2.5 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-all"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleStop}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  )
}
