import * as z from 'zod/v4';

export const VisualDataSchema = z.object({
	opacity: z
		.number()
		.min(0, 'Must be no less than 0.')
		.max(1, 'Must be no more than 1.'),
	strokeWidth: z.number().min(1, 'The value must be at least 1.'),
	stroke: z.string(),
});
export type VisualData = z.infer<typeof VisualDataSchema>;

export const VisualDataPartialSchema = VisualDataSchema.partial();
export type VisualDataPartial = z.infer<typeof VisualDataPartialSchema>;
