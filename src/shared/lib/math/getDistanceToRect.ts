import { rect, rotate, translate } from '@thi.ng/geom';
import { asSDF } from '@thi.ng/geom-sdf';
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
	const angle = (data.rotation * Math.PI) / 180;
	const pivot = [data.x + data.width / 2, data.y + data.height / 2];
	let shape = rect([data.x, data.y], [data.width, data.height]);
	shape = translate(shape, [-pivot[0], -pivot[1]]);
	const polygonR = rotate(shape, angle);
	const _polygon = translate(polygonR, [pivot[0], pivot[1]]);
	const dist = asSDF(_polygon)([point.x, point.y]);
	return dist;
}
