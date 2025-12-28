'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import usePresence from '@convex-dev/presence/react';
import FacePile from '@convex-dev/presence/facepile';
import { Users } from 'lucide-react';

interface PostPresenceProps {
	roomId: Id<'posts'>;
	userId: string;
}

export function PostPresence({ roomId, userId }: PostPresenceProps) {
	const presenceState = usePresence(api.presence, roomId, userId);

	if (!presenceState || !presenceState.length) {
		return null;
	}

	return (
		<div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
			<Users className="size-3.5 text-muted-foreground shrink-0" />
			<span className="text-xs font-medium text-muted-foreground">
				{presenceState.length} {presenceState.length === 1 ? 'person' : 'people'} viewing
			</span>
			<div className="ml-auto text-black">
				<FacePile presenceState={presenceState} />
			</div>
		</div>
	);
}
