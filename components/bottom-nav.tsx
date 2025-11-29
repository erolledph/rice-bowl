import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, Heart, BookOpen, Play } from 'lucide-react'

const BottomNav = () => {
	const router = useRouter()

	return (
		<div className='sm:hidden fixed bottom-0 left-0 right-0 z-50'>
			<nav className='w-full border-t bg-zinc-100 pb-safe dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
					{links.map(({ href, label, icon }) => (
						<Link
							key={label}
							href={href}
							className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${
								router.pathname === href
									? 'text-indigo-500 dark:text-indigo-400'
									: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
							}`}
						>
							{icon}
							<span className='text-xs text-zinc-600 dark:text-zinc-400'>
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
