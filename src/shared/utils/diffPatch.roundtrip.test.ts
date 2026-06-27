import { describe, expect, it } from 'vitest';
import { applyPatch } from './applyPatch.ts';
import { getDiff } from './getDiff.ts';

/**
 * These tests pin the contract the history engine relies on:
 * `applyPatch(present, diff.current)` is the redo step and
 * `applyPatch(present, diff.previous)` is the undo step.
 */
describe('getDiff + applyPatch round-trip', () => {
	it('redo: applyPatch(old, diff.current) reproduces new when no keys are removed', () => {
		const oldObj = { a: 1, v: { x: 1, y: 2 }, tag: 'k' };
		const newObj = { a: 9, v: { x: 1, y: 5 }, tag: 'k' };
		const diff = getDiff(oldObj, newObj);
		expect(applyPatch(oldObj, diff.current)).toEqual(newObj);
	});

	it('undo: applyPatch(new, diff.previous) restores old when only existing keys change', () => {
		const oldObj = { a: 1, v: { x: 1, y: 2 } };
		const newObj = { a: 9, v: { x: 1, y: 5 } };
		const diff = getDiff(oldObj, newObj);
		expect(applyPatch(newObj, diff.previous)).toEqual(oldObj);
	});

	it('does not restore removed keys on redo (limitation: removals are never captured)', () => {
		type AB = { a: number; b?: number };
		const oldObj: AB = { a: 1, b: 2 };
		const newObj: AB = { a: 1 };
		const diff = getDiff(oldObj, newObj);
		// `b` was never diffed, so the stale value survives.
		expect(applyPatch(oldObj, diff.current)).toEqual({ a: 1, b: 2 });
		expect(applyPatch(oldObj, diff.current)).not.toEqual(newObj);
	});

	it('does not remove a newly added key when reverting through previous (asymmetry)', () => {
		type A = { a?: number; n?: number };
		const oldObj: A = { a: 1 };
		const newObj: A = { a: 1, n: 7 };
		const diff = getDiff(oldObj, newObj);
		// previous has no record of `n`, so reverting leaves it in place.
		expect(applyPatch(newObj, diff.previous)).toEqual({ a: 1, n: 7 });
	});

	it('round-trips arrays exactly (wholesale replace, both directions)', () => {
		const oldObj = { points: [1, 2, 3] };
		const newObj = { points: [4, 5] };
		const diff = getDiff(oldObj, newObj);
		expect(applyPatch(oldObj, diff.current)).toEqual(newObj);
		expect(applyPatch(newObj, diff.previous)).toEqual(oldObj);
	});
});
