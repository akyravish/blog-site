import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';

export const createAuthComment = mutation({
	args: {
		postId: v.id('posts'),
		content: v.string(),
	},
	returns: v.id('comments'),
	handler: async (ctx, args) => {
		const { postId, content } = args;

		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user || !user._id) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to comment',
			});
		}

		return await ctx.db.insert('comments', {
			postId,
			content,
			author: user._id,
			authorName: user.name,
		});
	},
});

export const getCommentsByPostId = query({
	args: {
		postId: v.id('posts'),
	},
	returns: v.array(
		v.object({
			_id: v.id('comments'),
			_creationTime: v.number(),
			content: v.string(),
			author: v.string(),
			authorName: v.string(),
		}),
	),
	handler: async (ctx, args) => {
		const { postId } = args;

		const comments = await ctx.db
			.query('comments')
			.withIndex('by_post', (q) => q.eq('postId', postId))
			.order('desc')
			.collect();

		return Promise.all(
			comments.map(async (comment) => {
				return {
					_id: comment._id,
					_creationTime: comment._creationTime,
					content: comment.content,
					author: comment.author,
					authorName: comment.authorName,
				};
			}),
		);
	},
});
