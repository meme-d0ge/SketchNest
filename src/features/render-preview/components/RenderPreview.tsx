import { Ellipse, Line, Rect } from 'react-konva';
import { usePreviewStore } from '@/entities/preview/usePreviewStore.ts';

export const RenderPreview = () => {
	const { element } = usePreviewStore();
	if (element === null) {
		return null;
	}
	if (element.type === 'line') {
		return (
			<Line
				stroke="#df4b26"
				strokeWidth={5}
				tension={0}
				lineCap="round"
				lineJoin="round"
				globalCompositeOperation={'source-over'}
				points={element.data.points}
			/>
		);
	}
	if (element.type === 'circle') {
		return (
			<Ellipse
				x={element.data.x}
				y={element.data.y}
				radiusX={element.data.radiusX}
				radiusY={element.data.radiusY}
				strokeWidth={4}
				stroke={'black'}
			/>
		);
	}
	if (element.type === 'square') {
		return (
			<Rect
				x={element.data.x}
				y={element.data.y}
				width={element.data.width}
				height={element.data.height}
				strokeWidth={4}
				stroke={'black'}
			/>
		);
	}
	return null;
};
