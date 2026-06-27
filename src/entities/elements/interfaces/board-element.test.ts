import { describe, expect, it } from 'vitest';
import {
	BoardElementCreateSchema,
	BoardElementUpdateSchema,
} from './board-element.ts';

describe('BoardElementCreateSchema (discriminated union by type)', () => {
	it('parses each member by its type discriminant', () => {
		const rect = BoardElementCreateSchema.parse({
			type: 'rect',
			isDeleted: false,
			data: { rotation: 0, x: 0, y: 0, width: 10, height: 10 },
			visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
		});
		expect(rect.type).toBe('rect');

		const ellipse = BoardElementCreateSchema.parse({
			type: 'ellipse',
			isDeleted: false,
			data: { rotation: 0, x: 0, y: 0, radiusX: 5, radiusY: 5 },
			visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
		});
		expect(ellipse.type).toBe('ellipse');
	});

	it('rejects an unknown type', () => {
		expect(() =>
			BoardElementCreateSchema.parse({
				type: 'triangle',
				isDeleted: false,
				data: { rotation: 0 },
				visualData: { opacity: 1, strokeWidth: 2, stroke: 'red', fill: '' },
			}),
		).toThrow();
	});
});

describe('BoardElementUpdateSchema (union)', () => {
	it('accepts a bare soft-delete patch', () => {
		expect(BoardElementUpdateSchema.parse({ isDeleted: true })).toEqual({
			isDeleted: true,
		});
	});

	it('accepts an empty patch', () => {
		expect(() => BoardElementUpdateSchema.parse({})).not.toThrow();
	});
});
