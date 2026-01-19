import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { RectElementOptionId } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useDrawRect = () => {
	const isDrawing = useRef(false);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const rect = useRef<RectElementOptionId | null>(null);
	const { entities } = useStore();
	const startDrawRect = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				startPosition.current = {
					x: absoluteX,
					y: absoluteY,
				};
				rect.current = {
					type: 'rect',
					isDeleted: false,
					data: {
						x: absoluteX,
						y: absoluteY,
						width: 0,
						height: 0,
					},
				};
				entities.interactiveStore.set(rect.current);
			}
		},
		[entities],
	);
	const drawRect = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				!isDrawing.current ||
				rect.current === null ||
				startPosition.current === null
			)
				return;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				const width = startPosition.current.x - absoluteX;
				const height = startPosition.current.y - absoluteY;
				rect.current = {
					type: 'rect',
					isDeleted: rect.current.isDeleted,
					data: {
						x: startPosition.current.x - width,
						y: startPosition.current.y - height,
						width: width,
						height: height,
					},
				};
				entities.interactiveStore.set(rect.current);
			}
		},
		[entities],
	);
	const endDrawRect = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (rect.current !== null) {
			entities.elementsStore.add([rect.current]);
			entities.interactiveStore.set(null);
		}
	}, [entities]);
	return { startDrawRect, drawRect, endDrawRect };
};
