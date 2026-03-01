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

export const EllipseDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	radiusX: z.number(),
	y: z.number(),
	radiusY: z.number(),
});
export type EllipseData = z.infer<typeof EllipseDataSchema>;

export const EllipseDataPartialSchema = BaseElementDataPartialSchema.extend(
	EllipseDataSchema.partial().shape,
);
export type EllipseDataPartial = z.infer<typeof EllipseDataPartialSchema>;

export const EllipseElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Ellipse),
	data: EllipseDataSchema,
});
export type EllipseElement = z.infer<typeof EllipseElementSchema>;

export const EllipseElementCreateSchema = BaseElementCreateSchema.extend({
	type: z.literal(ElementsEnum.Ellipse),
	data: EllipseDataSchema,
});
export type EllipseElementCreate = z.infer<typeof EllipseElementCreateSchema>;

export const EllipseElementUpdateSchema = BaseElementUpdateSchema.extend({
	data: EllipseDataPartialSchema.optional(),
});
export type EllipseElementUpdate = z.infer<typeof EllipseElementUpdateSchema>;
