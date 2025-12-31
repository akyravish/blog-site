import { CommentSectionSkeleton } from '@/components/web/commentSection';

export default function BlogPostSkeleton() {
	return (
		<>
			<div className="animate-pulse">
				<div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden shadow-sm mt-12">
					<div className="bg-gray-200 animate-pulse h-full w-full" />
				</div>
			</div>
			<div className="space-y-4 flex flex-col">
				<div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
				<div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
				<div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
				<div className="h-4 w-2/3 bg-gray-200 animate-pulse" />
				<div className="h-4 w-full bg-gray-200 animate-pulse" />
			</div>
			<CommentSectionSkeleton />
		</>
	);
}
