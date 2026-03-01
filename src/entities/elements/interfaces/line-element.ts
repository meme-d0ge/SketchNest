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
	points: z.array(z.number()),
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
