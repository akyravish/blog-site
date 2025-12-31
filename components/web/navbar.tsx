import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ThemeChanger } from './theme-toggle';
import { NavbarAuth } from './navbar-auth';
import SearchInput from './searchInput';

export const Navigation = () => {
	return (
		<nav className="w-full py-5 flex items-center justify-between">
			<div className="flex items-center gap-8">
				<Link href="/">
					<h1 className="text-3xl font-bold">
						Next<span className="text-orange-500">Pro</span>
					</h1>
				</Link>
				<div className="hidden md:flex items-center gap-1">
					<Link href="/" className={buttonVariants({ variant: 'ghost' })}>
						Home
					</Link>
					<Link href="/blog" className={buttonVariants({ variant: 'ghost' })}>
						Blog
					</Link>
					<Link href="/create" className={buttonVariants({ variant: 'ghost' })}>
						Create
					</Link>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden md:block">
					<SearchInput />
				</div>
				<NavbarAuth />
				<ThemeChanger />
			</div>
		</nav>
	);
};
