import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, Heart, BookOpen, Play } from 'lucide-react'

const BottomNav = () => {
	const router = useRouter()

	return (
		<div className='sm:hidden fixed bottom-0 left-0 right-0 z-50'>
			<nav className='w-full border-t border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 pb-safe dark:border-zinc-800 dark:bg-gradient-to-r dark:from-zinc-900 dark:to-zinc-900'>
				<div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
					{links.map(({ href, label, icon }) => (
						<Link
							key={label}
							href={href}
							className={`flex h-full w-full flex-col items-center justify-center space-y-1 font-medium transition-all ${
								router.pathname === href
									? 'text-orange-500 dark:text-orange-400 scale-110'
									: 'text-zinc-700 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400'
							}`}
						>
							{icon}
							<span className={`text-xs transition-colors ${
								router.pathname === href
									? 'text-orange-500 dark:text-orange-400'
									: 'text-zinc-600 dark:text-zinc-400'
							}`}>
								{label}
							</span>
						</Link>
					))}
				</div>
			</nav>
		</div>
	)
}

export default BottomNav

const links = [
	{
		label: 'Home',
		href: '/',
		icon: <Home size={18} />,
	},
	{
		label: 'Favorites',
		href: '/favorites',
		icon: <Heart size={18} />,
	},
	{
		label: 'Recipes',
		href: '/recipes',
		icon: <BookOpen size={18} />,
	},
	{
		label: 'Videos',
		href: '/videos',
		icon: <Play size={18} />,
	},
]
