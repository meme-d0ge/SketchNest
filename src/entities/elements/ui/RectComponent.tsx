import { type ComponentProps, memo } from 'react';
import { Rect } from 'react-konva';

export const RectComponent = memo(({ ...res }: ComponentProps<typeof Rect>) => {
	return <Rect {...res} />;
});
