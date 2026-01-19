import { makeAutoObservable } from 'mobx';
import type { BoardElement, BoardElementOptionalId } from '@/entities/elements';

interface IElement {
	history: BoardElement[];
	version: number;
}

export class ElementsStore {
	constructor() {
		makeAutoObservable(this);
	}
	elements: IElement[] = [];
	historySteps: number[][] = [];
	actualStep: number = -1;
	canRedo: boolean = false;
	canUndo: boolean = false;

	add = (elements: BoardElementOptionalId[]) => {
		this.actualStep = this.actualStep + 1;
		this.historySteps = this.historySteps.slice(0, this.actualStep);
		const arrayModElements: number[] = [];
		for (const element of elements) {
			if (element.id === undefined) {
				arrayModElements.push(this.elements.length);
				this.elements.push({
					history: [
						{
							...element,
							id: String(this.elements.length),
						} as BoardElement,
					],
					version: 0,
				});
			} else {
				const index = Number(element.id);
				arrayModElements.push(index);
				this.elements[index].history = this.elements[index].history.slice(
					0,
					this.elements[index].version + 1,
				);
				this.elements[index].history.push({
					...element,
					id: String(index),
				} as BoardElement);
				this.elements[index].version = this.elements[index].version + 1;
			}
		}
		this.historySteps.push(arrayModElements);
		this.canUndo = this.actualStep >= 0;
		this.canRedo = false;
	};
	undo = () => {
		if (!this.canUndo) {
			return;
		}
		const indexOfModifiedElements = this.historySteps[this.actualStep];
		for (const index of indexOfModifiedElements) {
			this.elements[index].version = this.elements[index].version - 1;
		}
		this.actualStep = this.actualStep - 1;
		this.canRedo = true;
		this.canUndo = this.actualStep >= 0;
	};
	redo = () => {
		if (!this.canRedo) {
			return;
		}
		this.actualStep = this.actualStep + 1;
		const indexOfModifiedElements = this.historySteps[this.actualStep];
		for (const index of indexOfModifiedElements) {
			this.elements[index].version = this.elements[index].version + 1;
		}
		this.canUndo = true;
		this.canRedo = this.actualStep + 1 < this.historySteps.length;
	};
}
