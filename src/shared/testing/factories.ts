import type { BoardElementCreate } from '@/entities/elements/interfaces/board-element.ts';
import { ElementsEnum } from '@/entities/elements/interfaces/element-type-variant.ts';
import type {
	EllipseData,
	EllipseVisualData,
} from '@/entities/elements/interfaces/ellipse-element.ts';
import type {
	LineData,
	LineVisualData,
} from '@/entities/elements/interfaces/line-element.ts';
import type {
	RectData,
	RectVisualData,
} from '@/entities/elements/interfaces/rect-element.ts';

// Minimal valid factories for building `create*` payloads in tests.
// Defaults always parse; pass partial overrides to exercise edge cases.

export function createRect(
	data?: Partial<RectData>,
	visualData?: Partial<RectVisualData>,
): BoardElementCreate {
	return {
		type: ElementsEnum.Rect,
		isDeleted: false,
		data: { rotation: 0, x: 0, y: 0, width: 10, height: 10, ...data },
		visualData: {
			opacity: 1,
			strokeWidth: 2,
			stroke: 'red',
			fill: '',
			...visualData,
		},
	};
}

export function createEllipse(
	data?: Partial<EllipseData>,
	visualData?: Partial<EllipseVisualData>,
): BoardElementCreate {
	return {
		type: ElementsEnum.Ellipse,
		isDeleted: false,
		data: { rotation: 0, x: 0, y: 0, radiusX: 5, radiusY: 5, ...data },
		visualData: {
			opacity: 1,
			strokeWidth: 2,
			stroke: 'red',
			fill: '',
			...visualData,
		},
	};
}

export function createLine(
	data?: Partial<LineData>,
	visualData?: Partial<LineVisualData>,
): BoardElementCreate {
	return {
		type: ElementsEnum.Line,
		isDeleted: false,
		data: {
			rotation: 0,
			x: 0,
			y: 0,
			points: [0, 0, 100, 0],
			centerX: 0,
			centerY: 0,
			...data,
		},
		visualData: {
			opacity: 1,
			strokeWidth: 2,
			stroke: 'red',
			fill: '',
			...visualData,
		},
	};
}
