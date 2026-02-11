import * as z from 'zod/v4';
import { BoundsSchema } from '@/shared/types/shape.ts';

export const ShapeBoxSchema = BoundsSchema.extend({
	ownerId: z.string(),
});
export type ShapeBox = z.infer<typeof ShapeBoxSchema>;
