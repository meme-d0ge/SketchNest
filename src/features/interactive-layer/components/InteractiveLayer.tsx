import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	ElementsEnum,
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
	if (element.type === ElementsEnum.Line) {
		return (
			<LineComponent
				x={element.data.x + element.data.centerX}
				y={element.data.y + element.data.centerY}
				offsetX={element.data.centerX}
				offsetY={element.data.centerY}
				rotation={element.data.rotation}
				points={element.data.points}
				opacity={element.visualData.opacity}
				stroke={element.visualData.stroke}
				strokeWidth={element.visualData.strokeWidth}
				fill={element.visualData.fill}
				closed={element.visualData.closed}
			/>
		);
	}
	if (element.type === ElementsEnum.Ellipse) {
		return (
			<EllipseComponent
				x={element.data.x}
				y={element.data.y}
				radiusX={element.data.radiusX}
				radiusY={element.data.radiusY}
				rotation={element.data.rotation}
				opacity={element.visualData.opacity}
				stroke={element.visualData.stroke}
				strokeWidth={element.visualData.strokeWidth}
				fill={element.visualData.fill}
			/>
		);
	}
	if (element.type === ElementsEnum.Rect) {
		return (
			<RectComponent
				x={element.data.x + element.data.width / 2}
				y={element.data.y + element.data.height / 2}
				width={element.data.width}
				height={element.data.height}
				offsetX={element.data.width / 2}
				offsetY={element.data.height / 2}
				rotation={element.data.rotation}
				opacity={element.visualData.opacity}
				stroke={element.visualData.stroke}
				strokeWidth={element.visualData.strokeWidth}
				fill={element.visualData.fill}
			/>
		);
	}
	return null;
});
