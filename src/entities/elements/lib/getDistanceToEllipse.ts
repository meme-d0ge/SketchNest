import { distEllipse2 } from '@thi.ng/geom-sdf';
import type { Vector2d } from 'konva/lib/types';
import type { EllipseData } from '@/entities/elements/interfaces/ellipse-element.ts';
import type { DeepReadonly } from '@/shared/types/deepReadonly.ts';

export function getDistanceToEllipse(
	point: Vector2d,
	data: DeepReadonly<EllipseData>,
) {
	let localPosition = [point.x - data.x, point.y - data.y];
	if (data.radiusX !== data.radiusY) {
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
	return (
		Math.sqrt(localPosition[0] ** 2 + localPosition[1] ** 2) - data.radiusX
	);
}
