import { describe, expect, it } from 'vitest';
import { isPlainObject } from './isPlainObject.ts';

describe('isPlainObject', () => {
	it('accepts object literals', () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject({ a: 1, b: { c: 2 } })).toBe(true);
	});

	it('accepts null-prototype objects (no constructor)', () => {
		expect(isPlainObject(Object.create(null))).toBe(true);
	});

	it('rejects arrays', () => {
		expect(isPlainObject([])).toBe(false);
		expect(isPlainObject([1, 2, 3])).toBe(false);
	});

	it('rejects class instances', () => {
		class Foo {
			bar = 1;
		}
		expect(isPlainObject(new Foo())).toBe(false);
	});

	it('rejects built-ins (Date, Map, Set, RegExp)', () => {
		expect(isPlainObject(new Date())).toBe(false);
		expect(isPlainObject(new Map())).toBe(false);
		expect(isPlainObject(new Set())).toBe(false);
		expect(isPlainObject(/x/)).toBe(false);
	});

	it('rejects primitives and nullish values', () => {
		expect(isPlainObject(null)).toBe(false);
		expect(isPlainObject(undefined)).toBe(false);
		expect(isPlainObject(1)).toBe(false);
		expect(isPlainObject('str')).toBe(false);
		expect(isPlainObject(true)).toBe(false);
	});

	it('rejects objects with a custom (non-Object) prototype', () => {
		const proto = { greet() {} };
		expect(isPlainObject(Object.create(proto))).toBe(false);
	});
});
