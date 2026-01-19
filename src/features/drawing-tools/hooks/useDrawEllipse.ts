import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { EllipseElementOptionId } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawEllipse = () => {
	const { entities } = useStore();
	const isDrawing = useRef(false);
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
				entities.interactiveStore.set(ellipse.current);
			}
		},
		[entities],
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
				entities.interactiveStore.set(ellipse.current);
			}
		},
		[entities],
	);
	const endDrawEllipse = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (ellipse.current !== null) {
			entities.elementsStore.add([ellipse.current]);
			entities.interactiveStore.set(null);
		}
	}, [entities]);
	return {
		startDrawEllipse,
		drawEllipse,
		endDrawEllipse,
	};
};
