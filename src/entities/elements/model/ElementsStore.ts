import {makeAutoObservable, toJS} from 'mobx';
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
	elementIndexMap:Record<string, number> = {}
	historySteps: string[][] = [];
	actualStep: number = -1;
	canRedo: boolean = false;
	canUndo: boolean = false;

	add = (elements: BoardElementOptionalId[]) => {
		this.actualStep = this.actualStep + 1;
		this.historySteps = this.historySteps.slice(0, this.actualStep);
		const arrayModElements: string[] = [];
		for (const element of elements) {
			if (element.id === undefined) {
				const newId = crypto.randomUUID()
				this.elementIndexMap[newId] = this.elements.length
				arrayModElements.push(newId);
				this.elements.push({
					history: [
						{
							...element,
							id: newId,
						} as BoardElement,
					],
					version: 0,
				});
			} else {
				const index = this.elementIndexMap[element.id];
				arrayModElements.push(element.id);
				this.elements[index].history = this.elements[index].history.slice(
					0,
					this.elements[index].version + 1,
				);
				this.elements[index].history.push({
					...element,
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
		const idOfModifiedElements = this.historySteps[this.actualStep];
		for (const id of idOfModifiedElements) {
			const index = this.elementIndexMap[id]
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
		const idOfModifiedElements = this.historySteps[this.actualStep];
		for (const id of idOfModifiedElements) {
			const index = this.elementIndexMap[id]
			this.elements[index].version = this.elements[index].version + 1;
		}
		this.canUndo = true;
		this.canRedo = this.actualStep + 1 < this.historySteps.length;
	};

	getLatestVersion = (id: string) => {
		const index = this.elementIndexMap[id]
		const element = this.elements[index]
		const version = element.version
		return toJS(element.history[version]);
	}
}
