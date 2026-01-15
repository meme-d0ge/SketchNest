import type { BaseElement } from '@/entities/elements/interfaces/base-element.ts';

export interface CircleElement extends BaseElement {
	type: 'circle';
	data: {
		x: number;
		radiusX: number;
		y: number;
		radiusY: number;
	};
}

export type CircleElementOptionId = Omit<CircleElement, 'id'> & { id?: string };
