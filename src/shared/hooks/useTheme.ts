import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'sketchnest-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readStoredTheme(): Theme {
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return stored === 'light' || stored === 'dark' || stored === 'system'
		? stored
		: 'system';
}

function applyTheme(theme: Theme) {
	const isDark =
		theme === 'dark' ||
		(theme === 'system' && window.matchMedia(DARK_QUERY).matches);
	document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>(readStoredTheme);

	useEffect(() => {
		applyTheme(theme);
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	useEffect(() => {
		if (theme !== 'system') return;
		const media = window.matchMedia(DARK_QUERY);
		const onChange = () => applyTheme('system');
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => setThemeState(next), []);

	return { theme, setTheme };
}
