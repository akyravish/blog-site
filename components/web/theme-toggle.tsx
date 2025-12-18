'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Toggle } from '@/components/ui/toggle';

export function ThemeChanger() {
	const { setTheme, theme } = useTheme();

	return (
		<div>
			<Toggle
				onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
				pressed={theme === 'dark'}
				variant="outline">
				{theme === 'dark' ? <Sun /> : <Moon />}
			</Toggle>
		</div>
	);
}
