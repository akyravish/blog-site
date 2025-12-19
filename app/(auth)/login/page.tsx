'use client';
import { useForm } from '@tanstack/react-form';
import { loginSchema } from '@/app/schemas/auth';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

export default function LoginPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onBlur: loginSchema,
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }) => {
			console.log('Form submitted:', value);
			setIsSubmitted(true);
			try {
				// set timeout to 2 seconds
				setTimeout(() => {
					setIsSubmitted(false);
				}, 2000);
			} catch (error) {
				console.error('Error:', error);
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
				<Field orientation="horizontal">
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
		</Card>
	);
}
