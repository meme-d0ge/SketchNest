import type { Vector2d } from 'konva/lib/types';
import type { BoardElement } from '@/entities/elements';
import { ElementsEnum } from '@/entities/elements';
import type { DeepReadonly } from '@/shared/types/deepReadonly.ts';
import { getDistanceToEllipse } from './getDistanceToEllipse';
import { getDistanceToLine } from './getDistanceToLine';
import { getDistanceToRect } from './getDistanceToRect';

export function getDistanceToBoardElement(
	position: Vector2d,
	element: DeepReadonly<BoardElement>,
) {
	if (element.type === ElementsEnum.Rect) {
		return (
			getDistanceToRect(position, element.data) -
			element.visualData.strokeWidth / 2
		);
	}
	if (element.type === ElementsEnum.Line) {
		return (
			getDistanceToLine(position, element.data) -
			element.visualData.strokeWidth / 2
		);
	}
	if (element.type === ElementsEnum.Ellipse) {
		return (
			getDistanceToEllipse(position, element.data) -
			element.visualData.strokeWidth / 2
		);
	}
	return null;
}
