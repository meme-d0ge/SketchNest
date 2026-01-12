import { type ComponentProps, memo } from 'react';
import { Ellipse } from 'react-konva';

export const EllipseElement = memo(
	({ ...res }: ComponentProps<typeof Ellipse>) => {
		return <Ellipse strokeWidth={4} stroke={'black'} {...res} />;
	},
);
