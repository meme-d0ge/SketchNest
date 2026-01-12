import type { BaseElement } from '@/entities/elements/interfaces/base-element.ts';

export interface SquareElement extends BaseElement {
	type: 'square';
	data: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}
