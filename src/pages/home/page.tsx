import { FastLayer, Stage } from 'react-konva';
import { ToolsEnum, useToolsStore } from '@/entities/tools/useToolsStore.ts';
import { CanvasMenu } from '@/features/canvas-menu';
import { CanvasTools } from '@/features/canvas-tools';
import { useStageEventListener } from '@/features/drawing-tools';
import { HistoryPanel } from '@/features/history-panel';
import { RenderHistory } from '@/features/render-history';
import { RenderPreview } from '@/features/render-preview';

export const HomePage = () => {
	const { handleMouseUp, handleMouseMove, handleMouseDown } =
		useStageEventListener();
	const { tool } = useToolsStore();

	return (
		<div className="relative">
			<Stage
				draggable={tool === ToolsEnum.Hand}
				width={window.innerWidth}
				height={window.innerHeight}
				onMouseDown={handleMouseDown}
				onMousemove={handleMouseMove}
				onMouseup={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
			>
				<FastLayer>
					<RenderHistory />
					<RenderPreview />
				</FastLayer>
			</Stage>
			<CanvasMenu className="cursor-pointer absolute max-w-max max-h-max top-4 left-4 z-50" />
			<HistoryPanel className="absolute max-w-max max-h-max bottom-4 left-4 z-50" />
			<CanvasTools className="absolute max-w-max max-h-max top-4 right-1/2 left-1/2 -translate-x-1/2 z-50" />
		</div>
	);
};
