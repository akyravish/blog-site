import z from 'zod';

export const signupSchema = z
	.object({
		name: z
			.string()
			.min(3, 'Name must be at least 3 characters long')
			.max(30, 'Name must be at most 30 characters long'),
		email: z.email('Invalid email address'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long')
			.max(50, 'Password must be at most 50 characters long'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm Password must be at least 6 characters long')
			.max(50, 'Confirm Password must be at most 50 characters long'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword'],
	});

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters long')
		.max(50, 'Password must be at most 50 characters long'),
});
