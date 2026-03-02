import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	ElementsEnum,
	EllipseComponent,
	LineComponent,
	REMOVE_ELEMENT_VERSION,
	RectComponent,
} from '@/entities/elements';

export const StaticLayer = observer(() => {
	const { entities } = useStore();
	const elementsStore = entities.elementsStore;
	const pendingSoftDelete = entities.interactiveStore.pendingSoftDelete;

	return elementsStore.elements.map((value) => {
		if (value.version !== REMOVE_ELEMENT_VERSION) {
			const current_version = value.presentElement;
			if (current_version.isDeleted) return null;
			const opacity =
				current_version.id in pendingSoftDelete
					? current_version.visualData.opacity * 0.5
					: current_version.visualData.opacity;

			if (current_version.type === ElementsEnum.Line) {
				return (
					<LineComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x + current_version.data.centerX}
						y={current_version.data.y + current_version.data.centerY}
						offsetX={current_version.data.centerX}
						offsetY={current_version.data.centerY}
						rotation={current_version.data.rotation}
						points={current_version.data.points}
						opacity={opacity}
						stroke={current_version.visualData.stroke}
						strokeWidth={current_version.visualData.strokeWidth}
					/>
				);
			}
			if (current_version.type === ElementsEnum.Ellipse) {
				return (
					<EllipseComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x}
						y={current_version.data.y}
						radiusX={current_version.data.radiusX}
						radiusY={current_version.data.radiusY}
						rotation={current_version.data.rotation}
						opacity={opacity}
						stroke={current_version.visualData.stroke}
						strokeWidth={current_version.visualData.strokeWidth}
					/>
				);
			}
			if (current_version.type === ElementsEnum.Rect) {
				return (
					<RectComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x + current_version.data.width / 2}
						y={current_version.data.y + current_version.data.height / 2}
						width={current_version.data.width}
						height={current_version.data.height}
						offsetX={current_version.data.width / 2}
						offsetY={current_version.data.height / 2}
						rotation={current_version.data.rotation}
						opacity={opacity}
						stroke={current_version.visualData.stroke}
						strokeWidth={current_version.visualData.strokeWidth}
					/>
				);
			}
		}
		return null;
	});
});
