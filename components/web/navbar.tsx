import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ThemeChanger } from './theme-toggle';
import { NavbarAuth } from './navbar-auth';

export const Navigation = () => {
	return (
		<nav className="w-full py-5 flex item-center justify-between">
			<div className="flex items-center gap-8">
				<Link href="/">
					<h1 className="text-3xl font-bold">
						Next<span className="text-orange-500">Pro</span>
					</h1>
				</Link>
			</div>
			<div className="flex items-center gap-2">
				<Link href="/" className={buttonVariants({ variant: 'link' })}>
					Home
				</Link>
				<Link href="/blog" className={buttonVariants({ variant: 'link' })}>
					Blog
				</Link>
				<Link href="/create" className={buttonVariants({ variant: 'link' })}>
					Create
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<NavbarAuth />
				<ThemeChanger />
			</div>
		</nav>
	);
};
