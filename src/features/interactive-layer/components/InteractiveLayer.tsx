import {
	EllipseComponent,
	LineComponent,
	RectComponent,
	useInteractiveStore,
} from '@/entities/elements';

export const InteractiveLayer = () => {
	const { element } = useInteractiveStore();
	if (element === null) {
		return null;
	}
	if (element.type === 'line') {
		return <LineComponent id={element.id} points={element.data.points} />;
	}
	if (element.type === 'ellipse') {
		return (
			<EllipseComponent
				x={element.data.x}
				y={element.data.y}
				radiusX={element.data.radiusX}
				radiusY={element.data.radiusY}
			/>
		);
	}
	if (element.type === 'rect') {
		return (
			<RectComponent
				x={element.data.x}
				y={element.data.y}
				width={element.data.width}
				height={element.data.height}
			/>
		);
	}
	return null;
};
