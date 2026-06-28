import type Konva from 'konva';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { ToolsEnum } from '@/entities/tools';
import { CanvasMenu } from '@/features/canvas-menu';
import { CanvasTools } from '@/features/canvas-tools';
import { useResize, useZoom } from '@/features/canvas-viewport';
import { useStageEventListener } from '@/features/drawing-tools';
import { HistoryPanel } from '@/features/history-panel';
import { InteractiveLayer } from '@/features/interactive-layer';
import { PropertiesPanel } from '@/features/properties-panel';
import { StaticLayer } from '@/features/static-layer';

export const HomePage = observer(() => {
	const stageRef = useRef<Konva.Stage | null>(null);
	const staticRef = useRef<Konva.Layer | null>(null);

	const { handlePointerDown, handlePointerMove, handlePointerUp } =
		useStageEventListener();
	const { windowWidth, windowHeight } = useResize();
	useZoom(stageRef);

	useEffect(() => {
		const stage = stageRef.current;
		if (stage !== null) {
			stage.on('pointerdown', (e) => {
				const nativePointerEvent = e.evt;
				stage.content.setPointerCapture(nativePointerEvent.pointerId);
			});
		}
	}, []);

	const { entities } = useStore();
	return (
		<div className="relative">
			<Stage
				ref={stageRef}
				draggable={entities.toolsStore.tool === ToolsEnum.Hand}
				width={windowWidth}
				height={windowHeight}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onLostPointerCapture={handlePointerUp}
			>
				<Layer ref={staticRef}>
					<StaticLayer />
				</Layer>
				<Layer listening={false}>
					<InteractiveLayer />
				</Layer>
			</Stage>
			{entities.toolsStore.tool !== ToolsEnum.Hand &&
			entities.toolsStore.tool !== ToolsEnum.Eraser ? (
				<PropertiesPanel className="absolute left-4 top-20 z-10 w-60" />
			) : null}
			<CanvasMenu
				className="cursor-pointer absolute max-w-max h-9 top-4 left-4 z-50"
				stageRef={stageRef}
			/>
			<HistoryPanel className="absolute max-w-max h-9 bottom-4 left-4 z-50" />
			<CanvasTools className="absolute top-3 right-1/2 left-1/2 -translate-x-1/2 z-50 p-1 w-fit" />
		</div>
	);
});
