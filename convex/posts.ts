import { mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';

export const createPost = mutation({
	args: {
		title: v.string(),
		content: v.string(),
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
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		return post;
	},
});
