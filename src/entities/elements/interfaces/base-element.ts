import * as z from 'zod/v4';
import { ElementTypeSchema } from '@/entities/elements/interfaces/element-type-variant.ts';
import { ShapeBoxSchema } from '@/entities/elements/interfaces/shape-element.ts';

export const BaseElementSchema = z.object({
	type: ElementTypeSchema,
	id: z.string(),
	isDeleted: z.boolean(),
	opacity: z.number().optional(),
	shapeBox: ShapeBoxSchema,
});
export type BaseElement = z.infer<typeof BaseElementSchema>;
