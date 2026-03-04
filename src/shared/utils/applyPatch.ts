import { isPlainObject } from '@/shared/guards/isPlainObject.ts';

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function applyPatch<T extends object>(
	target: T,
	patch: DeepPartial<T>,
): T {
	const result = { ...target };

	for (const key in patch) {
		const patchValue = patch[key];
		if (patchValue === undefined) continue;

		const targetValue = target[key as keyof T];

		if (isPlainObject(patchValue) && isPlainObject(targetValue)) {
			result[key as keyof T] = applyPatch(
				targetValue,
				patchValue as DeepPartial<typeof targetValue>,
			);
		} else {
			result[key as keyof T] = patchValue as any;
		}
	}

	return result;
}
