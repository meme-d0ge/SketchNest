import { describe, expect, it } from 'vitest';
import {
	LineDataSchema,
	LineElementCreateSchema,
	LineElementInteractiveSchema,
} from './line-element.ts';

describe('LineDataSchema', () => {
	it('requires at least 4 coordinates (2 points)', () => {
		expect(() =>
			LineDataSchema.parse({
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0],
				centerX: 0,
				centerY: 0,
			}),
		).toThrow();
	});

	it('rejects an odd number of coordinates', () => {
		expect(() =>
			LineDataSchema.parse({
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0, 10, 0, 20],
				centerX: 0,
				centerY: 0,
			}),
		).toThrow();
	});

	it('simplifies collinear points but keeps the endpoints', () => {
		const parsed = LineDataSchema.parse({
			rotation: 0,
			x: 0,
			y: 0,
			points: [0, 0, 5, 0, 10, 0],
			centerX: 0,
			centerY: 0,
		});
		// midpoint lies on the line within tolerance, so it is dropped
		expect(parsed.points).toEqual([0, 0, 10, 0]);
	});

	it('keeps points that deviate beyond the simplify tolerance', () => {
		const parsed = LineDataSchema.parse({
			rotation: 0,
			x: 0,
			y: 0,
			points: [0, 0, 5, 50, 10, 0],
			centerX: 0,
			centerY: 0,
		});
		expect(parsed.points).toEqual([0, 0, 5, 50, 10, 0]);
	});
});

describe('LineElementInteractiveSchema (addClosedFlag)', () => {
	const base = {
		type: 'line',
		isDeleted: false,
		visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
	};

	it('marks a line closed when first and last points are within strokeWidth', () => {
		const parsed = LineElementInteractiveSchema.parse({
			...base,
			data: {
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0, 10, 0, 0, 1],
				centerX: 0,
				centerY: 0,
			},
		});
		expect(parsed.visualData.closed).toBe(true);
	});

	it('marks a line open when endpoints are far apart', () => {
		const parsed = LineElementInteractiveSchema.parse({
			...base,
			data: {
				rotation: 0,
				x: 0,
				y: 0,
				points: [0, 0, 10, 0, 0, 50],
				centerX: 0,
				centerY: 0,
			},
		});
		expect(parsed.visualData.closed).toBe(false);
	});
});

describe('LineElementCreateSchema', () => {
	it('parses a valid line create payload', () => {
		expect(() =>
			LineElementCreateSchema.parse({
				type: 'line',
				isDeleted: false,
				data: {
					rotation: 0,
					x: 0,
					y: 0,
					points: [0, 0, 100, 0],
					centerX: 0,
					centerY: 0,
				},
				visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
			}),
		).not.toThrow();
	});
});
