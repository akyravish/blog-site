import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';
import { Doc, Id } from './_generated/dataModel';

// Create a new blog post
export const createPost = mutation({
	args: {
		title: v.string(),
		content: v.string(),
		image: v.id('_storage'),
	},
	returns: v.id('posts'),
	handler: async (ctx, args) => {
		const { title, content } = args;
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user || !user._id) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to create a post',
			});
		}

		return await ctx.db.insert('posts', {
			title,
			content,
			author: user._id,
			imageStorageId: args.image,
		});
	},
});

// Get all blog posts
export const getPosts = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id('posts'),
			_creationTime: v.number(),
			title: v.string(),
			content: v.string(),
			author: v.string(),
			imageStorageId: v.id('_storage'),
			imageUrl: v.union(v.string(), v.null()),
		}),
	),
	handler: async (ctx) => {
		const posts = await ctx.db.query('posts').order('desc').collect();

		return Promise.all(
			posts.map(async (post) => {
				const resolvedImageUrl = await ctx.storage.getUrl(post.imageStorageId);
				return {
					...post,
					imageUrl: resolvedImageUrl,
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
	returns: v.object({
		_id: v.id('posts'),
		_creationTime: v.number(),
		title: v.string(),
		content: v.string(),
		author: v.string(),
		imageUrl: v.union(v.string(), v.null()),
	}),
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);

		if (!post) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: `Post with ID "${args.postId}" not found`,
			});
		}

		let resolvedImageUrl: string | null = null;

		if (post?.imageStorageId && typeof post.imageStorageId === 'string') {
			resolvedImageUrl = await ctx.storage.getUrl(post.imageStorageId);
		}

		return {
			title: post.title,
			content: post.content,
			author: post.author,
			_creationTime: post._creationTime,
			_id: post._id,
			imageUrl: resolvedImageUrl,
		};
	},
});

// Generate image upload url
export const generateImageUploadUrl = mutation({
	args: {},
	returns: v.string(),
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user || !user._id) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to upload images',
			});
		}

		return await ctx.storage.generateUploadUrl();
	},
});

interface searchResult {
	_id: Id<'posts'>;
	title: string;
	content: string;
}

// Search for posts
export const searchPosts = query({
	args: {
		query: v.string(),
		limit: v.optional(v.number()),
	},
	returns: v.array(
		v.object({
			_id: v.id('posts'),
			title: v.string(),
			content: v.string(),
		}),
	),
	handler: async (ctx, args) => {
		const { query, limit } = args;

		const results: searchResult[] = [];

		const seen = new Set<string>();

		const pushDocs = async (docs: Doc<'posts'>[]) => {
			for (const doc of docs) {
				if (seen.has(doc._id)) continue;
				seen.add(doc._id);
				results.push({
					_id: doc._id,
					title: doc.title,
					content: doc.content,
				});

				if (results.length >= (limit ?? 5)) break;
			}
		};

		const titleMatches = await ctx.db
			.query('posts')
			.withSearchIndex('search_posts', (q) => q.search('title', query))
			.take(limit ?? 5);

		await pushDocs(titleMatches);

		if (results.length < (limit ?? 5)) {
			const contentMatches = await ctx.db
				.query('posts')
				.withSearchIndex('search_posts_content', (q) => q.search('content', query))
				.take(limit ?? 5);
			await pushDocs(contentMatches);
		}

		return results;
	},
});
