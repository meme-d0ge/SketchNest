import { Line } from 'react-konva';
import { useHistoryStore } from '@/entities/history';

export const RenderHistory = () => {
	const { history } = useHistoryStore();
	return history.map((value, index) => {
		if (value.version !== -1) {
			const last = value.history[value.version];
			if (last.type === 'line') {
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
						points={last.data.points}
					/>
				);
			}
		}
		return null;
	});
};
