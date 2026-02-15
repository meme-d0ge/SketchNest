import * as z from 'zod/v4';

export const VisualDataSchema = z.object({
	opacity: z.number(),
});
export type VisualData = z.infer<typeof VisualDataSchema>;
