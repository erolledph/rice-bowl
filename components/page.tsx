import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'
import Footer from '@/components/footer'

interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => (
	<>
		{title ? (
			<Head>
				<title>Rice Bowl | {title}</title>
			</Head>
		) : null}

		<Appbar />

		<main
			/**
			 * Padding top = `appbar` height
			 * Padding bottom = `bottom-nav` height on mobile, normal on desktop
			 */
			className='mx-auto max-w-screen-xl pt-20 pb-24 px-safe lg:pb-0'
		>
			<div className='p-6'>{children}</div>
		</main>

		<BottomNav />
		<Footer />
	</>
)

export default Page
