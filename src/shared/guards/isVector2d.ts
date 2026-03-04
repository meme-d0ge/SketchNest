import type { Vector2d } from 'konva/lib/types';
export function isVector2d(obj: unknown): obj is Vector2d {
	return (
		obj !== null &&
		typeof obj === 'object' &&
		'x' in obj &&
		'y' in obj &&
		typeof obj.x === 'number' &&
		typeof obj.y === 'number'
	);
}
