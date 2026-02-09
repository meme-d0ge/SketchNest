import type { BaseGeometryProps } from '@/entities/elements/interfaces/base-geometry-props.ts';
import type { BaseElement } from './base-element.ts';

interface LineData extends BaseGeometryProps {
	x: number;
	y: number;
	points: number[];
}

export interface LineElement extends BaseElement {
	type: 'line';
	data: LineData;
}
export type LineElementDraft = Omit<LineElement, 'id' | 'shapeBox'> & {
	id?: string;
};
