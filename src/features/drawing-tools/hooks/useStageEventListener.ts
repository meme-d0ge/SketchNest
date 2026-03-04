import type Konva from 'konva';
import { useCallback } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { ToolsEnum } from '@/entities/tools';
import { useThrottleCallback } from '@/shared/hooks/useThrottleCallback.ts';
import { useDrawEllipse } from './useDrawEllipse.ts';
import { useDrawRect } from './useDrawRect.ts';
import { useEraser } from './useEraser.ts';
import { useFreehandDrawing } from './useFreehandDrawing.ts';

export const useStageEventListener = () => {
	const { startFreehandDraw, freehandDraw, endFreehandDraw } =
		useFreehandDrawing();
	const { startDrawEllipse, drawEllipse, endDrawEllipse } = useDrawEllipse();
	const { startDrawRect, drawRect, endDrawRect } = useDrawRect();
	const { startEraser, moveEraser, endEraser } = useEraser();
	const { entities } = useStore();
	const handleMouseDown = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (entities.toolsStore.tool === ToolsEnum.Hand) {
				} else if (entities.toolsStore.tool === ToolsEnum.Selection) {
				} else if (entities.toolsStore.tool === ToolsEnum.Ellipse) {
					startDrawEllipse(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Rect) {
					startDrawRect(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Draw) {
					startFreehandDraw(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Eraser) {
					startEraser(event);
				}
			},
			[
				startFreehandDraw,
				startDrawEllipse,
				startDrawRect,
				startEraser,
				entities,
			],
		),
		7,
	);
	const handleMouseMove = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (entities.toolsStore.tool === ToolsEnum.Hand) {
				} else if (entities.toolsStore.tool === ToolsEnum.Selection) {
				} else if (entities.toolsStore.tool === ToolsEnum.Ellipse) {
					drawEllipse(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Rect) {
					drawRect(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Draw) {
					freehandDraw(event);
				} else if (entities.toolsStore.tool === ToolsEnum.Eraser) {
					moveEraser(event);
				}
			},
			[freehandDraw, drawEllipse, drawRect, moveEraser, entities],
		),
		7,
	);
	const handleMouseUp = useThrottleCallback(
		useCallback(() => {
			if (entities.toolsStore.tool === ToolsEnum.Hand) {
			} else if (entities.toolsStore.tool === ToolsEnum.Selection) {
			} else if (entities.toolsStore.tool === ToolsEnum.Ellipse) {
				endDrawEllipse();
			} else if (entities.toolsStore.tool === ToolsEnum.Rect) {
				endDrawRect();
			} else if (entities.toolsStore.tool === ToolsEnum.Draw) {
				endFreehandDraw();
			} else if (entities.toolsStore.tool === ToolsEnum.Eraser) {
				endEraser();
			}
		}, [endFreehandDraw, endDrawEllipse, endDrawRect, endEraser, entities]),
		7,
	);

	return { handleMouseUp, handleMouseDown, handleMouseMove };
};
