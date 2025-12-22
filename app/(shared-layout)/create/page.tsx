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
import { createBlogAction } from '@/app/actions';
import { toast } from 'sonner';

export default function CreatePage() {
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		defaultValues: {
			title: '',
			content: '',
			image: undefined as unknown as File,
		},
		validators: {
			onSubmit: createBlogSchema,
		},
		onSubmit: async ({ value }: { value: z.infer<typeof createBlogSchema> }) => {
			startTransition(async () => {
				const result = await createBlogAction({ value });
				if (result?.error) {
					toast.error(result.error);
				}
				// On success, the action redirects to /blog
			});
		},
	});
	return (
		<div className="py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-orange-500">
					Create Post
				</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					Create a new post to share with the world.
				</p>
			</div>
			<Card className="w-full max-w-xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl text-orange-500">Create Blog Article</CardTitle>
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
							<form.Field name="image">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid &&
										field.state.meta.errors.length > 0;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Image</FieldLabel>
											<Input
												type="file"
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													field.handleChange(e.target.files?.[0] as unknown as File)
												}
												aria-invalid={isInvalid}
												accept="image/*"
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
						<Button
							type="submit"
							form="create-blog-form"
							disabled={isPending}
							className="w-full bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-orange-300">
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
