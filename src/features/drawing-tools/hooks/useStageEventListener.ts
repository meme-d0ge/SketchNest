import type Konva from 'konva';
import { useCallback } from 'react';
import { ToolsEnum, useToolsStore } from '@/entities/tools/useToolsStore.ts';
import { useDrawCircle } from '@/features/drawing-tools/hooks/useDrawCircle.ts';
import { useDrawSquare } from '@/features/drawing-tools/hooks/useDrawSquare.ts';
import { useFreehandDrawing } from '@/features/drawing-tools/hooks/useFreehandDrawing.ts';
import { useThrottleCallback } from '@/shared/lib/useThrottleCallback.ts';

export const useStageEventListener = () => {
	const { tool } = useToolsStore();
	const { startFreehandDraw, freehandDraw, endFreehandDraw } =
		useFreehandDrawing();
	const { startDrawCircle, drawCircle, endDrawCircle } = useDrawCircle();
	const { startDrawSquare, drawSquare, endDrawSquare } = useDrawSquare();

	const handleMouseDown = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (tool === ToolsEnum.Hand) {
				} else if (tool === ToolsEnum.Selection) {
				} else if (tool === ToolsEnum.Circle) {
					startDrawCircle(event);
				} else if (tool === ToolsEnum.Square) {
					startDrawSquare(event);
				} else if (tool === ToolsEnum.Draw) {
					startFreehandDraw(event);
				} else if (tool === ToolsEnum.Eraser) {
				}
			},
			[tool, startFreehandDraw, startDrawCircle, startDrawSquare],
		),
		7,
	);
	const handleMouseMove = useThrottleCallback(
		useCallback(
			(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
				if (tool === ToolsEnum.Hand) {
				} else if (tool === ToolsEnum.Selection) {
				} else if (tool === ToolsEnum.Circle) {
					drawCircle(event);
				} else if (tool === ToolsEnum.Square) {
					drawSquare(event);
				} else if (tool === ToolsEnum.Draw) {
					freehandDraw(event);
				} else if (tool === ToolsEnum.Eraser) {
				}
			},
			[tool, freehandDraw, drawCircle, drawSquare],
		),
		7,
	);
	const handleMouseUp = useThrottleCallback(
		useCallback(() => {
			if (tool === ToolsEnum.Hand) {
			} else if (tool === ToolsEnum.Selection) {
			} else if (tool === ToolsEnum.Circle) {
				endDrawCircle();
			} else if (tool === ToolsEnum.Square) {
				endDrawSquare();
			} else if (tool === ToolsEnum.Draw) {
				endFreehandDraw();
			} else if (tool === ToolsEnum.Eraser) {
			}
		}, [tool, endFreehandDraw, endDrawCircle, endDrawSquare]),
		7,
	);

	return { handleMouseUp, handleMouseDown, handleMouseMove };
};
