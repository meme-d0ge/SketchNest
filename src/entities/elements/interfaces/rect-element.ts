import type { BaseElement } from './base-element.ts';
import type {BaseGeometryProps} from "@/entities/elements/interfaces/base-geometry-props.ts";

interface RectData extends BaseGeometryProps {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RectElement extends BaseElement {
	type: 'rect';
	data: RectData;
}

export type RectElementDraft = Omit<RectElement, 'id' | 'shapeBox'> & {
	id?: string;
};
