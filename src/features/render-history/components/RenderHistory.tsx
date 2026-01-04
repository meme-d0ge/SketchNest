import { Ellipse, Line } from 'react-konva';
import { useHistoryStore } from '@/entities/history';

export const RenderHistory = () => {
	const { history } = useHistoryStore();
	console.log(history);
	return history.map((value, index) => {
		if (value.version !== -1) {
			const current_version = value.history[value.version];
			if (current_version.type === 'line') {
				return (
					<Line
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						stroke="#df4b26"
						strokeWidth={5}
						tension={0}
						lineCap="round"
						lineJoin="round"
						globalCompositeOperation={'source-over'}
						points={current_version.data.points}
					/>
				);
			}
			if (current_version.type === 'circle') {
				return (
					<Ellipse
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						x={current_version.data.x}
						y={current_version.data.y}
						radiusX={current_version.data.radiusX}
						radiusY={current_version.data.radiusY}
						strokeWidth={4}
						stroke={'black'}
					/>
				);
			}
		}
		return null;
	});
};
