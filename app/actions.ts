'use server';
import { z } from 'zod';
import { createBlogSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';

export async function createBlogAction({ value }: { value: z.infer<typeof createBlogSchema> }) {
	try {
		// validate the form data
		const validateData = createBlogSchema.safeParse(value);
		if (!validateData.success) {
			throw new Error('Invalid form data');
		}

		// get the auth token
		const token = await getToken();

		if (!token) {
			throw new Error('Not authenticated');
		}

		const imageUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });

		const result = await fetch(imageUrl, {
			method: 'POST',
			headers: {
				'Content-Type': validateData.data.image.type,
			},
			body: validateData.data.image,
		});

		if (!result.ok) {
			throw new Error('Image upload failed');
		}

		const { storageId } = await result.json();

		// create the post
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
		console.error('Image upload failed', error);
		return {
			error: 'Failed to create blog post',
		};
	}

	return redirect('/blog');
}
