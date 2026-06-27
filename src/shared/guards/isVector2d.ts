import * as z from 'zod/v4';

import type { Vector2d } from 'konva/lib/types';

const Vector2dSchema: z.ZodSchema<Vector2d> = z.strictObject({
	x: z.number(),
	y: z.number(),
})

export function isVector2d(obj: unknown): obj is Vector2d {
	return Vector2dSchema.safeParse(obj).success
}