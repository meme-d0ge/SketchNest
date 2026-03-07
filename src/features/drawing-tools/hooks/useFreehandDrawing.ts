import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { Bounds, LineElementCreate } from '@/entities/elements';
import { ElementsEnum } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';

export const useFreehandDrawing = () => {
	const isDrawing = useRef(false);
	const line = useRef<LineElementCreate | null>(null);
	const localBounds = useRef<Bounds>({
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
	});
	const { entities } = useStore();

	const startFreehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const stage = e.target.getStage();
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
				localBounds.current = {
					minX: 0,
					maxX: 0.01,
					minY: 0,
					maxY: 0.01,
				};
				const centerX =
					(localBounds.current.minX + localBounds.current.maxX) / 2;
				const centerY =
					(localBounds.current.minY + localBounds.current.maxY) / 2;
				line.current = {
					type: ElementsEnum.Line,
					isDeleted: false,
					visualData: {
						opacity: 1,
						strokeWidth: 5,
						stroke: 'red',
						fill: 'red'
					},
					data: {
						x: absoluteX,
						y: absoluteY,
						points: [0, 0, 0.01, 0.01],
						centerX: centerX,
						centerY: centerY,
						rotation: 0,
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
			const stage = e.target.getStage();
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
				const localX = absoluteX - line.current.data.x;
				const localY = absoluteY - line.current.data.y;
				line.current.data.points.push(localX, localY);

				if (localX > localBounds.current.maxX) {
					localBounds.current.maxX = localX;
				} else if (localX < localBounds.current.minX) {
					localBounds.current.minX = localX;
				}
				if (localY > localBounds.current.maxY) {
					localBounds.current.maxY = localY;
				} else if (localY < localBounds.current.minY) {
					localBounds.current.minY = localY;
				}

				const centerX =
					(localBounds.current.minX + localBounds.current.maxX) / 2;
				const centerY =
					(localBounds.current.minY + localBounds.current.maxY) / 2;

				line.current.data.centerX = centerX;
				line.current.data.centerY = centerY;
				entities.interactiveStore.set(line.current);
			}
		},
		[entities],
	);
	const endFreehandDraw = useCallback(() => {
		isDrawing.current = false;
		if (line.current !== null) {
			entities.elementsStore.create([line.current]);
			entities.interactiveStore.set(null);
			line.current = null;
		}
	}, [entities]);

	return { startFreehandDraw, freehandDraw, endFreehandDraw };
};
