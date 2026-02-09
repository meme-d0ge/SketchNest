import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { RectElementDraft } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';

export const useDrawRect = () => {
	const isDrawing = useRef(false);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const rect = useRef<RectElementDraft | null>(null);
	const { entities } = useStore();
	const startDrawRect = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const stage = e.target.getStage();
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
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
						rotation: 0,
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
			const stage = e.target.getStage();
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: curX, y: curY } = pos;
				const { x: startX, y: startY } = startPosition.current;
				rect.current = {
					type: 'rect',
					isDeleted: rect.current.isDeleted,
					data: {
						x: Math.min(startX, curX),
						y: Math.min(startY, curY),
						width: Math.abs(curX - startX),
						height: Math.abs(curY - startY),
						rotation: 0,
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
