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
	const data = await fetchQuery(api.posts.getPosts);
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{data.map((post) => (
				<Card key={post._id} className="p-2">
					<div className="relative h-48 w-full overflow-hidden rounded-md">
						<Image
							src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt={`${post.title} Image`}
							loading="lazy"
							fill
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
