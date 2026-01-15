export interface BaseElement {
	type: 'line' | 'circle' | 'square';
	id: string;
	isDeleted: boolean;
	opacity?: number;
}
