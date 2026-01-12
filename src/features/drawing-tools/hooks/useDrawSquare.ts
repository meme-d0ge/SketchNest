import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { SquareElement } from '@/entities/elements';
import { useHistoryStore } from '@/entities/history';
import { usePreviewStore } from '@/entities/preview/usePreviewStore.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawSquare = () => {
	const isDrawing = useRef(false);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const { set: setPreview } = usePreviewStore();
	const { add: addToHistory, history } = useHistoryStore();

	const square = useRef<SquareElement | null>(null);
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
					id: String(history.length),
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
		[setPreview, history],
	);
	const drawSquare = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				!isDrawing.current ||
				square.current === null ||
				startPosition.current === null
			) return;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				const width = startPosition.current.x - absoluteX;
				const height = startPosition.current.y - absoluteY;
				square.current = {
					type: 'square',
					id: square.current.id,
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
			addToHistory(square.current);
			setPreview(null);
		}
	}, [addToHistory, setPreview]);
	return { startDrawSquare, drawSquare, endDrawSquare };
};
