import { describe, expect, it } from 'vitest';
import { getDiff } from './getDiff.ts';

describe('getDiff', () => {
	it('returns an empty diff for identical primitive fields', () => {
		expect(getDiff({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toEqual({
			previous: {},
			current: {},
		});
	});

	it('captures a changed primitive in both previous and current', () => {
		expect(getDiff({ a: 1 }, { a: 2 })).toEqual({
			previous: { a: 1 },
			current: { a: 2 },
		});
	});

	it('puts a brand-new key only in current, never in previous', () => {
		type A = { a?: number };
		expect(getDiff<A>({}, { a: 1 })).toEqual({
			previous: {},
			current: { a: 1 },
		});
	});

	it('does NOT detect removed keys (only iterates the new object) — documented limitation', () => {
		// `b` exists in old but not in new; the loop never visits it.
		type AB = { a: number; b?: number };
		const oldObj: AB = { a: 1, b: 2 };
		const newObj: AB = { a: 1 };
		expect(getDiff(oldObj, newObj)).toEqual({ previous: {}, current: {} });
	});

	it('treats NaN as unchanged via Object.is', () => {
		expect(getDiff({ a: Number.NaN }, { a: Number.NaN })).toEqual({
			previous: {},
			current: {},
		});
	});

	it('treats +0 and -0 as a change via Object.is', () => {
		expect(getDiff({ a: 0 }, { a: -0 })).toEqual({
			previous: { a: 0 },
			current: { a: -0 },
		});
	});

	it('recurses into nested plain objects and keeps only the changed leaves', () => {
		const oldObj = { v: { x: 1, y: 2 } };
		const newObj = { v: { x: 1, y: 3 } };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { v: { y: 2 } },
			current: { v: { y: 3 } },
		});
	});

	it('omits a nested object that is deeply unchanged but referentially different', () => {
		const oldObj = { v: { x: 1 } };
		const newObj = { v: { x: 1 } }; // different reference, equal value
		expect(getDiff(oldObj, newObj)).toEqual({ previous: {}, current: {} });
	});

	it('records an added nested key with an empty previous sub-object', () => {
		// Non-obvious behavior worth pinning: previous.v is `{}`, not omitted.
		const oldObj = { v: { x: 1 } };
		const newObj = { v: { x: 1, y: 2 } };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { v: {} },
			current: { v: { y: 2 } },
		});
	});

	it('replaces arrays wholesale because arrays are not plain objects', () => {
		const oldObj = { points: [1, 2] };
		const newObj = { points: [1, 2, 3] };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { points: [1, 2] },
			current: { points: [1, 2, 3] },
		});
	});

	it('diffs arrays by reference, so equal-by-value different-reference arrays still diff', () => {
		const oldObj = { points: [1, 2] };
		const newObj = { points: [1, 2] };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { points: [1, 2] },
			current: { points: [1, 2] },
		});
	});

	it('treats null transitions as primitive replacement (null -> object)', () => {
		type A = { a: { x: number } | null };
		const oldObj: A = { a: null };
		const newObj: A = { a: { x: 1 } };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { a: null },
			current: { a: { x: 1 } },
		});
	});

	it('treats null transitions as primitive replacement (object -> null)', () => {
		type A = { a: { x: number } | null };
		const oldObj: A = { a: { x: 1 } };
		const newObj: A = { a: null };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { a: { x: 1 } },
			current: { a: null },
		});
	});

	it('handles multiple mixed changes in a single pass', () => {
		const oldObj = { a: 1, b: { c: 1, d: 2 }, e: 'keep' };
		const newObj = { a: 9, b: { c: 1, d: 5 }, e: 'keep' };
		expect(getDiff(oldObj, newObj)).toEqual({
			previous: { a: 1, b: { d: 2 } },
			current: { a: 9, b: { d: 5 } },
		});
	});

	it('does not mutate either input', () => {
		const oldObj = { a: 1, v: { x: 1 } };
		const newObj = { a: 2, v: { x: 2 } };
		const oldSnapshot = structuredClone(oldObj);
		const newSnapshot = structuredClone(newObj);
		getDiff(oldObj, newObj);
		expect(oldObj).toEqual(oldSnapshot);
		expect(newObj).toEqual(newSnapshot);
	});
});
