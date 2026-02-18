import * as z from 'zod/v4';
import { BaseElementSchema } from './base-element.ts';
import { BaseElementDataSchema } from './base-geometry-data.ts';
import { ElementsEnum } from './element-type-variant.ts';

export const EllipseDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	radiusX: z.number(),
	y: z.number(),
	radiusY: z.number(),
});
export type EllipseData = z.infer<typeof EllipseDataSchema>;

export const EllipseElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Ellipse),
	data: EllipseDataSchema,
});
export type EllipseElement = z.infer<typeof EllipseElementSchema>;

export const EllipseElementDraftSchema = EllipseElementSchema.omit({
	shapeBox: true,
}).extend({
	id: z.string().optional(),
});
export type EllipseElementDraft = z.infer<typeof EllipseElementDraftSchema>;
