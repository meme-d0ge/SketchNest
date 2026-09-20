import * as z from 'zod/v4';

export const BaseElementDataSchema = z.object({
	rotation: z.number(),
});
export type BaseElementData = z.infer<typeof BaseElementDataSchema>;

export const BaseElementDataPartialSchema = BaseElementDataSchema.partial();
export type BaseElementDataPartial = z.infer<
	typeof BaseElementDataPartialSchema
>;
