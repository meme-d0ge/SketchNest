import { describe, expect, it } from 'vitest';
import { getDistanceToEllipse } from './getDistanceToEllipse.ts';

// distEllipse2 is well-defined for a true ellipse (radiusX !== radiusY).
const ellipse = { rotation: 0, x: 0, y: 0, radiusX: 10, radiusY: 5 };

describe('getDistanceToEllipse (true ellipse, signed: negative inside)', () => {
	it('is negative at the center (nearest boundary is the minor radius)', () => {
		expect(getDistanceToEllipse({ x: 0, y: 0 }, ellipse as never)).toBeCloseTo(
			-5,
			5,
		);
	});

	it('is zero on the major-axis vertex', () => {
		expect(getDistanceToEllipse({ x: 10, y: 0 }, ellipse as never)).toBeCloseTo(
			0,
			5,
		);
	});

	it('is zero on the minor-axis vertex', () => {
		expect(getDistanceToEllipse({ x: 0, y: 5 }, ellipse as never)).toBeCloseTo(
			0,
			5,
		);
	});

	it('is the gap outside along the major axis', () => {
		expect(getDistanceToEllipse({ x: 12, y: 0 }, ellipse as never)).toBeCloseTo(
			2,
			5,
		);
	});
});

describe('getDistanceToEllipse (circle case: radiusX === radiusY)', () => {
	const circle = { rotation: 0, x: 0, y: 0, radiusX: 5, radiusY: 5 };

	it('inside circle returns negative distance', () => {
		expect(getDistanceToEllipse({ x: 0, y: 0 }, circle as never)).toBe(-5);
	});

	it('on circle boundary returns 0', () => {
		expect(getDistanceToEllipse({ x: 5, y: 0 }, circle as never)).toBe(0);
	});

	it('outside circle returns positive distance', () => {
		expect(getDistanceToEllipse({ x: 5, y: 12 }, circle as never)).toBe(8);
	});
});
