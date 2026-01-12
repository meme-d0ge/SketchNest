import { type ComponentProps, memo } from 'react';
import { Rect } from 'react-konva';

export const RectElement = memo(({ ...res }: ComponentProps<typeof Rect>) => {
	return <Rect strokeWidth={4} stroke={'black'} {...res} />;
});
