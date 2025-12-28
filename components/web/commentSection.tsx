'use client';
import { Id } from '@/convex/_generated/dataModel';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader } from '../ui/card';
import { MessageSquare } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from '@tanstack/react-form';
import { createCommentSchema } from '@/app/schemas/blog';
import z from 'zod';
import { createCommentAction } from '@/app/actions';
import { toast } from 'sonner';
import { Field, FieldGroup, FieldLabel, FieldError } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { useParams } from 'next/navigation';
import { usePreloadedQuery, Preloaded } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

type Comment = {
	_id: Id<'comments'>;
	_creationTime: number;
	content: string;
	author: string;
	authorName: string;
};

function formatAuthorName(authorName: string): string {
	return authorName
		.split(' ')
		.map((name) => name.charAt(0).toUpperCase() + name.slice(1))
		.join(' ');
}

function getAuthorInitial(authorName: string): string {
	return authorName.charAt(0).toUpperCase();
}

function formatCommentDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function CommentSection({
	preloadedComments,
}: {
	preloadedComments: Preloaded<typeof api.comment.getCommentsByPostId>;
}) {
	const { blogId } = useParams<{ blogId: Id<'posts'> }>();
	const [isPending, startTransition] = useTransition();
	const commentList = usePreloadedQuery(preloadedComments);

	const form = useForm({
		defaultValues: {
			postId: blogId,
			content: '',
		},
		validators: {
			onSubmit: createCommentSchema,
		},
		onSubmit: async ({ value }: { value: z.infer<typeof createCommentSchema> }) => {
			startTransition(async () => {
				const result = await createCommentAction({ value });
				if (result?.error) {
					toast.error(result.error);
				} else if (result?.success) {
					toast.success('Comment submitted successfully!');
					form.reset();
				}
			});
		},
	});

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
				<MessageSquare className="size-4" />
				<h2 className="text-lg font-semibold">{commentList?.length} Comments</h2>
			</CardHeader>
			<CardContent>
				<form
					id="comment-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}>
					<FieldGroup className="gap-y-4">
						<form.Field name="content">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid &&
									field.state.meta.errors.length > 0;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Comment</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
												field.handleChange(e.target.value)
											}
											aria-invalid={isInvalid}
											placeholder="Enter your comment"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<Field className="mt-6">
						<Button
							type="submit"
							variant="colorful"
							className="cursor-pointer "
							disabled={isPending}>
							{isPending ? (
								<div className="flex items-center gap-2">
									<Spinner />
									<span>Submitting comment...</span>
								</div>
							) : (
								'Submit'
							)}
						</Button>
					</Field>
				</form>
				<Separator className="my-6" />
				{isPending ? (
					<div className="space-y-6 mt-4">
						<CommentSkeleton />
						<CommentSkeleton />
					</div>
				) : (
					<CommentList comments={commentList} />
				)}
			</CardContent>
		</Card>
	);
}

function CommentList({ comments }: { comments: Comment[] | undefined }) {
	if (!comments || comments.length === 0) {
		return (
			<section className="space-y-6 mt-4">
				<p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
			</section>
		);
	}

	return (
		<section className="space-y-6 mt-4">
			{comments.map((comment) => (
				<CommentItem key={comment._id} comment={comment} />
			))}
		</section>
	);
}

function CommentItem({ comment }: { comment: Comment }) {
	const formattedName = formatAuthorName(comment.authorName);
	const authorInitial = getAuthorInitial(comment.authorName);
	const formattedDate = formatCommentDate(comment._creationTime);

	return (
		<div className="flex gap-4">
			<Avatar className="size-10 shrink-0">
				<AvatarImage
					src={`https://avatar.vercel.sh/${comment.authorName}`}
					alt={comment.authorName}
				/>
				<AvatarFallback>{authorInitial}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-1 flex-1">
				<div className="flex justify-between items-center">
					<p className="text-sm font-medium">{formattedName}</p>
					<p className="text-xs text-muted-foreground">{formattedDate}</p>
				</div>
				<p className="text-sm text-muted-foreground">{comment.content}</p>
			</div>
		</div>
	);
}

export function CommentSectionSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-3/4 mb-2 rounded-xl" />
			<Skeleton className="h-4 w-1/2 mb-1 rounded-xl" />
			<Skeleton className="h-4 w-3/4 mb-1 rounded-xl" />
			<Skeleton className="h-4 w-5/6 mb-1 rounded-xl" />
			<Skeleton className="h-4 w-4/6 rounded-xl" />
		</div>
	);
}

export function CommentSkeleton() {
	return (
		<div className="flex gap-4">
			<Skeleton className="size-10 shrink-0" />
			<div className="flex flex-col gap-1 flex-1">
				<Skeleton className="h-4 w-1/2 mb-1 rounded-xl" />
				<Skeleton className="h-4 w-3/4 mb-1 rounded-xl" />
				<Skeleton className="h-4 w-5/6 mb-1 rounded-xl" />
				<Skeleton className="h-4 w-4/6 rounded-xl" />
			</div>
		</div>
	);
}
