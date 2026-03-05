import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	ElementsEnum,
	EllipseComponent,
	LineComponent,
	RectComponent,
} from '@/entities/elements';

export const StaticLayer = observer(() => {
	const { entities } = useStore();
	const elementsStore = entities.elementsStore;
	const pendingSoftDelete = entities.interactiveStore.pendingSoftDelete;

	return elementsStore.visibleElements.map((element) => {
		if (element.isDeleted) return null;
		const opacity =
			element.id in pendingSoftDelete
				? element.visualData.opacity * 0.5
				: element.visualData.opacity;

		if (element.type === ElementsEnum.Line) {
			return (
				<LineComponent
					key={element.id}
					id={element.id}
					x={element.data.x + element.data.centerX}
					y={element.data.y + element.data.centerY}
					offsetX={element.data.centerX}
					offsetY={element.data.centerY}
					rotation={element.data.rotation}
					points={element.data.points as number[]}
					opacity={opacity}
					stroke={element.visualData.stroke}
					strokeWidth={element.visualData.strokeWidth}
				/>
			);
		}
		if (element.type === ElementsEnum.Ellipse) {
			return (
				<EllipseComponent
					key={element.id}
					id={element.id}
					x={element.data.x}
					y={element.data.y}
					radiusX={element.data.radiusX}
					radiusY={element.data.radiusY}
					rotation={element.data.rotation}
					opacity={opacity}
					stroke={element.visualData.stroke}
					strokeWidth={element.visualData.strokeWidth}
				/>
			);
		}
		if (element.type === ElementsEnum.Rect) {
			return (
				<RectComponent
					key={element.id}
					id={element.id}
					x={element.data.x + element.data.width / 2}
					y={element.data.y + element.data.height / 2}
					width={element.data.width}
					height={element.data.height}
					offsetX={element.data.width / 2}
					offsetY={element.data.height / 2}
					rotation={element.data.rotation}
					opacity={opacity}
					stroke={element.visualData.stroke}
					strokeWidth={element.visualData.strokeWidth}
				/>
			);
		}
		return null;
	});
});
