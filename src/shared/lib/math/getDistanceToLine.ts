import type {Vector2d} from "konva/lib/types";
import {bounds, polyline, rotate, translate} from "@thi.ng/geom";
import {asSDF} from "@thi.ng/geom-sdf";
export function getDistanceToLine (point: Vector2d, data: {
        x: number;
        y: number;
        points: number[],
        rotation: number,
    }) {
    if (data.points.length < 2 || data.points.length % 2 !== 0) return NaN;
    const newArrPoints = []
    for (let i = 0; i < data.points.length; i = i + 2) {
        newArrPoints.push([data.x + data.points[i], data.y + data.points[i+1]])
    }
    const angle = (data.rotation * Math.PI) / 180;
    let _polyline = polyline(newArrPoints);
    let _bounds = bounds(_polyline)
    let min = _bounds?.min()
    let max = _bounds?.max()
    if (max === undefined || min === undefined) return NaN;
    const localBounds = {
        minX: min[0],
        maxX: max[0],
        minY: min[1],
        maxY: max[1]
    }
    const pivot = [data.x + (localBounds.minX + localBounds.maxX) / 2, data.y + (localBounds.minY + localBounds.maxY) / 2];

    _polyline = translate(_polyline, [-pivot[0], -pivot[1]])
    const polygon = rotate(_polyline, angle)
    _polyline = translate(polygon, [pivot[0], pivot[1]])

    const dist = asSDF(_polyline)([point.x, point.y])
    return dist
}