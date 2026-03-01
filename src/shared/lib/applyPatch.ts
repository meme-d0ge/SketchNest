type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// stolen from my friend: stolen from react query: stolen from jonschlinkert/is-plain-object
function hasObjectPrototype(obj: any): boolean {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

// stolen from my friend: stolen from react query: stolen from jonschlinkert/is-plain-object
function isPlainObject(obj: any): obj is Record<PropertyKey, unknown> {
	if (!hasObjectPrototype(obj)) {
		return false;
	}

	// If has no constructor
	if (obj.constructor === undefined) {
		return true;
	}

	// If has modified prototype
	if (!hasObjectPrototype(obj.constructor.prototype)) {
		return false;
	}

	// If constructor does not have an Object-specific method
	if (!Object.hasOwn(obj.constructor.prototype, 'isPrototypeOf')) {
		return false;
	}

	// Handles Objects created by Object.create(<arbitrary prototype>)
	if (Object.getPrototypeOf(obj) !== Object.prototype) {
		return false;
	}

	// Most likely a plain Object
	return true;
}

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
