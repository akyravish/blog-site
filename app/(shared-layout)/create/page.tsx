'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useForm } from '@tanstack/react-form';
import { createBlogSchema } from '@/app/schemas/blog';
import z from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function CreatePage() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const createPost = useMutation(api.posts.createAuthPost);
	const form = useForm({
		defaultValues: {
			title: '',
			content: '',
		},
		validators: {
			onSubmit: createBlogSchema,
		},
		onSubmit: async ({ value }: { value: z.infer<typeof createBlogSchema> }) => {
			startTransition(async () => {
				try {
					await createPost({
						title: value.title,
						content: value.content,
					});
					toast.success('Blog article created successfully');
					router.push('/');
				} catch (error: unknown) {
					console.error(error);
					toast.error('Failed to create blog article', {
						description: error instanceof Error ? error.message : 'Unknown error',
					});
				}
			});
		},
	});
	return (
		<div className="py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					Create a new post to share with the world.
				</p>
			</div>
			<Card className="w-full max-w-xl mx-auto">
				<CardHeader>
					<CardTitle>Create Blog Article</CardTitle>
					<CardDescription>Fill in the form below to create a new blog article.</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						id="create-blog-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}>
						<FieldGroup className="gap-y-4">
							<form.Field name="title">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid &&
										field.state.meta.errors.length > 0;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Title</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													field.handleChange(e.target.value)
												}
												aria-invalid={isInvalid}
												placeholder="Enter your blog title"
												autoComplete="off"
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="content">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid &&
										field.state.meta.errors.length > 0;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Content</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
													field.handleChange(e.target.value)
												}
												aria-invalid={isInvalid}
												placeholder="Enter your blog content"
												rows={10}
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="mt-4">
						<Button type="submit" form="create-blog-form" disabled={isPending} className="w-full">
							{isPending ? (
								<div className="flex items-center gap-2">
									<Spinner />
									<span>Creating blog article...</span>
								</div>
							) : (
								'Create Blog Article'
							)}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
