import { distEllipse2 } from '@thi.ng/geom-sdf';
import type { Vector2d } from 'konva/lib/types';

export function getDistanceToEllipse(
	point: Vector2d,
	data: {
		x: number;
		radiusX: number;
		y: number;
		radiusY: number;
		rotation: number;
	},
) {
	let localPosition = [point.x - data.x, point.y - data.y];
	if (data.rotation !== 0) {
		const angle = -(data.rotation * Math.PI) / 180;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		localPosition = [
			cos * localPosition[0] - sin * localPosition[1],
			sin * localPosition[0] + cos * localPosition[1],
		];
	}
	return distEllipse2(localPosition, [data.radiusX, data.radiusY]);
}
