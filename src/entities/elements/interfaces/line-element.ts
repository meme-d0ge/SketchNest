import type { BaseElement } from './base-element.ts';

export interface LineElement extends BaseElement {
	type: 'line';
	data: {
		points: number[];
	};
}
export type LineElementDraft = Omit<LineElement, 'id' | 'shapeBox'> & { id?: string };
