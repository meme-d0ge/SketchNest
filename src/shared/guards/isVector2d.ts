import type { Vector2d } from 'konva/lib/types';
export function isVector2d(obj: any): obj is Vector2d {
	return obj.x !== undefined && obj.y !== undefined;
}
