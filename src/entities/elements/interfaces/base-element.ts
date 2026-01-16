export interface BaseElement {
	type: 'line' | 'ellipse' | 'rect';
	id: string;
	isDeleted: boolean;
	opacity?: number;
}
