import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useHistoryStore } from '@/entities/history';
import { usePreviewStore } from '@/entities/preview/usePreviewStore.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useFreehandDrawing = () => {
	const isDrawing = useRef(false);
	const line = useRef<number[]>([]);
	const { set: setPreview } = usePreviewStore();
	const { add } = useHistoryStore();

	const startFreehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = [...line.current, absoluteX, absoluteY];
				setPreview({ type: 'line', data: { points: line.current } });
			}
		},
		[setPreview],
	);
	const freehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current) {
				return;
			}
			const pos = e.target.getStage()?.getPointerPosition();

			e.target.scaleX();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = [...line.current, absoluteX, absoluteY];
				setPreview({ type: 'line', data: { points: line.current } });
			}
		},
		[setPreview],
	);
	const endFreehandDraw = useCallback(() => {
		isDrawing.current = false;
		add({ type: 'line', data: { points: line.current } });
		line.current = [];
		setPreview(null);
	}, [add, setPreview]);

	return { startFreehandDraw, freehandDraw, endFreehandDraw };
};
