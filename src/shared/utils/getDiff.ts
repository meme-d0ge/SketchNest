import { isPlainObject } from '@/shared/guards/isPlainObject.ts';

export type DiffPair<T> = {
	previous: Partial<T>;
	current: Partial<T>;
};

export function getDiff<T extends object>(oldObj: T, newObj: T): DiffPair<T> {
	const previous: Partial<T> = {};
	const current: Partial<T> = {};

	for (const key in newObj) {
		if (!(key in oldObj)) {
			current[key as keyof T] = newObj[key];
			continue;
		}

		const oldVal = oldObj[key as keyof T];
		const newVal = newObj[key as keyof T];

		if (Object.is(oldVal, newVal)) {
			continue;
		}

		if (!isPlainObject(oldVal) || !isPlainObject(newVal)) {
			previous[key as keyof T] = oldVal;
			current[key as keyof T] = newVal;
			continue;
		}

		const nested = getDiff(oldVal as object, newVal as object);
		
		if (Object.keys(nested.current).length > 0) {
			previous[key as keyof T] = nested.previous as any;
			current[key as keyof T] = nested.current as any;
		}
	}

	return { previous, current };
}
