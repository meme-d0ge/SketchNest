import type { BaseElement } from '@/entities/elements/interfaces/base-element.ts';

export interface LineElement extends BaseElement {
	type: 'line';
	data: {
		points: number[];
	};
}
