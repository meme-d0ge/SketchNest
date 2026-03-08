import * as z from 'zod/v4';
import {
	BaseElementVisualDataPartialSchema,
	BaseElementVisualDataSchema,
} from '@/entities/elements/interfaces/visual-data.ts';
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

export const EllipseVisualDataSchema = BaseElementVisualDataSchema.extend({
	fill: z.string(),
});
export type EllipseVisualData = z.infer<typeof EllipseVisualDataSchema>;

export const EllipseVisualDataPartialSchema =
	BaseElementVisualDataPartialSchema.extend(
		EllipseVisualDataSchema.partial().shape,
	);
export type EllipseVisualDataPartial = z.infer<
	typeof EllipseVisualDataPartialSchema
>;

export const EllipseDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	radiusX: z.number().positive('Must be positive'),
	y: z.number(),
	radiusY: z.number().positive('Must be positive'),
});
export type EllipseData = z.infer<typeof EllipseDataSchema>;

export const EllipseDataPartialSchema = BaseElementDataPartialSchema.extend(
	EllipseDataSchema.partial().shape,
);
export type EllipseDataPartial = z.infer<typeof EllipseDataPartialSchema>;

export const EllipseElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Ellipse),
	data: EllipseDataSchema,
	visualData: EllipseVisualDataSchema,
});
export type EllipseElement = z.infer<typeof EllipseElementSchema>;

export const EllipseElementCreateSchema = BaseElementCreateSchema.extend({
	type: z.literal(ElementsEnum.Ellipse),
	data: EllipseDataSchema,
	visualData: EllipseVisualDataSchema,
});
export type EllipseElementCreate = z.infer<typeof EllipseElementCreateSchema>;

export const EllipseElementUpdateSchema = BaseElementUpdateSchema.extend({
	data: EllipseDataPartialSchema.optional(),
	visualData: EllipseVisualDataPartialSchema.optional(),
});
export type EllipseElementUpdate = z.infer<typeof EllipseElementUpdateSchema>;

export const EllipseElementInteractiveSchema =
	EllipseElementCreateSchema.extend({});
export type EllipseElementInteractive = z.infer<
	typeof EllipseElementInteractiveSchema
>;
