import * as z from 'zod/v4';

export const VisualDataSchema = z.object({
	opacity: z.number(),
	strokeWidth: z.number(),
	stroke: z.string(),
});
export type VisualData = z.infer<typeof VisualDataSchema>;
