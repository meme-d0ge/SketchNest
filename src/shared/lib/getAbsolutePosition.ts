import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';

export const getAbsolutePosition = (
	pos: Vector2d,
	e: Konva.KonvaEventObject<TouchEvent | MouseEvent>,
) => {
	return {
		x: (pos.x - e.target.x()) / e.target.scaleX(),
		y: (pos.y - e.target.y()) / e.target.scaleY(),
	};
};
