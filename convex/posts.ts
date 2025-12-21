import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';

// Create a new blog post
export const createPost = mutation({
	args: {
		title: v.string(),
		content: v.string(),
		image: v.id('_storage'),
	},
	handler: async (ctx, args) => {
		const { title, content } = args;
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user || !user._id) {
			throw new ConvexError('Not authenticated');
		}
		const post = await ctx.db.insert('posts', {
			title,
			content,
			author: user._id,
			imageStorageId: args.image,
		});
		return post;
	},
});

// Get all blog posts
export const getPosts = query({
	args: {},
	handler: async (ctx) => {
		const posts = await ctx.db.query('posts').order('desc').collect();

		return Promise.all(
			posts.map(async (post) => {
				const resolvedImagedUrl =
					post.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;
				return {
					...post,
					imageUrl: resolvedImagedUrl,
				};
			}),
		);
	},
});

// Get a single blog post by ID
export const getPostById = query({
	args: {
		postId: v.id('posts'),
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);
		if (!post) {
			throw new ConvexError('Post not found');
		}
		return post;
	},
});

// generate image upload url
export const generateImageUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user || !user._id) {
			throw new ConvexError('Not authenticated');
		}

		return await ctx.storage.generateUploadUrl();
	},
});
