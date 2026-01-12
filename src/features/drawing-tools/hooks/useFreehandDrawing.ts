import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import type { LineElement } from '@/entities/elements';
import { useHistoryStore } from '@/entities/history';
import { usePreviewStore } from '@/entities/preview/usePreviewStore.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getAbsolutePosition } from '@/shared/lib/getAbsolutePosition.ts';

export const useFreehandDrawing = () => {
	const isDrawing = useRef(false);
	const line = useRef<LineElement | null>(null);
	const { set: setPreview } = usePreviewStore();
	const { add: addHistory, history } = useHistoryStore();

	const startFreehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = {
					type: 'line',
					id: String(history.length),
					isDeleted: false,
					data: {
						points: [absoluteX, absoluteY],
					},
				};
				setPreview(line.current);
			}
		},
		[setPreview, history],
	);
	const freehandDraw = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current || line.current === null) return;

			const pos = e.target.getStage()?.getPointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = getAbsolutePosition(pos, e);
				line.current = {
					type: 'line',
					id: line.current.id,
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
			addHistory(line.current);
			setPreview(null);
			line.current = null;
		}
	}, [addHistory, setPreview]);

	return { startFreehandDraw, freehandDraw, endFreehandDraw };
};
