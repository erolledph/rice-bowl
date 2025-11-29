import Link from 'next/link'
import { useRouter } from 'next/router'
import { Heart, Play, UtensilsCrossed } from 'lucide-react'

const links = [
	{ label: 'Recipes', href: '/recipes' },
	{ label: 'Favorites', href: '/favorites', icon: <Heart className='w-4 h-4' /> },
	{ label: 'Videos', href: '/videos', icon: <Play className='w-4 h-4' /> },
]

const Appbar = () => {
	const router = useRouter()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
			<header className='border-b bg-gradient-to-r from-orange-50 to-red-50 px-safe dark:border-zinc-800 dark:bg-gradient-to-r dark:from-zinc-900 dark:to-zinc-900'>
				<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
					<Link href='/' className='flex items-center gap-3 group'>
						<div className='text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform'>
							<UtensilsCrossed className='w-6 h-6' />
						</div>
						<h1 className='font-bold text-2xl bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent' style={{ fontFamily: "'Fredoka One', cursive" }}>Rice Bowl</h1>
					</Link>

					<nav className='flex items-center space-x-6'>
						<div className='hidden sm:block'>
							<div className='flex items-center space-x-6'>
								{links.map(({ label, href, icon }) => (
									<Link
										key={label}
										href={href}
										className={`text-sm flex items-center gap-1 font-medium transition-all ${
											router.pathname === href
												? 'text-orange-500 dark:text-orange-400 scale-105'
												: 'text-zinc-700 hover:text-orange-500 dark:text-zinc-300 dark:hover:text-orange-400'
										}`}
									>
										{icon}
										{label}
									</Link>
								))}
							</div>
						</div>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default Appbar
