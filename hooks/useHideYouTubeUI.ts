import { useEffect } from 'react'

export const useHideYouTubeUI = (videoId: string) => {
	useEffect(() => {
		// Create a mutation observer to continuously hide YouTube UI elements
		const observer = new MutationObserver(() => {
			// Hide all YouTube UI elements
			const elementsToHide = document.querySelectorAll(
				'.ytp-chrome-top, .ytp-chrome-bottom, .ytp-title, .ytp-title-channel, ' +
				'.ytp-watermark, .ytp-impression-link, .ytp-cards-button, .ytp-info-panel-preview, ' +
				'.ytp-share-button, .ytp-copylink-button, .ytp-playlist-menu-button, .ytp-search-button, ' +
				'.ytp-gradient-top, .ytp-gradient-bottom, .ytp-bezel, .ytp-cued-thumbnail-overlay, ' +
				'.ytp-endscreen-content, .ytp-suggested-action, .ytp-info-panel-detail-skrim, ' +
				'.iv-drawer, .ytp-player-content, .ytp-paid-content-overlay, .ytp-upnext, ' +
				'.ytp-overflow-panel, .ytp-unmute, .ytp-large-play-button, .ytp-spinner, ' +
				'.ytp-doubletap-ui, .ytp-tooltip, .html5-endscreen, .ytp-title-expanded-overlay, ' +
				'.ytp-title-channel-logo, .ytp-shorts-title-channel, .ytp-chrome-controls'
			)

			elementsToHide.forEach(element => {
				const el = element as HTMLElement
				el.style.display = 'none !important'
				el.style.visibility = 'hidden'
				el.style.opacity = '0'
				el.style.pointerEvents = 'none'
				el.style.height = '0'
				el.style.width = '0'
			})

			// Also remove the elements from DOM if possible
			const elementsToRemove = document.querySelectorAll(
				'.ytp-chrome-top, .ytp-title-expanded-overlay'
			)
			elementsToRemove.forEach(element => {
				element.remove()
			})
		})

		// Start observing the document for changes
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style', 'class']
		})

		// Also hide elements on initial load
		setTimeout(() => {
			const elementsToHide = document.querySelectorAll(
				'.ytp-chrome-top, .ytp-chrome-bottom, .ytp-title, .ytp-title-channel, ' +
				'.ytp-watermark, .ytp-impression-link, .ytp-cards-button, .ytp-info-panel-preview, ' +
				'.ytp-share-button, .ytp-copylink-button, .ytp-playlist-menu-button, .ytp-search-button, ' +
				'.ytp-gradient-top, .ytp-gradient-bottom, .ytp-bezel, .ytp-cued-thumbnail-overlay, ' +
				'.ytp-endscreen-content, .ytp-suggested-action, .ytp-info-panel-detail-skrim, ' +
				'.iv-drawer, .ytp-player-content, .ytp-paid-content-overlay, .ytp-upnext, ' +
				'.ytp-overflow-panel, .ytp-unmute, .ytp-large-play-button, .ytp-spinner, ' +
				'.ytp-doubletap-ui, .ytp-tooltip, .html5-endscreen, .ytp-title-expanded-overlay, ' +
				'.ytp-title-channel-logo, .ytp-shorts-title-channel, .ytp-chrome-controls'
			)

			elementsToHide.forEach(element => {
				const el = element as HTMLElement
				el.style.display = 'none !important'
				el.style.visibility = 'hidden'
				el.style.opacity = '0'
				el.style.pointerEvents = 'none'
			})
		}, 500)

		return () => {
			observer.disconnect()
		}
	}, [videoId])
}
