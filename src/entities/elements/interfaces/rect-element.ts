import * as z from 'zod/v4';
import { BaseElementDataSchema } from '@/entities/elements/interfaces/base-geometry-data.ts';
import { BaseElementSchema } from './base-element.ts';
import {ElementsEnum} from "@/entities/elements/interfaces/element-type-variant.ts";

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
