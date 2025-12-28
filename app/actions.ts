'use server';
import { z } from 'zod';
import { createBlogSchema, createCommentSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';
import { ConvexError } from 'convex/values';
import { revalidatePath } from 'next/cache';
import { Id } from '@/convex/_generated/dataModel';

export async function createBlogAction({ value }: { value: z.infer<typeof createBlogSchema> }) {
	// Validate the form data
	const validateData = createBlogSchema.safeParse(value);
	if (!validateData.success) {
		return { error: 'Invalid form data. Please check your inputs.' };
	}

	// Get the auth token
	const token = await getToken();
	if (!token) {
		return { error: 'You must be logged in to create a post.' };
	}

	try {
		// Generate upload URL
		const imageUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });

		// Upload the image
		const uploadResult = await fetch(imageUrl, {
			method: 'POST',
			headers: {
				'Content-Type': validateData.data.image.type,
			},
			body: validateData.data.image,
		});

		if (!uploadResult.ok) {
			return { error: 'Failed to upload image. Please try again.' };
		}

		const { storageId } = await uploadResult.json();

		// Create the post
		await fetchMutation(
			api.posts.createPost,
			{
				title: validateData.data.title,
				content: validateData.data.content,
				image: storageId,
			},
			{ token },
		);
	} catch (error) {
		console.error('Failed to create blog post:', error);

		// Handle Convex errors with structured data
		if (error instanceof ConvexError) {
			const data = error.data as { code?: string; message?: string };
			return { error: data.message ?? 'Failed to create blog post.' };
		}

		return { error: 'Something went wrong. Please try again.' };
	}

	revalidatePath('/blog');
	redirect('/blog');
}

export async function createCommentAction({
	value,
}: {
	value: z.infer<typeof createCommentSchema>;
}) {
	// Validate the form data
	const validateData = createCommentSchema.safeParse(value);

	if (!validateData.success) {
		return { error: 'Invalid form data. Please check your inputs.' };
	}

	const token = await getToken();

	if (!token) {
		return { error: 'You must be logged in to comment.' };
	}

	try {
		// Create the comment
		await fetchMutation(
			api.comment.createAuthComment,
			{
				postId: validateData.data.postId as Id<'posts'>,
				content: validateData.data.content,
			},
			{ token },
		);

		// Revalidate the blog post page to show the new comment
		revalidatePath(`/blog/${validateData.data.postId}`);

		return { success: true };
	} catch (error) {
		console.error('Failed to create comment:', error);

		// Handle Convex errors with structured data
		if (error instanceof ConvexError) {
			const data = error.data as { code?: string; message?: string };
			return { error: data.message ?? 'Failed to create comment. Please try again.' };
		}

		return { error: 'Failed to create comment. Please try again.' };
	}
}
