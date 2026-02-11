import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	EllipseComponent,
	LineComponent,
	RectComponent,
} from '@/entities/elements';
import {ElementsEnum} from "@/entities/elements/interfaces/element-type-variant.ts";

export const InteractiveLayer = observer(() => {
	const { entities } = useStore();
	const { element } = entities.interactiveStore;
	if (element === null) {
		return null;
	}
	if (element.type === ElementsEnum.Line) {
		return (
			<LineComponent
				id={element.id}
				x={element.data.x}
				y={element.data.y}
				points={element.data.points}
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
			/>
		);
	}
	if (element.type === ElementsEnum.Rect) {
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
