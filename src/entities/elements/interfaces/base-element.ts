import * as z from 'zod/v4';
import { ElementTypeSchema } from './element-type-variant.ts';
import { ShapeBoxSchema } from './shape-element.ts';
import { VisualDataSchema } from './visual-data.ts';

export const BaseElementSchema = z.object({
	type: ElementTypeSchema,
	id: z.string(),
	isDeleted: z.boolean(),
	visualData: VisualDataSchema,
	shapeBox: ShapeBoxSchema,
});
export type BaseElement = z.infer<typeof BaseElementSchema>;
