import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { LineElementOptionId } from '@/entities/elements';
import { useElementsStore, useInteractiveStore } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useFreehandDrawing = () => {
	const isDrawing = useRef(false);
	const line = useRef<LineElementOptionId | null>(null);
	const { set: setPreview } = useInteractiveStore();
	const { add: addToElementsStore } = useElementsStore();

	const startFreehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = {
					type: 'line',
					isDeleted: false,
					data: {
						points: [absoluteX, absoluteY],
					},
				};
				setPreview(line.current);
			}
		},
		[setPreview],
	);
	const freehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current || line.current === null) return;

			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = {
					type: 'line',
					isDeleted: line.current.isDeleted,
					data: {
						points: [...line.current.data.points, absoluteX, absoluteY],
					},
				};
				setPreview(line.current);
			}
		},
		[setPreview],
	);
	const endFreehandDraw = useCallback(() => {
		isDrawing.current = false;
		if (line.current !== null) {
			addToElementsStore([line.current]);
			setPreview(null);
			line.current = null;
		}
	}, [addToElementsStore, setPreview]);

	return { startFreehandDraw, freehandDraw, endFreehandDraw };
};
