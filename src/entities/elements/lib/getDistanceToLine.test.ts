import { describe, expect, it } from 'vitest';
import { getDistanceToLine } from './getDistanceToLine.ts';

describe('getDistanceToLine (open polyline, unsigned)', () => {
	const segment = {
		rotation: 0,
		x: 0,
		y: 0,
		points: [0, 0, 10, 0],
		centerX: 0,
		centerY: 0,
	};

	it('is zero on the segment', () => {
		expect(
			getDistanceToLine({ x: 5, y: 0 }, segment as never, false),
		).toBeCloseTo(0, 5);
	});

	it('equals the perpendicular gap off the segment', () => {
		expect(
			getDistanceToLine({ x: 5, y: 3 }, segment as never, false),
		).toBeCloseTo(3, 5);
	});

	it('returns NaN for malformed points', () => {
		expect(
			getDistanceToLine(
				{ x: 0, y: 0 },
				{ ...segment, points: [0, 0, 10] } as never,
				false,
			),
		).toBeNaN();
	});
});

describe('getDistanceToLine (closed polygon, signed)', () => {
	const square = {
		rotation: 0,
		x: 0,
		y: 0,
		points: [0, 0, 10, 0, 10, 10, 0, 10],
		centerX: 5,
		centerY: 5,
	};

	it('is negative for a point inside', () => {
		expect(
			getDistanceToLine({ x: 5, y: 5 }, square as never, true),
		).toBeLessThan(0);
	});

	it('is positive for a point outside', () => {
		expect(
			getDistanceToLine({ x: 20, y: 5 }, square as never, true),
		).toBeGreaterThan(0);
	});
});
