import { makeAutoObservable, makeObservable, observable, toJS } from 'mobx';
import RBush from 'rbush';
import * as z from 'zod/v4';
import {
	type BoardElement,
	type BoardElementCreate,
	BoardElementCreateSchema,
	BoardElementSchema,
	type BoardElementUpdate,
	BoardElementUpdateSchema,
} from '@/entities/elements/interfaces/board-element';
import {
	type ShapeBox,
	ShapeBoxSchema,
} from '@/entities/elements/interfaces/shape-element.ts';
import { getBounds } from '@/entities/elements/lib/getBounds.ts';
import { REMOVE_ELEMENT_VERSION } from '@/entities/elements/model/statuses.ts';
import { applyPatch } from '@/shared/utils/applyPatch.ts';
import { getDiff } from '@/shared/utils/getDiff.ts';

const DiffPairSchema = z.object({
	previous: BoardElementUpdateSchema,
	current: BoardElementUpdateSchema,
});

const HistoryElementSchema = z.object({
	history: z.array(DiffPairSchema),
	version: z.number(),
	presentElement: BoardElementSchema,
});
type HistoryElement = z.infer<typeof HistoryElementSchema>;

export class ElementsStore {
	constructor() {
		makeAutoObservable(this);
	}
	elementIndexMap: Record<BoardElement['id'], number> = {};
	rtree: RBush<ShapeBox> = new RBush();

	elements: HistoryElement[] = [];
	historySteps: BoardElement['id'][][] = [];
	actualStep: number = -1;

	canRedo: boolean = false;
	canUndo: boolean = false;

	create = (elements: BoardElementCreate[]) => {
		if (this.actualStep + 1 < this.historySteps.length) {
			this.cleaningProcedure();
		}
		const modifiedElements: BoardElement['id'][] = [];
		for (const element of elements) {
			try {
				const validatedElement = BoardElementCreateSchema.parse(element);
				const bounds = getBounds(validatedElement.data, validatedElement.visualData.strokeWidth, validatedElement.type);
				if (bounds === null) {
					continue;
				}

				const id = crypto.randomUUID();
				const shapeBox = ShapeBoxSchema.parse({
					...bounds,
					ownerId: id,
				});
				const entireElement = BoardElementSchema.parse({
					...validatedElement,
					id: id,
					shapeBox: shapeBox,
				});

				const historyElement = makeObservable(
					HistoryElementSchema.parse({
						history: [],
						version: 0,
						presentElement: entireElement,
					}),
					{
						history: false,
						version: observable,
						presentElement: observable,
					},
				);
				modifiedElements.push(entireElement.id);
				this.elementIndexMap[entireElement.id] = this.elements.length;
				this.elements.push(historyElement);
				this.rtree.insert(historyElement.presentElement.shapeBox);
			} catch (err) {
				console.debug(err);
			}
		}
		if (modifiedElements.length > 0) {
			this.actualStep++;
			this.historySteps.push(modifiedElements);
			this.canUndo = this.actualStep >= 0;
			this.canRedo = false;
		}
	};
	update = (
		elements: { id: BoardElement['id']; element: BoardElementUpdate }[],
	) => {
		if (this.actualStep + 1 < this.historySteps.length) {
			this.cleaningProcedure();
		}
		const modifiedElements: BoardElement['id'][] = [];
		for (const item of elements) {
			try {
				const validatedElement = BoardElementUpdateSchema.parse(item.element);
				const index = this.elementIndexMap[item.id];

				const presentElement = this.elements[index].presentElement;
				const diff = getDiff<BoardElementUpdate>(
					presentElement,
					validatedElement,
				);

				this.rtree.remove(presentElement.shapeBox);
				if (diff.current.data !== undefined || diff.current.visualData !== undefined) {
					const newData = {
						...presentElement.data,
						...diff.current.data,
					};
					const newVisualData = {
						...presentElement.visualData,
						...diff.current.visualData
					}
					presentElement.shapeBox = ShapeBoxSchema.parse({
						...getBounds(newData, newVisualData.strokeWidth, presentElement.type),
						ownerId: presentElement.id,
					});
				}

				this.elements[index].presentElement = applyPatch<BoardElement>(
					presentElement,
					diff.current,
				);
				if (!this.elements[index].presentElement.isDeleted) {
					this.rtree.insert(this.elements[index].presentElement.shapeBox);
				}
				this.sliceFutureVersionByIndex(index);
				this.elements[index].history.push(diff);
				this.elements[index].version++;
				modifiedElements.push(item.id);
			} catch (err) {
				console.debug(err);
			}
		}
		if (modifiedElements.length > 0) {
			this.actualStep++;
			this.historySteps.push(modifiedElements);
			this.canUndo = this.actualStep >= 0;
			this.canRedo = false;
		}
	};
	undo = () => {
		if (!this.canUndo) {
			return;
		}
		const elementsId = this.historySteps[this.actualStep];
		for (const id of elementsId) {
			const element = this.getHistoryElement(id);
			if (element) {
				element.version--;
				this.rtree.remove(element.presentElement.shapeBox);
				if (element.version === REMOVE_ELEMENT_VERSION) {
					continue;
				}
				if (element.history[element.version]) {
					const previous = element.history[element.version].previous;
					if (previous.data !== undefined || previous.visualData !== undefined) {
						const newData = {
							...element.presentElement.data,
							...previous.data,
						};
						const newVisualData = {
							...element.presentElement.visualData,
							...previous.visualData
						}
						element.presentElement.shapeBox = ShapeBoxSchema.parse({
							...getBounds(newData, newVisualData.strokeWidth, element.presentElement.type),
							ownerId: element.presentElement.id,
						});
					}
					element.presentElement = applyPatch<BoardElement>(
						element.presentElement,
						previous,
					);
					if (!element.presentElement.isDeleted) {
						this.rtree.insert(element.presentElement.shapeBox);
					}
				}
			}
		}
		this.actualStep--;
		this.canRedo = true;
		this.canUndo = this.actualStep >= 0;
	};

	redo = () => {
		if (!this.canRedo) {
			return;
		}
		this.actualStep++;
		const elementsId = this.historySteps[this.actualStep];
		for (const id of elementsId) {
			const element = this.getHistoryElement(id);
			if (element) {
				if (element.version === REMOVE_ELEMENT_VERSION) {
					if (!element.presentElement.isDeleted) {
						this.rtree.insert(element.presentElement.shapeBox);
					}
				} else if (element.history[element.version]) {
					const current = element.history[element.version].current;
					this.rtree.remove(element.presentElement.shapeBox);
					if (current.data !== undefined || current.visualData !== undefined) {
						const newData = {
							...element.presentElement.data,
							...current.data,
						};
						const newVisualData = {
							...element.presentElement.visualData,
							...current.visualData
						}
						element.presentElement.shapeBox = ShapeBoxSchema.parse({
							...getBounds(newData, newVisualData.strokeWidth, element.presentElement.type),
							ownerId: element.presentElement.id,
						});
					}
					element.presentElement = applyPatch<BoardElement>(
						element.presentElement,
						current,
					);

					if (!element.presentElement.isDeleted) {
						this.rtree.insert(element.presentElement.shapeBox);
					}
				}
				element.version++;
			}
		}
		this.canUndo = true;
		this.canRedo = this.actualStep + 1 < this.historySteps.length;
	};

	private getHistoryElement = (id: string) => {
		if (id in this.elementIndexMap) {
			return this.elements[this.elementIndexMap[id]];
		}
		return undefined;
	};
	private sliceFutureVersionByIndex = (index: number) => {
		this.elements[index].history.splice(this.elements[index].version + 1);
	};
	private cleaningProcedure = () => {
		let leftP = 0;
		for (let rightP = 0; rightP < this.elements.length; rightP++) {
			const rightElement = this.elements[rightP];
			if (rightElement.version === REMOVE_ELEMENT_VERSION) {
				delete this.elementIndexMap[rightElement.presentElement.id];
				continue;
			}
			this.elements[leftP] = rightElement;
			this.elementIndexMap[rightElement.presentElement.id] = leftP;
			leftP++;
		}
		this.elements.splice(leftP);
		this.historySteps.splice(this.actualStep + 1);
	};

	getCopyPresentElement = (id: BoardElement['id']) => {
		if (id in this.elementIndexMap) {
			const index = this.elementIndexMap[id];
			return toJS(this.elements[index].presentElement);
		}
		return undefined;
	};
	hasId = (id: BoardElement['id']) => {
		return id in this.elementIndexMap;
	};
}
