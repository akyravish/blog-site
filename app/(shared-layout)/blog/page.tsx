import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default function BlogPage() {
	return (
		<>
			<div className="py-12">
				<div className="text-center pb-12">
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-orange-500">
						Our Blogs
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Insight, stories, and tips from our team.
					</p>
				</div>
			</div>
			<div className="container mx-auto px-4">
				<Suspense fallback={<BlogCardSkeleton />}>
					<LoadBlogList />
				</Suspense>
			</div>
		</>
	);
}

async function LoadBlogList() {
	const result = await fetchQuery(api.posts.getPosts).catch((error: unknown) => {
		console.error('Failed to fetch posts:', error);
		return { error: true as const };
	});

	if ('error' in result) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="rounded-full bg-destructive/10 p-4 mb-4">
					<svg
						className="h-8 w-8 text-destructive"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-semibold">Failed to load posts</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					Something went wrong. Please try again later.
				</p>
				<Link href="/blog" className={buttonVariants({ variant: 'outline', className: 'mt-4' })}>
					Retry
				</Link>
			</div>
		);
	}

	if (result.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="rounded-full bg-muted p-4 mb-4">
					<svg
						className="h-8 w-8 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-semibold">No posts yet</h3>
				<p className="mt-1 text-sm text-muted-foreground">Check back later for new content.</p>
			</div>
		);
	}

	const defaultImage =
		'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{result.map((post) => (
				<Card key={post._id} className="p-2">
					<div className="relative h-48 w-full overflow-hidden rounded-md">
						<Image
							src={post.imageUrl ?? defaultImage}
							alt={`${post.title} Image`}
							priority
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover hover:scale-105 transition-transform duration-300"
						/>
					</div>
					<CardContent className="p-2">
						<Link href={`/blog/${post._id}`}>
							<CardTitle className="text-lg font-semibold line-clamp-2 hover:text-orange-500">
								{post.title}
							</CardTitle>
						</Link>
						<p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.content}</p>
					</CardContent>
					<CardFooter className="p-2">
						<Link
							href={`/blog/${post._id}`}
							className={buttonVariants({
								className: 'w-full',
								variant: 'colorful',
							})}>
							Read More
						</Link>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

function BlogCardSkeleton() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{[...Array(3)].map((_, id) => (
				<Card key={id} className="p-2">
					<div className="relative h-48 w-full overflow-hidden rounded-md">
						<Skeleton className="h-48 w-full rounded-xl" />
					</div>
					<CardContent className="p-2">
						<Skeleton className="h-8 w-full mb-2 rounded-xl" />

						<Skeleton className="h-4 w-full mb-1 mt-4 rounded-xl" />
						<Skeleton className="h-4 w-5/6 mb-1 rounded-xl" />
						<Skeleton className="h-4 w-4/6 rounded-xl" />
					</CardContent>
					<CardFooter className="p-2">
						<Skeleton className="h-8 w-full rounded-xl" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
