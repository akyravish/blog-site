import { Navigation } from '@/components/web/navbar';

export default function SharedLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navigation />
			{children}
		</>
	);
}
