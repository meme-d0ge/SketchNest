import type Konva from 'konva';
import { useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { ToolsEnum, useToolsStore } from '@/entities/tools/useToolsStore.ts';
import { CanvasMenu } from '@/features/canvas-menu';
import { CanvasTools } from '@/features/canvas-tools';
import { useResize, useZoom } from '@/features/canvas-viewport';
import { useStageEventListener } from '@/features/drawing-tools';
import { HistoryPanel } from '@/features/history-panel';
import { RenderHistory } from '@/features/render-history';
import { RenderPreview } from '@/features/render-preview';

export const HomePage = () => {
	const stageRef = useRef<Konva.Stage | null>(null);
	const { handleMouseUp, handleMouseMove, handleMouseDown } =
		useStageEventListener();
	const { tool } = useToolsStore();
	const { windowWidth, windowHeight } = useResize();
	useZoom(stageRef);
	return (
		<div className="relative">
			<Stage
				ref={stageRef}
				draggable={tool === ToolsEnum.Hand}
				width={windowWidth}
				height={windowHeight}
				onMouseDown={handleMouseDown}
				onMousemove={handleMouseMove}
				onMouseup={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
			>
				<Layer>
					<RenderHistory />
					<RenderPreview />
				</Layer>
			</Stage>
			<CanvasMenu className="cursor-pointer absolute max-w-max h-9 top-4 left-4 z-50" />
			<HistoryPanel className="absolute max-w-max h-9 bottom-4 left-4 z-50" />
			<CanvasTools className="absolute max-w-max h-9 top-4 right-1/2 left-1/2 -translate-x-1/2 z-50" />
		</div>
	);
};
