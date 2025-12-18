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
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: signupSchema,
			onChangeAsync: signupSchema,
		},
		onSubmit: async ({ value }) => {
			console.log('Form submitted:', value);
		},
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create a new account!</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="signup-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}>
					<FieldGroup>
						<form.Field name="name">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

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
				<Field orientation="horizontal">
					<Button type="submit" form="signup-form">
						Sign Up
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
