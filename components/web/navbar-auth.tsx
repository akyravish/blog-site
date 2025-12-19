'use client';

import { useConvexAuth } from 'convex/react';
import { buttonVariants } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const NavbarAuth = () => {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleLogout() {
		try {
			setLoading(true);
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success('Logged out successfully');
						router.push('/');
					},
					onError: () => {
						toast.error('Failed to logout');
					},
				},
			});
		} catch (error: unknown) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{isAuthenticated ? (
						<Button onClick={handleLogout} disabled={loading}>
							{loading ? <Spinner /> : 'Logout'}
						</Button>
					) : (
						<>
							<Link href="/login" className={buttonVariants({ variant: 'outline' })}>
								Login
							</Link>
							<Link href="/sign-up" className={buttonVariants({ variant: 'default' })}>
								Sign up
							</Link>
						</>
					)}
				</>
			)}
		</>
	);
};
