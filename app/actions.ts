'use server';
import { z } from 'zod';
import { createBlogSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { getToken } from '@/lib/auth-server';

export async function createBlogAction({ value }: { value: z.infer<typeof createBlogSchema> }) {
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

	// create the post
	await fetchMutation(
		api.posts.createPost,
		{
			title: validateData.data.title,
			content: validateData.data.content,
		},
		{ token },
	);

	return redirect('/');
}
