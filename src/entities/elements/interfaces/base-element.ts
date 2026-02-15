import * as z from 'zod/v4';
import { ElementTypeSchema } from '@/entities/elements/interfaces/element-type-variant.ts';
import { ShapeBoxSchema } from '@/entities/elements/interfaces/shape-element.ts';
import { VisualDataSchema } from '@/entities/elements/interfaces/visual-data.ts';

export const BaseElementSchema = z.object({
	type: ElementTypeSchema,
	id: z.string(),
	isDeleted: z.boolean(),
	visualData: VisualDataSchema,
	shapeBox: ShapeBoxSchema,
});
export type BaseElement = z.infer<typeof BaseElementSchema>;
