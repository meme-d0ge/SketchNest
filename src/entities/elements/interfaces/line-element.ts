import { simplify } from '@thi.ng/geom-resample';
import * as z from 'zod/v4';
import {
	BaseElementCreateSchema,
	BaseElementSchema,
	BaseElementUpdateSchema,
} from './base-element.ts';
import {
	BaseElementDataPartialSchema,
	BaseElementDataSchema,
} from './base-geometry-data.ts';
import { ElementsEnum } from './element-type-variant.ts';

export const LineDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	y: z.number(),
	points: z
		.array(z.number())
		.min(4, { message: 'At least 2 points required (4 coordinates)' })
		.refine((arr) => arr.length % 2 === 0, {
			message: 'The number of values in points must be even (x,y pairs)',
		})
		.transform((flatPoints: number[]): number[] => {
			const vecs: number[][] = [];
			for (let i = 0; i < flatPoints.length; i += 2) {
				vecs.push([flatPoints[i], flatPoints[i + 1]]);
			}

			const simplifiedVecs = simplify(vecs, 1.0, false);

			const result: number[] = [];
			for (const [x, y] of simplifiedVecs) {
				result.push(x, y);
			}

			return result;
		}),
	centerX: z.number(),
	centerY: z.number(),
});
export type LineData = z.infer<typeof LineDataSchema>;

export const LineDataPartialSchema = BaseElementDataPartialSchema.extend(
	LineDataSchema.partial().shape,
);
export type LineDataPartial = z.infer<typeof LineDataPartialSchema>;

export const LineElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Line),
	data: LineDataSchema,
});
export type LineElement = z.infer<typeof LineElementSchema>;

export const LineElementCreateSchema = BaseElementCreateSchema.extend({
	type: z.literal(ElementsEnum.Line),
	data: LineDataSchema,
});
export type LineElementCreate = z.infer<typeof LineElementCreateSchema>;

export const LineElementUpdateSchema = BaseElementUpdateSchema.extend({
	data: LineDataPartialSchema.optional(),
});
export type LineElementUpdate = z.infer<typeof LineElementUpdateSchema>;
