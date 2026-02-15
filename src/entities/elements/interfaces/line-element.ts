import * as z from 'zod/v4';
import { BaseElementDataSchema } from '@/entities/elements/interfaces/base-geometry-data.ts';
import { ElementsEnum } from '@/entities/elements/interfaces/element-type-variant.ts';
import { BaseElementSchema } from './base-element.ts';

export const LineDataSchema = BaseElementDataSchema.extend({
	x: z.number(),
	y: z.number(),
	points: z.array(z.number()),
	centerX: z.number(),
	centerY: z.number(),
});
export type LineData = z.infer<typeof LineDataSchema>;

export const LineElementSchema = BaseElementSchema.extend({
	type: z.literal(ElementsEnum.Line),
	data: LineDataSchema,
});
export type LineElement = z.infer<typeof LineElementSchema>;

export const LineElementDraftSchema = LineElementSchema.omit({
	shapeBox: true,
}).extend({
	id: z.string().optional(),
});
export type LineElementDraft = z.infer<typeof LineElementDraftSchema>;
