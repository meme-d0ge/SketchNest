import { distPolyline2 } from '@thi.ng/geom-sdf';
import type { Vector2d } from 'konva/lib/types';
import type { LineData } from '@/entities/elements/interfaces/line-element.ts';
export function getDistanceToLine(point: Vector2d, data: LineData) {
	if (data.points.length < 2 || data.points.length % 2 !== 0) return NaN;

	const points = [];
	for (let i = 0; i < data.points.length; i = i + 2) {
		points.push([data.points[i], data.points[i + 1]]);
	}

	let localPoint = [point.x - data.x, point.y - data.y];
	if (data.rotation !== 0) {
		const angle = -(data.rotation * Math.PI) / 180;

		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		localPoint = [localPoint[0] - data.centerX, localPoint[1] - data.centerY];
		localPoint = [
			cos * localPoint[0] - sin * localPoint[1],
			sin * localPoint[0] + cos * localPoint[1],
		];
		localPoint = [localPoint[0] + data.centerX, localPoint[1] + data.centerY];
	}

	return distPolyline2(localPoint, points);
}
