import z from 'zod';

export const createBlogSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
	content: z
		.string()
		.min(1, 'Content is required')
		.max(1000, 'Content must be less than 1000 characters'),
	image: z.instanceof(File).refine((file) => file.size <= 1 * 1024 * 1024, {
		message: 'Image size must be less than or equal to 1MB',
	}),
});
