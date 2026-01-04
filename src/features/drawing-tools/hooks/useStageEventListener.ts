import type Konva from 'konva';
import { useCallback } from 'react';
import { ToolsEnum, useToolsStore } from '@/entities/tools/useToolsStore.ts';
import { useFreehandDrawing } from '@/features/drawing-tools/hooks/useFreehandDrawing.ts';

export const useStageEventListener = () => {
	const { tool } = useToolsStore();
	const { startFreehandDraw, freehandDraw, endFreehandDraw } =
		useFreehandDrawing();

	const handleMouseDown = useCallback(
		(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (tool === ToolsEnum.Hand) {
			} else if (tool === ToolsEnum.Selection) {
			} else if (tool === ToolsEnum.Circle) {
			} else if (tool === ToolsEnum.Square) {
			} else if (tool === ToolsEnum.Draw) {
				startFreehandDraw(event);
			}
		},
		[tool, startFreehandDraw],
	);
	const handleMouseMove = useCallback(
		(event: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (tool === ToolsEnum.Hand) {
			} else if (tool === ToolsEnum.Selection) {
			} else if (tool === ToolsEnum.Circle) {
			} else if (tool === ToolsEnum.Square) {
			} else if (tool === ToolsEnum.Draw) {
				freehandDraw(event);
			}
		},
		[tool, freehandDraw],
	);
	const handleMouseUp = useCallback(() => {
		if (tool === ToolsEnum.Hand) {
		} else if (tool === ToolsEnum.Selection) {
		} else if (tool === ToolsEnum.Circle) {
		} else if (tool === ToolsEnum.Square) {
		} else if (tool === ToolsEnum.Draw) {
			endFreehandDraw();
		}
	}, [tool, endFreehandDraw]);

	return { handleMouseUp, handleMouseDown, handleMouseMove };
};
