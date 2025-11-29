import React, { createContext, useContext, useState } from 'react'

interface VideoPlayerContextType {
	playingVideoId: string | null
	setPlayingVideoId: (videoId: string | null) => void
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined)

export function VideoPlayerProvider({ children }: { children: React.ReactNode }) {
	const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

	return (
		<VideoPlayerContext.Provider value={{ playingVideoId, setPlayingVideoId }}>
			{children}
		</VideoPlayerContext.Provider>
	)
}

export function useVideoPlayer() {
	const context = useContext(VideoPlayerContext)
	if (!context) {
		throw new Error('useVideoPlayer must be used within VideoPlayerProvider')
	}
	return context
}
