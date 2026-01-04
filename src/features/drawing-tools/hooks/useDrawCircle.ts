import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { CircleElement } from '@/entities/elements';
import { useHistoryStore } from '@/entities/history';
import { usePreviewStore } from '@/entities/preview/usePreviewStore.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawCircle = () => {
	const isDrawing = useRef(false);
	const { set: setPreview } = usePreviewStore();
	const { add: addToHistory } = useHistoryStore();
	const circle = useRef<CircleElement | null>(null);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const startDrawCircle = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);

				startPosition.current = {
					x: absoluteX,
					y: absoluteY,
				};
				circle.current = {
					type: 'circle',

					data: {
						x: absoluteX,
						y: absoluteY,
						radiusX: 0,
						radiusY: 0,
					},
				};
				setPreview(circle.current);
			}
		},
		[setPreview],
	);
	const drawCircle = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				isDrawing.current &&
				circle.current !== null &&
				startPosition.current !== null
			) {
				const pos = e.target.getStage()?.getPointerPosition();
				if (isVector2d(pos)) {
					const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
					const radiusX = (startPosition.current.x - absoluteX) / 2;
					const radiusY = (startPosition.current.y - absoluteY) / 2;
					circle.current = {
						type: 'circle',
						data: {
							x: startPosition.current.x - radiusX,
							y: startPosition.current.y - radiusY,
							radiusX: Math.abs(radiusX),
							radiusY: Math.abs(radiusY),
						},
					};
					setPreview(circle.current);
				}
			}
		},
		[setPreview],
	);
	const endDrawCircle = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (circle.current !== null) {
			addToHistory(circle.current);
			setPreview(null);
		}
	}, [setPreview, addToHistory]);
	return {
		startDrawCircle,
		drawCircle,
		endDrawCircle,
	};
};
