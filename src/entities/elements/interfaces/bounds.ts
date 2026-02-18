import * as z from 'zod/v4';

export const BoundsSchema = z.object({
	maxX: z.number(),
	minX: z.number(),
	maxY: z.number(),
	minY: z.number(),
});
export type Bounds = z.infer<typeof BoundsSchema>;
