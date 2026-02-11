import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	EllipseComponent,
	LineComponent,
	RectComponent,
} from '@/entities/elements';
import {ElementsEnum} from "@/entities/elements/interfaces/element-type-variant.ts";

export const StaticLayer = observer(() => {
	const { entities } = useStore();
	const elementsStore = entities.elementsStore;
	return elementsStore.elements.map((value) => {
		if (value.version !== -1) {
			const current_version = value.history[value.version];
			if (current_version.isDeleted) return null;
			if (current_version.type === ElementsEnum.Line) {
				const localBounds = {
					minX: Math.min(
						...current_version.data.points.filter((_, i) => i % 2 === 0),
					),
					maxX: Math.max(
						...current_version.data.points.filter((_, i) => i % 2 === 0),
					),
					minY: Math.min(
						...current_version.data.points.filter((_, i) => i % 2 === 1),
					),
					maxY: Math.max(
						...current_version.data.points.filter((_, i) => i % 2 === 1),
					),
				};
				const centerX = (localBounds.minX + localBounds.maxX) / 2;
				const centerY = (localBounds.minY + localBounds.maxY) / 2;
				return (
					<LineComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x + centerX}
						y={current_version.data.y + centerY}
						offsetX={centerX}
						offsetY={centerY}
						rotation={current_version.data.rotation}
						points={current_version.data.points}
						opacity={current_version.opacity}
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
						opacity={current_version.opacity}
						rotation={current_version.data.rotation}
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
						opacity={current_version.opacity}
						rotation={current_version.data.rotation}
					/>
				);
			}
		}
		return null;
	});
});
