import { distBox2 } from '@thi.ng/geom-sdf';
import type { Vector2d } from 'konva/lib/types';

export function getDistanceToRect(
	point: Vector2d,
	data: {
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number;
	},
) {
	let localPosition = [
		point.x - (data.x + data.width / 2),
		point.y - (data.y + data.height / 2),
	];
	if (data.rotation !== 0) {
		const angle = -(data.rotation * Math.PI) / 180;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		localPosition = [
			cos * localPosition[0] - sin * localPosition[1],
			sin * localPosition[0] + cos * localPosition[1],
		];
	}

	return distBox2(localPosition, [data.width / 2, data.height / 2]);
}
