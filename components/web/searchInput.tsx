'use client';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
export default function SearchInput() {
	const [searchQuery, setSearchQuery] = useState('');
	const [open, setOpen] = useState(false);

	const results = useQuery(
		api.posts.searchPosts,
		searchQuery.length >= 2 ? { query: searchQuery, limit: 5 } : 'skip',
	);

	const handleSearch = () => {
		setOpen(true);
	};
	return (
		<div className="relative w-full max-w-md z-10">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search posts..."
					className="pl-10 w-full bg-background/50"
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						handleSearch();
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSearch();
						}
					}}
				/>
			</div>

			{open && searchQuery.length >= 2 && (
				<div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
					{results === undefined ? (
						<div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
					) : Array.isArray(results) && results.length === 0 ? (
						<div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
					) : (
						<ul className="max-h-64 overflow-y-auto divide-y">
							{results &&
								results.map((result) => (
									<li key={result._id}>
										<Link
											href={`/blog/${result._id}`}
											onClick={() => setOpen(false)}
											className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition">
											<div className="font-medium">{result.title.slice(0, 30)}...</div>
											<div className="text-xs text-muted-foreground truncate">
												{result.content.slice(0, 50)}...
											</div>
										</Link>
									</li>
								))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
