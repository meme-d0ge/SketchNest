import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { EllipseElementOptionId } from '@/entities/elements';
import { useElementsStore, useInteractiveStore } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawEllipse = () => {
	const isDrawing = useRef(false);
	const { set: setPreview } = useInteractiveStore();
	const { add: addToElementsStore } = useElementsStore();
	const ellipse = useRef<EllipseElementOptionId | null>(null);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const startDrawEllipse = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				startPosition.current = {
					x: absoluteX,
					y: absoluteY,
				};
				ellipse.current = {
					type: 'ellipse',
					isDeleted: false,
					data: {
						x: absoluteX,
						y: absoluteY,
						radiusX: 0,
						radiusY: 0,
					},
				};
				setPreview(ellipse.current);
			}
		},
		[setPreview],
	);
	const drawEllipse = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				!isDrawing.current ||
				ellipse.current === null ||
				startPosition.current === null
			)
				return;

			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				const radiusX = (startPosition.current.x - absoluteX) / 2;
				const radiusY = (startPosition.current.y - absoluteY) / 2;
				ellipse.current = {
					type: 'ellipse',
					isDeleted: ellipse.current.isDeleted,
					data: {
						x: startPosition.current.x - radiusX,
						y: startPosition.current.y - radiusY,
						radiusX: Math.abs(radiusX),
						radiusY: Math.abs(radiusY),
					},
				};
				setPreview(ellipse.current);
			}
		},
		[setPreview],
	);
	const endDrawEllipse = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (ellipse.current !== null) {
			addToElementsStore([ellipse.current]);
			setPreview(null);
		}
	}, [addToElementsStore, setPreview]);
	return {
		startDrawEllipse,
		drawEllipse,
		endDrawEllipse,
	};
};
