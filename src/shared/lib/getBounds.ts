import {
	bounds,
	ellipse,
	polyline,
	rect,
	rotate,
	translate,
} from '@thi.ng/geom';
import type { BoardElementDraft } from '@/entities/elements';
import {ElementsEnum} from "@/entities/elements/interfaces/element-type-variant.ts";

export function getBounds(item: BoardElementDraft) {
	switch (item.type) {
		case ElementsEnum.Rect: {
			const { x, y, width, height } = item.data;
			const pivot = [x + width / 2, y + height / 2];
			const angle = (item.data.rotation * Math.PI) / 180;
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
			if (item.data.points.length < 2 || item.data.points.length % 2 !== 0)
				return null;
			const newArrPoints = [];
			for (let i = 0; i < item.data.points.length; i = i + 2) {
				newArrPoints.push([
					item.data.x + item.data.points[i],
					item.data.y + item.data.points[i + 1],
				]);
			}
			const angle = (item.data.rotation * Math.PI) / 180;
			let _polyline = polyline(newArrPoints);
			let _bounds = bounds(_polyline);
			let min = _bounds?.min();
			let max = _bounds?.max();
			if (max === undefined || min === undefined) return null;
			const localBounds = {
				minX: min[0],
				maxX: max[0],
				minY: min[1],
				maxY: max[1],
			};
			const pivot = [
				item.data.x + (localBounds.minX + localBounds.maxX) / 2,
				item.data.y + (localBounds.minY + localBounds.maxY) / 2,
			];

			_polyline = translate(_polyline, [-pivot[0], -pivot[1]]);
			const polygon = rotate(_polyline, angle);
			_polyline = translate(polygon, [pivot[0], pivot[1]]);

			_bounds = bounds(_polyline);
			max = _bounds?.max();
			min = _bounds?.min();

			if (max === undefined || min === undefined) return null;
			return {
				maxX: max[0],
				minX: min[0],
				maxY: max[1],
				minY: min[1],
			};
		}
		case ElementsEnum.Ellipse: {
			const { x, y, radiusX, radiusY } = item.data;
			const pivot = [x, y];
			const angle = (item.data.rotation * Math.PI) / 180;
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
