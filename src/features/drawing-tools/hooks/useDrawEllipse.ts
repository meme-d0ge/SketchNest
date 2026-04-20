import type Konva from 'konva';
import { useCallback, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { EllipseElementCreate } from '@/entities/elements';
import { ElementsEnum } from '@/entities/elements';
import { isVector2d } from '@/shared/guards/isVector2d.ts';

export const useDrawEllipse = () => {
	const { entities } = useStore();
	const isDrawing = useRef(false);
	const ellipse = useRef<EllipseElementCreate | null>(null);
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
					visualData: {
						opacity: entities.propertiesStore.opacity,
						strokeWidth: entities.propertiesStore.strokeWidth,
						stroke: entities.propertiesStore.stroke,
						fill: entities.propertiesStore.fill,
					},
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

				ellipse.current.data.x = startPosition.current.x - radiusX;
				ellipse.current.data.y = startPosition.current.y - radiusY;

				const absRadiusX = Math.abs(radiusX);
				const absRadiusY = Math.abs(radiusY);

				ellipse.current.data.radiusX = absRadiusX < 0.5 ? 0.5 : absRadiusX;
				ellipse.current.data.radiusY = absRadiusY < 0.5 ? 0.5 : absRadiusY;

				entities.interactiveStore.set(ellipse.current);
			}
		},
		[entities],
	);
	const endDrawEllipse = useCallback(() => {
		isDrawing.current = false;
		startPosition.current = null;
		if (ellipse.current !== null) {
			entities.elementsStore.create([ellipse.current]);
			entities.interactiveStore.clear();
			ellipse.current = null;
		}
	}, [entities]);
	return {
		startDrawEllipse,
		drawEllipse,
		endDrawEllipse,
	};
};
