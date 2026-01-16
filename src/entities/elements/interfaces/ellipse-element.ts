import type { BaseElement } from './base-element.ts';

export interface EllipseElement extends BaseElement {
	type: 'ellipse';
	data: {
		x: number;
		radiusX: number;
		y: number;
		radiusY: number;
	};
}

export type EllipseElementOptionId = Omit<EllipseElement, 'id'> & {
	id?: string;
};
