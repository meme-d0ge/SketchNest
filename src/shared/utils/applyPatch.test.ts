import { describe, expect, it } from 'vitest';
import { applyPatch } from './applyPatch.ts';

describe('applyPatch', () => {
	it('returns a shallow clone for an empty patch', () => {
		const target = { a: 1, b: 2 };
		const result = applyPatch(target, {});
		expect(result).toEqual(target);
		expect(result).not.toBe(target);
	});

	it('overrides a primitive while keeping siblings', () => {
		expect(applyPatch({ a: 1, b: 2 }, { a: 9 })).toEqual({ a: 9, b: 2 });
	});

	it('skips undefined patch values, so it never deletes keys', () => {
		expect(applyPatch({ a: 1, b: 2 }, { a: undefined })).toEqual({
			a: 1,
			b: 2,
		});
	});

	it('merges nested plain objects, preserving untouched sibling keys', () => {
		const target = { v: { x: 1, y: 2 } };
		expect(applyPatch(target, { v: { y: 5 } })).toEqual({ v: { x: 1, y: 5 } });
	});

	it('replaces wholesale when the patch value is plain but the target value is not', () => {
		const target = { a: 1 as number | { b: number } };
		expect(applyPatch(target, { a: { b: 2 } })).toEqual({ a: { b: 2 } });
	});

	it('replaces arrays wholesale because arrays are not plain objects', () => {
		expect(applyPatch({ points: [1, 2, 3] }, { points: [9] })).toEqual({
			points: [9],
		});
	});

	it('adds keys that are present in the patch but missing in the target', () => {
		type AB = { a: number; b?: number };
		expect(applyPatch<AB>({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
	});

	it('does not mutate the target at the top level or nested level', () => {
		const target = { a: 1, v: { x: 1, y: 2 } };
		const snapshot = structuredClone(target);
		applyPatch(target, { a: 9, v: { y: 5 } });
		expect(target).toEqual(snapshot);
	});

	it('produces a fresh nested reference when a nested key changes', () => {
		const target = { v: { x: 1 } };
		const result = applyPatch(target, { v: { x: 2 } });
		expect(result.v).not.toBe(target.v);
	});

	it('shares the reference of nested objects the patch never touches', () => {
		const target = { v: { x: 1 }, w: { y: 2 } };
		const result = applyPatch(target, { v: { x: 9 } });
		expect(result.w).toBe(target.w);
	});

	it('is a no-op (value-wise) when patching with an empty nested object', () => {
		const target = { v: { x: 1, y: 2 } };
		expect(applyPatch(target, { v: {} })).toEqual({ v: { x: 1, y: 2 } });
	});
});
