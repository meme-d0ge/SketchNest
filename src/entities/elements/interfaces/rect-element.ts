import type { BaseElement } from './base-element.ts';

export interface RectElement extends BaseElement {
	type: 'rect';
	data: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export type RectElementDraft = Omit<RectElement, 'id' | 'shapeBox'> & {
	id?: string;
};
