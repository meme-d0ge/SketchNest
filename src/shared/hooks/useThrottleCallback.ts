import { useCallback, useRef } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	const lastExecuted = useRef<number>(0);
	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const throttledFn = useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			const remaining = delay - (now - lastExecuted.current);

			if (remaining <= 0) {
				if (timeout.current) {
					clearTimeout(timeout.current);
					timeout.current = null;
				}
				lastExecuted.current = now;
				callback(...args);
			} else if (!timeout.current) {
				timeout.current = setTimeout(() => {
					lastExecuted.current = Date.now();
					timeout.current = null;
					callback(...args);
				}, remaining);
			}
		},
		[callback, delay],
	);

	return throttledFn as T;
}
