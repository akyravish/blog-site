import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/web/commentSection';
import ErrorMessage from '@/components/web/error-message';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PostPresence } from '@/components/web/postPresence';
import { getToken } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

interface BlogPostPageProps {
	params: Promise<{ blogId: Id<'posts'> }>;
}

type PostData = Awaited<ReturnType<typeof fetchQuery<typeof api.posts.getPostById>>>;

const DEFAULT_IMAGE =
	'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=3548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

function hasError<T>(result: T | { error: unknown }): result is { error: unknown } {
	return typeof result === 'object' && result !== null && 'error' in result;
}

function createMetadataFromPost(post: PostData): Metadata {
	return {
		title: `Blog Post - ${post.title}`,
		description: post.content,
		openGraph: {
			title: `Blog Post - ${post.title}`,
			description: post.content,
			images: [post.imageUrl ?? ''],
		},
	};
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { blogId } = await params;
	const post = await fetchQuery(api.posts.getPostById, { postId: blogId });

	if (hasError(post)) {
		return {
			title: 'Blog Post',
			description: 'Blog post page',
		};
	}

	return createMetadataFromPost(post);
}

async function fetchUserId(token: string | null | undefined): Promise<string | null> {
	if (!token) return null;

	try {
		const result = await fetchQuery(api.presence.getUserIds, {}, { token });
		return typeof result === 'string' ? result : null;
	} catch {
		return null;
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { blogId } = await params;
	const token = (await getToken()) ?? null;

	const [comments, post, userId] = await Promise.all([
		preloadQuery(api.comment.getCommentsByPostId, { postId: blogId }),
		fetchQuery(api.posts.getPostById, { postId: blogId }),
		fetchUserId(token),
	]);

	if (!userId) {
		return redirect('/login');
	}

	if (hasError(comments) || hasError(post)) {
		return (
			<ErrorMessage
				title="Failed to load blog post or comments"
				message="Something went wrong. Please try again later."
				link="/blog"
			/>
		);
	}

	return (
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
			<BlogPostContent post={post} userId={userId} />
			<Separator className="my-4" />
			<CommentSection preloadedComments={comments} />
		</div>
	);
}

function formatPostDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString();
}

async function BlogPostContent({ post, userId }: { post: PostData; userId: string | null }) {
	return (
		<>
			<div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden shadow-sm mt-12">
				<Image
					src={post.imageUrl ?? DEFAULT_IMAGE}
					alt={post.title}
					fill
					priority
					sizes="(max-width: 768px) 100vw, 768px"
					className="object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
				/>
			</div>
			<div className="space-y-4 flex flex-col">
				<h1 className="text-4xl font-bold tracking-tight text-orange-500">{post.title}</h1>
				<div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="size-4 text-muted-foreground" />
						{formatPostDate(post._creationTime)}
					</div>
					{userId && <PostPresence roomId={post._id} userId={userId} />}
				</div>
				<Separator className="my-4" />
				<p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
					{post.content}
				</p>
			</div>
		</>
	);
}
