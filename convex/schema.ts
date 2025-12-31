import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	posts: defineTable({
		title: v.string(),
		content: v.string(),
		author: v.string(),
		imageStorageId: v.id('_storage'),
	})
		.index('by_author', ['author'])
		.searchIndex('search_posts', {
			searchField: 'title',
		})
		.searchIndex('search_posts_content', {
			searchField: 'content',
		}),
	comments: defineTable({
		postId: v.id('posts'),
		author: v.string(),
		authorName: v.string(),
		content: v.string(),
	})
		.index('by_post', ['postId'])
		.searchIndex('search_comments', {
			searchField: 'content',
		}),
});
