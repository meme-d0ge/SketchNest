import { EllipseElement } from '@/entities/elements/components/EllipseElement.tsx';
import { LineElement } from '@/entities/elements/components/LineElement.tsx';
import { RectElement } from '@/entities/elements/components/RectElement.tsx';
import { useHistoryStore } from '@/entities/history';

export const RenderHistory = () => {
	const { history } = useHistoryStore();
	return history.map((value) => {
		if (value.version !== -1) {
			const current_version = value.history[value.version];
			if (current_version.isDeleted) return null;
			if (current_version.type === 'line') {
				return (
					<LineElement
						key={current_version.id}
						id={current_version.id}
						points={current_version.data.points}
						opacity={current_version.opacity}
					/>
				);
			}
			if (current_version.type === 'circle') {
				return (
					<EllipseElement
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
			if (current_version.type === 'square') {
				return (
					<RectElement
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
};
