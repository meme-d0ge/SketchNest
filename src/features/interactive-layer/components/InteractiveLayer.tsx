import { EllipseElement } from '@/entities/elements/components/EllipseElement.tsx';
import { LineElement } from '@/entities/elements/components/LineElement.tsx';
import { RectElement } from '@/entities/elements/components/RectElement.tsx';
import { useInteractiveStore } from '@/entities/preview/useInteractiveStore.ts';

export const InteractiveLayer = () => {
	const { element } = useInteractiveStore();
	if (element === null) {
		return null;
	}
	if (element.type === 'line') {
		return <LineElement id={element.id} points={element.data.points} />;
	}
	if (element.type === 'circle') {
		return (
			<EllipseElement
				x={element.data.x}
				y={element.data.y}
				radiusX={element.data.radiusX}
				radiusY={element.data.radiusY}
			/>
		);
	}
	if (element.type === 'square') {
		return (
			<RectElement
				x={element.data.x}
				y={element.data.y}
				width={element.data.width}
				height={element.data.height}
			/>
		);
	}
	return null;
};
