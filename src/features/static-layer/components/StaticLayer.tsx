import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	EllipseComponent,
	LineComponent,
	RectComponent,
} from '@/entities/elements';

export const StaticLayer = observer(() => {
	const { entities } = useStore();
	const elementsStore = entities.elementsStore;
	return elementsStore.elements.map((value) => {
		if (value.version !== -1) {
			const current_version = value.history[value.version];
			if (current_version.isDeleted) return null;
			if (current_version.type === 'line') {
				return (
					<LineComponent
						key={current_version.id}
						id={current_version.id}
						points={current_version.data.points}
						opacity={current_version.opacity}
					/>
				);
			}
			if (current_version.type === 'ellipse') {
				return (
					<EllipseComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x}
						y={current_version.data.y}
						radiusX={current_version.data.radiusX}
						radiusY={current_version.data.radiusY}
						opacity={current_version.opacity}
					/>
				);
			}
			if (current_version.type === 'rect') {
				return (
					<RectComponent
						key={current_version.id}
						id={current_version.id}
						x={current_version.data.x}
						y={current_version.data.y}
						width={current_version.data.width}
						height={current_version.data.height}
						opacity={current_version.opacity}
					/>
				);
			}
		}
		return null;
	});
});
