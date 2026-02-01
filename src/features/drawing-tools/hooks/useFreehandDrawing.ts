import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { LineElementOptionId } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';

export const useFreehandDrawing = () => {
	const isDrawing = useRef(false);
	const line = useRef<LineElementOptionId | null>(null);
	const { entities } = useStore();

	const startFreehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const stage = e.target.getStage()
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
				line.current = {
					type: 'line',
					isDeleted: false,
					data: {
						points: [absoluteX, absoluteY],
					},
				};
				entities.interactiveStore.set(line.current);
			}
		},
		[entities],
	);
	const freehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current || line.current === null) return;
			const stage = e.target.getStage()
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
				line.current = {
					type: 'line',
					isDeleted: line.current.isDeleted,
					data: {
						points: [...line.current.data.points, absoluteX, absoluteY],
					},
				};
				entities.interactiveStore.set(line.current);
			}
		},
		[entities],
	);
	const endFreehandDraw = useCallback(() => {
		isDrawing.current = false;
		if (line.current !== null) {
			entities.elementsStore.add([line.current]);
			entities.interactiveStore.set(null);
			line.current = null;
		}
	}, [entities]);

	return { startFreehandDraw, freehandDraw, endFreehandDraw };
};
