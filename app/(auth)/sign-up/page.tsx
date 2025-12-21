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
import { signupSchema } from '@/app/schemas/auth';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignupPage() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: signupSchema,
		},
		onSubmit: async ({ value }: { value: z.infer<typeof signupSchema> }) => {
			startTransition(async () => {
				try {
					await authClient.signUp.email({
						name: value.name,
						email: value.email,
						password: value.password,
						fetchOptions: {
							onSuccess: () => {
								toast.success('Signed up successfully');
								router.push('/');
							},
							onError: ({ error }: { error: { message: string } }) => {
								toast.error('Failed to sign up', {
									description: error?.message ?? 'Unknown error',
								});
							},
						},
					});
				} catch (error: unknown) {
					toast.error('Failed to sign up', {
						description: error instanceof Error ? error.message : 'Unknown error',
					});
				}
			});
		},
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl text-orange-500">Sign Up</CardTitle>
				<CardDescription>Create a new account!</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="signup-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}>
					<FieldGroup className="gap-y-4">
						<form.Field name="name">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid &&
									field.state.meta.errors.length > 0;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												field.handleChange(e.target.value)
											}
											aria-invalid={isInvalid}
											placeholder="John Doe"
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="email">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												field.handleChange(e.target.value)
											}
											aria-invalid={isInvalid}
											placeholder="john.doe@example.com"
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="password">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												field.handleChange(e.target.value)
											}
											aria-invalid={isInvalid}
											placeholder="••••••••"
											autoComplete="off"
											type="password"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="confirmPassword">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												field.handleChange(e.target.value)
											}
											aria-invalid={isInvalid}
											placeholder="••••••••"
											autoComplete="off"
											type="password"
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
						form="signup-form"
						disabled={isPending}
						className="w-full bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-orange-300">
						{isPending ? (
							<div className="flex items-center gap-2">
								<Spinner />
								<span>Signing up...</span>
							</div>
						) : (
							'Sign Up'
						)}
					</Button>
				</Field>
			</CardFooter>
			<span className="text-sm text-center text-muted-foreground mb-4 mx-auto">
				Already have an account?
				<Link href="/login" className={buttonVariants({ variant: 'link' })}>
					Login
				</Link>
			</span>
		</Card>
	);
}
