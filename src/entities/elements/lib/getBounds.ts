import {
	bounds,
	ellipse,
	polyline,
	rect,
	rotate,
	translate,
} from '@thi.ng/geom';
import type { BoardElement } from '@/entities/elements/interfaces/board-element';
import { ElementsEnum } from '@/entities/elements/interfaces/element-type-variant.ts';
import { EllipseDataSchema } from '@/entities/elements/interfaces/ellipse-element.ts';
import { LineDataSchema } from '@/entities/elements/interfaces/line-element.ts';
import { RectDataSchema } from '@/entities/elements/interfaces/rect-element.ts';

export function getBounds(
	data: BoardElement['data'],
	type: BoardElement['type'],
) {
	switch (type) {
		case ElementsEnum.Rect: {
			const validData = RectDataSchema.parse(data);
			const { x, y, width, height } = validData;
			const pivot = [x + width / 2, y + height / 2];
			const angle = (data.rotation * Math.PI) / 180;
			let shape = rect([x, y], [width, height]);
			shape = translate(shape, [-pivot[0], -pivot[1]]);
			const polygon = rotate(shape, angle);
			const _polygon = translate(polygon, [pivot[0], pivot[1]]);
			const _bounds = bounds(_polygon);
			const max = _bounds?.max();
			const min = _bounds?.min();

			if (max === undefined || min === undefined) return null;
			return {
				maxX: max[0],
				minX: min[0],
				maxY: max[1],
				minY: min[1],
			};
		}
		case ElementsEnum.Line: {
			const validData = LineDataSchema.parse(data);
			if (validData.points.length < 2 || validData.points.length % 2 !== 0)
				return null;

			const newArrPoints = [];
			for (let i = 0; i < validData.points.length; i = i + 2) {
				newArrPoints.push([validData.points[i], validData.points[i + 1]]);
			}
			const angle = (validData.rotation * Math.PI) / 180;

			const pivot = [validData.centerX, validData.centerY];

			let _polyline = polyline(newArrPoints);
			_polyline = translate(_polyline, [-pivot[0], -pivot[1]]);
			const polygon = rotate(_polyline, angle);
			_polyline = translate(polygon, [pivot[0], pivot[1]]);

			const _bounds = bounds(_polyline);
			const max = _bounds?.max();
			const min = _bounds?.min();

			if (max === undefined || min === undefined) return null;
			return {
				maxX: validData.x + max[0],
				minX: validData.x + min[0],
				maxY: validData.y + max[1],
				minY: validData.y + min[1],
			};
		}
		case ElementsEnum.Ellipse: {
			const validData = EllipseDataSchema.parse(data);
			const { x, y, radiusX, radiusY } = validData;
			const pivot = [x, y];
			const angle = (validData.rotation * Math.PI) / 180;
			let _ellipse = ellipse([x, y], [radiusX, radiusY]);
			_ellipse = translate(_ellipse, [-pivot[0], -pivot[1]]);
			let polygon = rotate(_ellipse, angle);
			polygon = translate(polygon, [pivot[0], pivot[1]]);
			const _bounds = bounds(polygon);
			const max = _bounds?.max();
			const min = _bounds?.min();

			if (max === undefined || min === undefined) return null;
			return {
				maxX: max[0],
				minX: min[0],
				maxY: max[1],
				minY: min[1],
			};
		}
		default:
			return null;
	}
}
