import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { SquareElementOptionId } from '@/entities/elements';
import { useElementsStore } from '@/entities/elements';
import { useInteractiveStore } from '@/entities/preview/useInteractiveStore.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawSquare = () => {
	const isDrawing = useRef(false);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const { set: setPreview } = useInteractiveStore();
	const { add: addToElementsStore } = useElementsStore();
	const square = useRef<SquareElementOptionId | null>(null);
	const startDrawSquare = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				startPosition.current = {
					x: absoluteX,
					y: absoluteY,
				};
				square.current = {
					type: 'square',
					isDeleted: false,
					data: {
						x: absoluteX,
						y: absoluteY,
						width: 0,
						height: 0,
					},
				};
				setPreview(square.current);
			}
		},
		[setPreview],
	);
	const drawSquare = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				!isDrawing.current ||
				square.current === null ||
				startPosition.current === null
			)
				return;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				const width = startPosition.current.x - absoluteX;
				const height = startPosition.current.y - absoluteY;
				square.current = {
					type: 'square',
					isDeleted: square.current.isDeleted,
					data: {
						x: startPosition.current.x - width,
						y: startPosition.current.y - height,
						width: width,
						height: height,
					},
				};
				setPreview(square.current);
			}
		},
		[setPreview],
	);
	const endDrawSquare = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (square.current !== null) {
			addToElementsStore([square.current]);
			setPreview(null);
		}
	}, [addToElementsStore, setPreview]);
	return { startDrawSquare, drawSquare, endDrawSquare };
};
