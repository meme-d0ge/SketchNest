import { describe, expect, it } from 'vitest';
import { hasObjectPrototype } from './hasObjectPrototype.ts';

describe('hasObjectPrototype', () => {
	it('is true for plain and null-prototype objects', () => {
		expect(hasObjectPrototype({})).toBe(true);
		expect(hasObjectPrototype({ a: 1 })).toBe(true);
		expect(hasObjectPrototype(Object.create(null))).toBe(true);
	});

	it('is false for arrays and built-ins', () => {
		expect(hasObjectPrototype([])).toBe(false);
		expect(hasObjectPrototype(new Date())).toBe(false);
		expect(hasObjectPrototype(/x/)).toBe(false);
		expect(hasObjectPrototype(new Map())).toBe(false);
	});

	it('is false for primitives and nullish values', () => {
		expect(hasObjectPrototype(null)).toBe(false);
		expect(hasObjectPrototype(undefined)).toBe(false);
		expect(hasObjectPrototype(42)).toBe(false);
		expect(hasObjectPrototype('str')).toBe(false);
	});
});
