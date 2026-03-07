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
import {
	BaseElementVisualDataPartialSchema,
	BaseElementVisualDataSchema
} from "@/entities/elements/interfaces/visual-data.ts";

export const RectVisualDataSchema = BaseElementVisualDataSchema.extend({
	fill: z.string()
})
export type RectVisualData = z.infer<typeof RectVisualDataSchema>

export const RectVisualDataPartialSchema = BaseElementVisualDataPartialSchema.extend(
	RectVisualDataSchema.partial().shape
)
export type RectVisualDataPartial = z.infer<typeof RectVisualDataPartialSchema>

export const RectDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	y: z.number(),
	width: z.number().positive('Must be positive'),
	height: z.number().positive('Must be positive'),
});
export type RectData = z.infer<typeof RectDataSchema>;

export const RectDataPartialSchema = BaseElementDataPartialSchema.extend(
	RectDataSchema.partial().shape,
);
export type RectDataPartial = z.infer<typeof RectDataPartialSchema>;

export const RectElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Rect),
	data: RectDataSchema,
	visualData: RectVisualDataSchema,
});
export type RectElement = z.infer<typeof RectElementSchema>;

export const RectElementCreateSchema = BaseElementCreateSchema.extend({
	type: z.literal(ElementsEnum.Rect),
	data: RectDataSchema,
	visualData: RectVisualDataSchema,
});
export type RectElementCreate = z.infer<typeof RectElementCreateSchema>;

export const RectElementUpdateSchema = BaseElementUpdateSchema.extend({
	data: RectDataPartialSchema.optional(),
	visualData: RectVisualDataPartialSchema.optional(),
});
export type RectElementUpdate = z.infer<typeof RectElementUpdateSchema>;
