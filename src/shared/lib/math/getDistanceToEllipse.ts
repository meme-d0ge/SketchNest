import type {Vector2d} from "konva/lib/types";
import {ellipse, rotate, translate} from "@thi.ng/geom";
import {asSDF} from "@thi.ng/geom-sdf";

export function getDistanceToEllipse (point: Vector2d, data: {
    x: number;
    radiusX: number;
    y: number;
    radiusY: number;
    rotation: number;
}) {

    const angle = (data.rotation * Math.PI) / 180;
    const pivot = [data.x, data.y]
    let _ellipse = ellipse([data.x, data.y], [data.radiusX, data.radiusY]);
    _ellipse = translate(_ellipse, [-pivot[0], -pivot[1]])
    let polygon = rotate(_ellipse, angle);
    polygon = translate(polygon, [pivot[0], pivot[1]])
    const dist = asSDF(polygon)([point.x, point.y])
    return dist
}