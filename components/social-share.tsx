import { useState } from 'react'
import { Share2, MessageCircle, Mail, Link as LinkIcon, Check } from 'lucide-react'

interface SocialShareProps {
	title: string
	description: string
	url: string
}

const SocialShare = ({ title, description, url }: SocialShareProps) => {
	const [copied, setCopied] = useState(false)

	const shareLinks = {
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
		whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
		pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
		email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`,
	}

	const handleCopyLink = () => {
		navigator.clipboard.writeText(url)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleShare = (platform: string, link: string) => {
		if (platform === 'copy') {
			handleCopyLink()
		} else {
			window.open(link, '_blank', 'width=600,height=400')
		}
	}

	return (
		<div className='bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-900'>
			<h3 className='text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2'>
				<Share2 className='w-5 h-5' /> Share This Recipe
			</h3>
			<div className='flex flex-wrap gap-3'>
				{/* Facebook */}
				<button
					onClick={() => handleShare('facebook', shareLinks.facebook)}
					className='flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors font-medium'
					title='Share on Facebook'
				>
					<span>f</span>
					<span className='hidden sm:inline'>Facebook</span>
				</button>

				{/* Twitter */}
				<button
					onClick={() => handleShare('twitter', shareLinks.twitter)}
					className='flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition-colors font-medium'
					title='Share on Twitter'
				>
					<span>𝕏</span>
					<span className='hidden sm:inline'>Twitter</span>
				</button>

				{/* WhatsApp */}
				<button
					onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
					className='flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition-colors font-medium'
					title='Share on WhatsApp'
				>
					<MessageCircle className='w-5 h-5' />
					<span className='hidden sm:inline'>WhatsApp</span>
				</button>

				{/* Pinterest */}
				<button
					onClick={() => handleShare('pinterest', shareLinks.pinterest)}
					className='flex items-center gap-2 px-4 py-2 bg-[#E60023] hover:bg-[#C4001D] text-white rounded-lg transition-colors font-medium'
					title='Share on Pinterest'
				>
					<span>P</span>
					<span className='hidden sm:inline'>Pinterest</span>
				</button>

				{/* Email */}
				<button
					onClick={() => handleShare('email', shareLinks.email)}
					className='flex items-center gap-2 px-4 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded-lg transition-colors font-medium'
					title='Share via Email'
				>
					<Mail className='w-5 h-5' />
					<span className='hidden sm:inline'>Email</span>
				</button>

				{/* Copy Link */}
				<button
					onClick={() => handleShare('copy', '')}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
						copied
							? 'bg-green-500 text-white'
							: 'bg-orange-500 hover:bg-orange-600 text-white'
					}`}
					title='Copy link to clipboard'
				>
					{copied ? <Check className='w-5 h-5' /> : <LinkIcon className='w-5 h-5' />}
					<span className='hidden sm:inline'>{copied ? 'Copied!' : 'Copy'}</span>
				</button>
			</div>
		</div>
	)
}

export default SocialShare
