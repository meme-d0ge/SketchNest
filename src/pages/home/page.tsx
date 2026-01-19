import type Konva from 'konva';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { FastLayer, Layer, Stage } from 'react-konva';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { ToolsEnum } from '@/entities/tools';
import { CanvasMenu } from '@/features/canvas-menu';
import { CanvasTools } from '@/features/canvas-tools';
import { useResize, useZoom } from '@/features/canvas-viewport';
import { useStageEventListener } from '@/features/drawing-tools';
import { HistoryPanel } from '@/features/history-panel';
import { InteractiveLayer } from '@/features/interactive-layer';
import { StaticLayer } from '@/features/static-layer';

export const HomePage = observer(() => {
	const stageRef = useRef<Konva.Stage | null>(null);
	const { handleMouseUp, handleMouseMove, handleMouseDown } =
		useStageEventListener();
	const { windowWidth, windowHeight } = useResize();
	useZoom(stageRef);
	const { entities } = useStore();
	return (
		<div className="relative">
			<Stage
				ref={stageRef}
				draggable={entities.toolsStore.tool === ToolsEnum.Hand}
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
					<StaticLayer />
				</Layer>
				<FastLayer>
					<InteractiveLayer />
				</FastLayer>
			</Stage>
			<CanvasMenu className="cursor-pointer absolute max-w-max h-9 top-4 left-4 z-50" />
			<HistoryPanel className="absolute max-w-max h-9 bottom-4 left-4 z-50" />
			<CanvasTools className="absolute max-w-max h-9 top-4 right-1/2 left-1/2 -translate-x-1/2 z-50" />
		</div>
	);
});
