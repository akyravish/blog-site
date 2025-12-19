import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="absolute top-4 left-4">
				<Link href="/" className={buttonVariants({ variant: 'secondary' })}>
					<ArrowLeft className="size-4" />
					<span>Back</span>
				</Link>
			</div>
			<div className="max-w-md w-full mx-auto">{children}</div>
		</div>
	);
}
