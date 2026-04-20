import { makeAutoObservable } from 'mobx';

export class PropertiesStore {
	constructor() {
		makeAutoObservable(this);
	}
	stroke = 'red';
	opacity = 1;
	strokeWidth = 4;
	fill = '';

	setStroke = (stroke: string) => {
		this.stroke = stroke;
	};
	setOpacity = (opacity: number) => {
		this.opacity = opacity;
	};
	setStrokeWidth = (strokeWidth: number) => {
		this.strokeWidth = strokeWidth;
	};
	setFill = (fill: string) => {
		this.fill = fill;
	};
}
