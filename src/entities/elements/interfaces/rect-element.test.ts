import { describe, expect, it } from 'vitest';
import {
	RectElementCreateSchema,
	RectElementUpdateSchema,
} from './rect-element.ts';

const validCreate = {
	type: 'rect',
	isDeleted: false,
	data: { rotation: 0, x: 0, y: 0, width: 10, height: 10 },
	visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
};

describe('RectElementCreateSchema', () => {
	it('parses a valid rect', () => {
		expect(() => RectElementCreateSchema.parse(validCreate)).not.toThrow();
	});

	it('rejects non-positive width/height', () => {
		expect(() =>
			RectElementCreateSchema.parse({
				...validCreate,
				data: { ...validCreate.data, width: 0 },
			}),
		).toThrow();
		expect(() =>
			RectElementCreateSchema.parse({
				...validCreate,
				data: { ...validCreate.data, height: -5 },
			}),
		).toThrow();
	});

	it('rejects opacity outside [0, 1]', () => {
		expect(() =>
			RectElementCreateSchema.parse({
				...validCreate,
				visualData: { ...validCreate.visualData, opacity: 1.5 },
			}),
		).toThrow();
	});

	it('rejects strokeWidth below 1', () => {
		expect(() =>
			RectElementCreateSchema.parse({
				...validCreate,
				visualData: { ...validCreate.visualData, strokeWidth: 0 },
			}),
		).toThrow();
	});
});

describe('RectElementUpdateSchema', () => {
	it('accepts an empty patch (all fields optional)', () => {
		expect(() => RectElementUpdateSchema.parse({})).not.toThrow();
	});

	it('accepts a soft-delete patch', () => {
		expect(RectElementUpdateSchema.parse({ isDeleted: true })).toEqual({
			isDeleted: true,
		});
	});

	it('accepts a partial data patch', () => {
		expect(() =>
			RectElementUpdateSchema.parse({ data: { x: 5 } }),
		).not.toThrow();
	});
});
