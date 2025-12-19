'use client';
import { useForm } from '@tanstack/react-form';
import { loginSchema } from '@/app/schemas/auth';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import z from 'zod';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }: { value: z.infer<typeof loginSchema> }) => {
			setIsSubmitted(true);
			try {
				await authClient.signIn.email({
					email: value.email,
					password: value.password,
					fetchOptions: {
						onSuccess: () => {
							toast.success('Logged in successfully');
							router.push('/');
						},
						onError: ({ error }) => {
							toast.error('Failed to login', {
								description: error?.message ?? 'Unknown error',
							});
						},
					},
				});
			} catch (error) {
				console.error('Error:', error);
			} finally {
				setIsSubmitted(false);
			}
		},
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>Login to your account!</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="login-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}>
					<FieldGroup className="gap-y-4">
						<form.Field name="email">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid &&
									field.state.meta.errors.length > 0;

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
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal" className="mt-4">
					<Button type="submit" form="login-form" disabled={isSubmitted} className="w-full">
						{isSubmitted ? (
							<div className="flex items-center gap-2">
								<Spinner />
								<span>Logging in...</span>
							</div>
						) : (
							'Login'
						)}
					</Button>
				</Field>
			</CardFooter>
			<span className="text-sm text-center">
				Don&apos;t have an account?
				<Link href="/sign-up" className={buttonVariants({ variant: 'link' })}>
					Sign Up
				</Link>
			</span>
		</Card>
	);
}
