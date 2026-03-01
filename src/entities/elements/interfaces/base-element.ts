import * as z from 'zod/v4';
import { ElementTypeSchema } from './element-type-variant.ts';
import { ShapeBoxSchema } from './shape-element.ts';
import { VisualDataPartialSchema, VisualDataSchema } from './visual-data.ts';

export const BaseElementSchema = z.object({
	type: ElementTypeSchema,
	id: z.string(),
	isDeleted: z.boolean(),
	visualData: VisualDataSchema,
	shapeBox: ShapeBoxSchema,
});
export type BaseElement = z.infer<typeof BaseElementSchema>;

export const BaseElementCreateSchema = BaseElementSchema.omit({
	id: true,
	shapeBox: true,
});
export type BaseElementCreate = z.infer<typeof BaseElementCreateSchema>;

export const BaseElementUpdateSchema = BaseElementSchema.omit({
	id: true,
	type: true,
	shapeBox: true,
})
	.extend({
		visualData: VisualDataPartialSchema,
	})
	.partial();
export type BaseElementUpdate = z.infer<typeof BaseElementUpdateSchema>;
