import type {BoardElementOptionalId} from "@/entities/elements";

export function getBounds(item: BoardElementOptionalId) {
    switch (item.type) {
        case 'rect': {
            const { x, y, width, height } = item.data;
            return {
                minX: Math.min(x, x + width),
                maxX: Math.max(x, x + width),
                minY: Math.min(y, y + height),
                maxY: Math.max(y, y + height),
            };
        }
        case 'line': {
            const pts = item.data.points;
            if (pts.length < 2) return null;

            let minX = pts[0], maxX = pts[0];
            let minY = pts[1], maxY = pts[1];

            for (let i = 0; i < pts.length; i += 2) {
                const x = pts[i];
                const y = pts[i + 1];

                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y !== undefined) {
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
            return { minX, maxX, minY, maxY };
        }
        case "ellipse": {
            const { x, y, radiusX, radiusY } = item.data;
            return {
                minX: x - radiusX,
                maxX: x + radiusX,
                minY: y - radiusY,
                maxY: y + radiusY,
            };
        }
        default:
            return null;
    }
}