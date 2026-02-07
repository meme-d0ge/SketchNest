import type {ShapeBox} from "@/entities/elements/interfaces/shape-element.ts";

export interface BaseElement {
	type: 'line' | 'ellipse' | 'rect';
	id: string;
	isDeleted: boolean;
	opacity?: number;

	shapeBox: ShapeBox;
}
