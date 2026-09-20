import { hasObjectPrototype } from '@/shared/guards/hasObjectPrototype.ts';

// stolen from my friend: stolen from react query: stolen from jonschlinkert/is-plain-object
export function isPlainObject(obj: any): obj is Record<PropertyKey, unknown> {
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
