import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { RectElementCreate } from '@/entities/elements';
import { ElementsEnum } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';

export const useDrawRect = () => {
	const isDrawing = useRef(false);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const rect = useRef<RectElementCreate | null>(null);
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
					type: ElementsEnum.Rect,
					isDeleted: false,
					visualData: {
						opacity: 1,
						strokeWidth: 4,
						stroke: 'black',
						fill: '',
					},
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
				rect.current.data.x = Math.min(startX, curX);
				rect.current.data.y = Math.min(startY, curY);

				const width = Math.abs(curX - startX);
				const height = Math.abs(curY - startY);

				rect.current.data.width = width === 0 ? 0.5 : width;
				rect.current.data.height = height === 0 ? 0.5 : height;

				entities.interactiveStore.set(rect.current);
			}
		},
		[entities],
	);
	const endDrawRect = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (rect.current !== null) {
			entities.elementsStore.create([rect.current]);
			entities.interactiveStore.clear();
			rect.current = null;
		}
	}, [entities]);
	return { startDrawRect, drawRect, endDrawRect };
};
