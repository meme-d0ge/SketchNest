import { type ComponentProps, memo } from 'react';
import { Line } from 'react-konva';

export const LineElement = memo(({ ...res }: ComponentProps<typeof Line>) => {
	return (
		<Line
			stroke="#df4b26"
			strokeWidth={5}
			tension={0}
			lineCap="round"
			lineJoin="round"
			globalCompositeOperation={'source-over'}
			{...res}
		/>
	);
});
