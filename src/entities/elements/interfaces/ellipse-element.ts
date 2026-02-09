import type { BaseGeometryProps } from '@/entities/elements/interfaces/base-geometry-props.ts';
import type { BaseElement } from './base-element.ts';

interface EllipseData extends BaseGeometryProps {
	x: number;
	radiusX: number;
	y: number;
	radiusY: number;
}

export interface EllipseElement extends BaseElement {
	type: 'ellipse';
	data: EllipseData;
}

export type EllipseElementDraft = Omit<EllipseElement, 'id' | 'shapeBox'> & {
	id?: string;
};
