import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { EllipseElementDraft } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import {ElementsEnum} from "@/entities/elements/interfaces/element-type-variant.ts";

export const useDrawEllipse = () => {
	const { entities } = useStore();
	const isDrawing = useRef(false);
	const ellipse = useRef<EllipseElementDraft | null>(null);
	const startPosition = useRef<{ x: number; y: number } | null>(null);
	const startDrawEllipse = useCallback(
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
				ellipse.current = {
					type: ElementsEnum.Ellipse,
					isDeleted: false,
					data: {
						x: absoluteX,
						y: absoluteY,
						radiusX: 0,
						radiusY: 0,
						rotation: 0,
					},
				};
				entities.interactiveStore.set(ellipse.current);
			}
		},
		[entities],
	);
	const drawEllipse = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (
				!isDrawing.current ||
				ellipse.current === null ||
				startPosition.current === null
			)
				return;
			const stage = e.target.getStage();
			const pos = stage?.getRelativePointerPosition();
			if (isVector2d(pos)) {
				const { x: absoluteX, y: absoluteY } = pos;
				const radiusX = (startPosition.current.x - absoluteX) / 2;
				const radiusY = (startPosition.current.y - absoluteY) / 2;
				ellipse.current = {
					type: ElementsEnum.Ellipse,
					isDeleted: ellipse.current.isDeleted,
					data: {
						x: startPosition.current.x - radiusX,
						y: startPosition.current.y - radiusY,
						radiusX: Math.abs(radiusX),
						radiusY: Math.abs(radiusY),
						rotation: 0,
					},
				};
				entities.interactiveStore.set(ellipse.current);
			}
		},
		[entities],
	);
	const endDrawEllipse = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (ellipse.current !== null) {
			entities.elementsStore.add([ellipse.current]);
			entities.interactiveStore.set(null);
		}
	}, [entities]);
	return {
		startDrawEllipse,
		drawEllipse,
		endDrawEllipse,
	};
};
