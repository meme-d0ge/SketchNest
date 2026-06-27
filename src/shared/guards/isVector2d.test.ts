import { describe, expect, it } from 'vitest';
import { isVector2d } from './isVector2d.ts';

describe('isVector2d', () => {
	it('accepts objects with numeric x and y', () => {
		expect(isVector2d({ x: 1, y: 2 })).toBe(true);
		expect(isVector2d({ x: 0, y: 0 })).toBe(true);
		expect(isVector2d({ x: -1.5, y: 3.2, z: 9 })).toBe(false);
	});

	it('rejects objects missing a coordinate', () => {
		expect(isVector2d({ x: 1 })).toBe(false);
		expect(isVector2d({ y: 1 })).toBe(false);
		expect(isVector2d({})).toBe(false);
	});

	it('rejects non-numeric coordinates', () => {
		expect(isVector2d({ x: '1', y: 2 })).toBe(false);
		expect(isVector2d({ x: 1, y: null })).toBe(false);
		expect(isVector2d({ x: 1, y: undefined })).toBe(false);
	});

	it('rejects nullish values and primitives', () => {
		expect(isVector2d(null)).toBe(false);
		expect(isVector2d(undefined)).toBe(false);
		expect(isVector2d(5)).toBe(false);
		expect(isVector2d('x,y')).toBe(false);
	});
});
