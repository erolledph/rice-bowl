import Link from 'next/link'
import { Heart, Github, Mail } from 'lucide-react'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className='hidden lg:block bg-gradient-to-t from-zinc-950 to-zinc-900 text-zinc-300 border-t border-zinc-800'>
			<div className='max-w-screen-xl mx-auto px-6 py-12'>
				{/* Main Content */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
					{/* Brand Section */}
					<div className='md:col-span-1'>
						<div className='mb-4'>
							<h3 className='text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
								Rice Bowl
							</h3>
							<p className='text-sm text-zinc-400 mt-2'>
								Discover, cook, and share delicious recipes from around the world.
							</p>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className='font-semibold text-white mb-4'>Quick Links</h4>
						<nav className='space-y-2'>
							<Link
								href='/recipes'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								All Recipes
							</Link>
							<Link
								href='/videos'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Cooking Videos
							</Link>
							<Link
								href='/favorites'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								My Favorites
							</Link>
							<Link
								href='/dashboard'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Dashboard
							</Link>
						</nav>
					</div>

					{/* Categories */}
					<div>
						<h4 className='font-semibold text-white mb-4'>Categories</h4>
						<nav className='space-y-2'>
							<Link
								href='/search?meal=breakfast'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Breakfast
							</Link>
							<Link
								href='/search?meal=lunch'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Lunch
							</Link>
							<Link
								href='/search?meal=dinner'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Dinner
							</Link>
							<Link
								href='/search?meal=dessert'
								className='block text-zinc-400 hover:text-orange-500 transition-colors text-sm'
							>
								Desserts
							</Link>
						</nav>
					</div>

					{/* Connect */}
					<div>
						<h4 className='font-semibold text-white mb-4'>Connect</h4>
						<div className='space-y-3'>
							<p className='text-sm text-zinc-400'>Follow us on social media</p>
							<div className='flex gap-3'>
								<a
									href='https://github.com/erolledph/rice-bowl'
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-white transition-all'
									aria-label='GitHub'
								>
									<Github className='w-5 h-5' />
								</a>
								<a
									href='mailto:contact@ricebowl.app'
									className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-white transition-all'
									aria-label='Email'
								>
									<Mail className='w-5 h-5' />
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className='border-t border-zinc-800 my-8'></div>

				{/* Bottom Section */}
				<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
					<p className='text-sm text-zinc-500'>
						&copy; {currentYear} Rice Bowl. All rights reserved.
					</p>

					<div className='flex items-center gap-2 text-sm text-zinc-500'>
						<span>Made with</span>
						<Heart className='w-4 h-4 text-red-500 fill-red-500' />
						<span>for food lovers</span>
					</div>

					<div className='flex gap-6'>
						<a
							href='#'
							className='text-sm text-zinc-400 hover:text-orange-500 transition-colors'
						>
							Privacy Policy
						</a>
						<a
							href='#'
							className='text-sm text-zinc-400 hover:text-orange-500 transition-colors'
						>
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
