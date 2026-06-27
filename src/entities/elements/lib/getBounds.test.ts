import { describe, expect, it } from 'vitest';
import { ElementsEnum } from '@/entities/elements/interfaces/element-type-variant.ts';
import { getBounds } from './getBounds.ts';

describe('getBounds', () => {
	it('computes an axis-aligned box for an unrotated rect, padded by strokeWidth', () => {
		const box = getBounds(
			{ rotation: 0, x: 0, y: 0, width: 10, height: 10 } as never,
			2,
			ElementsEnum.Rect,
		);
		expect(box).not.toBeNull();
		expect(box?.minX).toBeCloseTo(-2, 5);
		expect(box?.maxX).toBeCloseTo(12, 5);
		expect(box?.minY).toBeCloseTo(-2, 5);
		expect(box?.maxY).toBeCloseTo(12, 5);
	});

	it('grows the box for a 45deg-rotated square (rotation-symmetric check)', () => {
		const box = getBounds(
			{ rotation: 45, x: 0, y: 0, width: 10, height: 10 } as never,
			0,
			ElementsEnum.Rect,
		);
		// half-diagonal of a 10x10 square is 5*sqrt(2) ~= 7.0711, centered at (5,5)
		expect(box?.minX).toBeCloseTo(5 - 7.0711, 3);
		expect(box?.maxX).toBeCloseTo(5 + 7.0711, 3);
		expect(box?.minY).toBeCloseTo(5 - 7.0711, 3);
		expect(box?.maxY).toBeCloseTo(5 + 7.0711, 3);
	});

	it('computes the box for an unrotated ellipse', () => {
		const box = getBounds(
			{ rotation: 0, x: 50, y: 50, radiusX: 10, radiusY: 5 } as never,
			1,
			ElementsEnum.Ellipse,
		);
		expect(box?.minX).toBeCloseTo(39, 5);
		expect(box?.maxX).toBeCloseTo(61, 5);
		expect(box?.minY).toBeCloseTo(44, 5);
		expect(box?.maxY).toBeCloseTo(56, 5);
	});

	it('computes the box for an unrotated line from its points + offset', () => {
		const box = getBounds(
			{
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0, 10, 4],
				centerX: 0,
				centerY: 0,
			} as never,
			1,
			ElementsEnum.Line,
		);
		expect(box?.minX).toBeCloseTo(-1, 5);
		expect(box?.maxX).toBeCloseTo(11, 5);
		expect(box?.minY).toBeCloseTo(-1, 5);
		expect(box?.maxY).toBeCloseTo(5, 5);
	});

	it('returns null for an unknown element type', () => {
		expect(
			getBounds({ rotation: 0 } as never, 1, 'triangle' as never),
		).toBeNull();
	});

	it('throws when rect data is invalid (non-positive size)', () => {
		expect(() =>
			getBounds(
				{ rotation: 0, x: 0, y: 0, width: 0, height: 10 } as never,
				1,
				ElementsEnum.Rect,
			),
		).toThrow();
	});
});
