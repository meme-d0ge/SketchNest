import * as z from 'zod/v4';
import { BaseElementSchema } from './base-element.ts';
import { BaseElementDataSchema } from './base-geometry-data.ts';
import { ElementsEnum } from './element-type-variant.ts';

export const RectDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
});
export type RectData = z.infer<typeof RectDataSchema>;

export const RectElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Rect),
	data: RectDataSchema,
});
export type RectElement = z.infer<typeof RectElementSchema>;

export const RectElementDraftSchema = RectElementSchema.omit({
	shapeBox: true,
}).extend({
	id: z.string().optional(),
});
export type RectElementDraft = z.infer<typeof RectElementDraftSchema>;
