import {makeAutoObservable, makeObservable, toJS} from 'mobx';
import RBush from 'rbush';
import * as z from 'zod/v4';
import {
	type BoardElement,
	type BoardElementDraft,
	BoardElementSchema,
} from '@/entities/elements';
import type { ShapeBox } from '@/entities/elements/interfaces/shape-element.ts';
import { getBounds } from '@/shared/lib/getBounds.ts';

const ElementSchema = z.object({
	history: z.array(BoardElementSchema),
	version: z.number(),
});
type Element = z.infer<typeof ElementSchema>;

export class ElementsStore {
	constructor() {
		makeAutoObservable(this);
	}
	elementIndexMap: Record<BoardElement['id'], number> = {};
	rtree: RBush<ShapeBox> = new RBush();

	elements: Element[] = [];
	historySteps: BoardElement['id'][][] = [];
	actualStep: number = -1;
	canRedo: boolean = false;
	canUndo: boolean = false;

	add = (elements: BoardElementDraft[]) => {
		this.actualStep = this.actualStep + 1;
		this.historySteps = this.historySteps.slice(0, this.actualStep);
		const arrayModElements: string[] = [];
		for (const element of elements) {
			if (element.id === undefined) {
				const newId = crypto.randomUUID();
				const bounds = getBounds(element);
				if (bounds === null) {
					continue;
				}

				this.elementIndexMap[newId] = this.elements.length;
				const newBoardElement = makeObservable({
					...element,
					id: newId,
					shapeBox: {
						...bounds,
						ownerId: newId,
					},
				} as BoardElement);

				this.elements.push({
					history: [newBoardElement],
					version: 0,
				});
				this.rtree.insert(newBoardElement.shapeBox);
				arrayModElements.push(newId);
			} else {
				const index = this.elementIndexMap[element.id];
				const bounds = getBounds(element);
				if (bounds === null) {
					continue;
				}

				this.sliceFutureVersionByIndex(index)
				const actualElement = this.getActualElementByIndex(index)
				this.rtree.remove(actualElement.shapeBox);
				const newBoardElement = makeObservable({
					...element,
					shapeBox: {
						...bounds,
						ownerId: actualElement.id,
					},
				} as BoardElement);
				this.pushNewElement(index, newBoardElement)
				this.incrementVersion(index)

				if (!newBoardElement.isDeleted) {
					this.rtree.insert(newBoardElement.shapeBox);
				}
				arrayModElements.push(element.id);
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
			const index = this.elementIndexMap[id];

			const lastElement = this.getActualElementByIndex(index)
			this.rtree.remove(lastElement.shapeBox);
			this.decrementVersion(index)

			if (
				this.elements[index].version !== -1 &&
				!this.elements[index].history[this.elements[index].version].isDeleted
			) {
				const prevElement = this.getActualElementByIndex(index);
				this.rtree.insert(prevElement.shapeBox);
			}
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
			const index = this.elementIndexMap[id];
			if (this.elements[index].version !== -1) {
				const actualElement = this.getActualElementByIndex(index)
				this.rtree.remove(actualElement.shapeBox);
			}
			this.incrementVersion(index)
			if (
				!this.elements[index].history[this.elements[index].version].isDeleted
			) {
				this.rtree.insert(
					this.getActualElementByIndex(index).shapeBox,
				);
			}
		}
		this.canUndo = true;
		this.canRedo = this.actualStep + 1 < this.historySteps.length;
	};

	getActualVersion = (id: string) => {
		const index = this.elementIndexMap[id];
		const element = this.elements[index];
		const version = element.version;
		return toJS(element.history[version]);
	};

	private getActualElementByIndex = (index: number) => {
		const element = this.elements[index];
		const version = element.version;
		return element.history[version];
	}

	private sliceFutureVersionByIndex = (index: number) => {
		this.elements[index].history = this.elements[index].history.slice(
			0,
			this.elements[index].version + 1,
		);
	}

	private pushNewElement = (index: number, element: BoardElement) => {
		this.elements[index].history.push(element);
	}

	private incrementVersion = (index: number) => {
		this.elements[index].version = this.elements[index].version + 1;
	}

	private decrementVersion = (index: number) => {
		this.elements[index].version = this.elements[index].version - 1;
	}

}
