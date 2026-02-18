import { type ComponentProps, memo } from 'react';
import { Line } from 'react-konva';

export const LineComponent = memo(({ ...res }: ComponentProps<typeof Line>) => {
	return (
		<Line
			tension={0}
			lineCap="round"
			lineJoin="round"
			globalCompositeOperation={'source-over'}
			{...res}
		/>
	);
});
