import { describe, expect, it } from 'vitest';
import { getDistanceToBoardElement } from './getDistanceToBoardElement.ts';

describe('getDistanceToBoardElement', () => {
	it('offsets the rect distance by half the strokeWidth', () => {
		const rect = {
			type: 'rect',
			data: { rotation: 0, x: 0, y: 0, width: 10, height: 10 },
			visualData: { strokeWidth: 4 },
		};
		// center distance -5, minus strokeWidth/2 (=2)
		expect(
			getDistanceToBoardElement({ x: 5, y: 5 }, rect as never),
		).toBeCloseTo(-7, 5);
	});

	it('offsets the ellipse distance by half the strokeWidth', () => {
		const ellipse = {
			type: 'ellipse',
			data: { rotation: 0, x: 0, y: 0, radiusX: 10, radiusY: 5 },
			visualData: { strokeWidth: 4 },
		};
		// center distance -5, minus strokeWidth/2 (=2)
		expect(
			getDistanceToBoardElement({ x: 0, y: 0 }, ellipse as never),
		).toBeCloseTo(-7, 5);
	});

	it('passes the closed flag through for lines', () => {
		const line = {
			type: 'line',
			data: {
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0, 10, 0],
				centerX: 0,
				centerY: 0,
			},
			visualData: { strokeWidth: 2, closed: false },
		};
		// on the segment: 0 distance minus strokeWidth/2 (=1)
		expect(
			getDistanceToBoardElement({ x: 5, y: 0 }, line as never),
		).toBeCloseTo(-1, 5);
	});

	it('returns null for an unknown element type', () => {
		expect(
			getDistanceToBoardElement({ x: 0, y: 0 }, { type: 'triangle' } as never),
		).toBeNull();
	});
});
