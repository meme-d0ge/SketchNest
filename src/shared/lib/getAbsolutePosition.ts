import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';

export const getAbsolutePosition = (
	pos: Vector2d,
	e: Konva.KonvaEventObject<TouchEvent | MouseEvent>,
) => {
	return {
		x: (pos.x - e.currentTarget.x()) / e.currentTarget.scaleX(),
		y: (pos.y - e.currentTarget.y()) / e.currentTarget.scaleY(),
	};
};
