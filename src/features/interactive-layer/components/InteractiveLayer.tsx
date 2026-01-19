import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	EllipseComponent,
	LineComponent,
	RectComponent,
} from '@/entities/elements';

export const InteractiveLayer = observer(() => {
	const { entities } = useStore();
	const { element } = entities.interactiveStore;
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
});
