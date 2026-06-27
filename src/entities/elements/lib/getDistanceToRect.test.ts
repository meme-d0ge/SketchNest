import { describe, expect, it } from 'vitest';
import { getDistanceToRect } from './getDistanceToRect.ts';

const rect = { rotation: 0, x: 0, y: 0, width: 10, height: 10 };

describe('getDistanceToRect (signed: negative inside)', () => {
	it('is most negative at the center', () => {
		expect(getDistanceToRect({ x: 5, y: 5 }, rect as never)).toBeCloseTo(-5, 5);
	});

	it('is zero on an edge', () => {
		expect(getDistanceToRect({ x: 5, y: 0 }, rect as never)).toBeCloseTo(0, 5);
	});

	it('is positive outside, equal to the gap', () => {
		expect(getDistanceToRect({ x: 5, y: -5 }, rect as never)).toBeCloseTo(5, 5);
	});

	it('is rotation-invariant at the center', () => {
		expect(
			getDistanceToRect({ x: 5, y: 5 }, { ...rect, rotation: 45 } as never),
		).toBeCloseTo(-5, 5);
	});
});
