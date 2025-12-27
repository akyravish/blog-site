import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ErrorMessage from '@/components/web/error-message';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { ArrowLeft, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

interface BlogPostPageProps {
	params: Promise<{ blogId: Id<'posts'> }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	return (
		<>
			<div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
				<Link
					href="/blog"
					className={buttonVariants({
						variant: 'colorful',
						className: 'absolute top-4 left-4 z-10',
					})}>
					<ArrowLeft className="size-4" />
					Back
				</Link>
				<Suspense fallback={<BlogPostSkeleton />}>
					<BlogPostContent params={params} />
				</Suspense>
			</div>
		</>
	);
}

async function BlogPostContent({ params }: BlogPostPageProps) {
	const { blogId } = await params;

	const post = await fetchQuery(api.posts.getPostById, { postId: blogId }).catch((error) => {
		console.error('Failed to fetch post:', error);
		return { error: true as const };
	});

	if ('error' in post) {
		return (
			<ErrorMessage
				title="Failed to load blog post"
				message="Something went wrong. Please try again later."
				link="/blog"
			/>
		);
	}
	const defaultImage =
		'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	return (
		<>
			<div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden shadow-sm mt-12">
				<Image
					src={post.imageUrl ?? defaultImage}
					alt={post.title}
					fill
					priority
					sizes="(max-width: 768px) 100vw, 768px"
					className="object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
				/>
			</div>
			<div className="space-y-4 flex flex-col">
				<h1 className="text-4xl font-bold tracking-tight text-orange-500">{post.title}</h1>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="size-4 text-muted-foreground" />
					{new Date(post._creationTime).toLocaleDateString()}
				</div>
				<Separator className="my-4" />
				<p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
					{post.content}
				</p>
			</div>
		</>
	);
}

function BlogPostSkeleton() {
	return (
		<>
			<div className="animate-pulse">
				<div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden shadow-sm mt-12">
					<div className="bg-gray-200 animate-pulse h-full w-full" />
				</div>
			</div>
			<div className="space-y-4 flex flex-col">
				<div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
				<div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
				<div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
				<div className="h-4 w-2/3 bg-gray-200 animate-pulse" />
				<div className="h-4 w-full bg-gray-200 animate-pulse" />
			</div>
		</>
	);
}
