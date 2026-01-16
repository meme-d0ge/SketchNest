import type Konva from 'konva';
import { useCallback } from 'react';
import { ToolsEnum, useToolsStore } from '@/entities/tools';
import { useThrottleCallback } from '@/shared/lib/useThrottleCallback.ts';
import { useDrawEllipse } from './useDrawEllipse.ts';
import { useDrawRect } from './useDrawRect.ts';
import { useEraser } from './useEraser.ts';
import { useFreehandDrawing } from './useFreehandDrawing.ts';

export const useStageEventListener = () => {
	const { tool } = useToolsStore();
	const { startFreehandDraw, freehandDraw, endFreehandDraw } =
		useFreehandDrawing();
	const { startDrawEllipse, drawEllipse, endDrawEllipse } = useDrawEllipse();
	const { startDrawRect, drawRect, endDrawRect } = useDrawRect();
	const { startEraser, moveEraser, endEraser } = useEraser();

	const handleMouseDown = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (tool === ToolsEnum.Hand) {
				} else if (tool === ToolsEnum.Selection) {
				} else if (tool === ToolsEnum.Ellipse) {
					startDrawEllipse(event);
				} else if (tool === ToolsEnum.Rect) {
					startDrawRect(event);
				} else if (tool === ToolsEnum.Draw) {
					startFreehandDraw(event);
				} else if (tool === ToolsEnum.Eraser) {
					startEraser();
				}
			},
			[tool, startFreehandDraw, startDrawEllipse, startDrawRect, startEraser],
		),
		7,
	);
	const handleMouseMove = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (tool === ToolsEnum.Hand) {
				} else if (tool === ToolsEnum.Selection) {
				} else if (tool === ToolsEnum.Ellipse) {
					drawEllipse(event);
				} else if (tool === ToolsEnum.Rect) {
					drawRect(event);
				} else if (tool === ToolsEnum.Draw) {
					freehandDraw(event);
				} else if (tool === ToolsEnum.Eraser) {
					moveEraser(event);
				}
			},
			[tool, freehandDraw, drawEllipse, drawRect, moveEraser],
		),
		7,
	);
	const handleMouseUp = useThrottleCallback(
		useCallback(() => {
			if (tool === ToolsEnum.Hand) {
			} else if (tool === ToolsEnum.Selection) {
			} else if (tool === ToolsEnum.Ellipse) {
				endDrawEllipse();
			} else if (tool === ToolsEnum.Rect) {
				endDrawRect();
			} else if (tool === ToolsEnum.Draw) {
				endFreehandDraw();
			} else if (tool === ToolsEnum.Eraser) {
				endEraser();
			}
		}, [tool, endFreehandDraw, endDrawEllipse, endDrawRect, endEraser]),
		7,
	);

	return { handleMouseUp, handleMouseDown, handleMouseMove };
};
