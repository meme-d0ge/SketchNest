import { describe, expect, it } from 'vitest';
import {
	EllipseElementCreateSchema,
	EllipseElementUpdateSchema,
} from './ellipse-element.ts';

const validCreate = {
	type: 'ellipse',
	isDeleted: false,
	data: { rotation: 0, x: 0, y: 0, radiusX: 5, radiusY: 8 },
	visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
};

describe('EllipseElementCreateSchema', () => {
	it('parses a valid ellipse', () => {
		expect(() => EllipseElementCreateSchema.parse(validCreate)).not.toThrow();
	});

	it('rejects non-positive radii', () => {
		expect(() =>
			EllipseElementCreateSchema.parse({
				...validCreate,
				data: { ...validCreate.data, radiusX: 0 },
			}),
		).toThrow();
		expect(() =>
			EllipseElementCreateSchema.parse({
				...validCreate,
				data: { ...validCreate.data, radiusY: -1 },
			}),
		).toThrow();
	});
});

describe('EllipseElementUpdateSchema', () => {
	it('accepts an empty patch and a soft-delete patch', () => {
		expect(() => EllipseElementUpdateSchema.parse({})).not.toThrow();
		expect(EllipseElementUpdateSchema.parse({ isDeleted: true })).toEqual({
			isDeleted: true,
		});
	});
});
