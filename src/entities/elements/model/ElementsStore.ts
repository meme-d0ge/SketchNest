import { makeAutoObservable, makeObservable, observable, toJS } from 'mobx';
import RBush from 'rbush';
import * as z from 'zod/v4';
import type { Bounds } from '@/entities/elements';
import {
	type BoardElement,
	type BoardElementCreate,
	BoardElementCreateSchema,
	BoardElementSchema,
	type BoardElementUpdate,
	BoardElementUpdateSchema,
} from '@/entities/elements/interfaces/board-element';
import { BoundsSchema } from '@/entities/elements/interfaces/bounds.ts';
import {
	type ShapeBox,
	ShapeBoxSchema,
} from '@/entities/elements/interfaces/shape-element.ts';
import { getBounds } from '@/entities/elements/lib/getBounds.ts';
import { PRE_CREATION_VERSION } from '@/entities/elements/model/statuses.ts';
import type { DeepReadonly } from '@/shared/types/deepReadonly.ts';
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
	private elementIndexMap: Record<BoardElement['id'], number> = {};
	private rtree: RBush<ShapeBox> = new RBush();

	private elements: HistoryElement[] = [];
	private historySteps: BoardElement['id'][][] = [];
	private actualStep: number = -1;

	get canUndo() {
		return this.actualStep >= 0;
	}
	get canRedo() {
		return this.actualStep + 1 < this.historySteps.length;
	}
	get visibleElements(): DeepReadonly<BoardElement>[] {
		const visibleElements = [];
		for (const elementHistory of this.elements) {
			if (
				!elementHistory.presentElement.isDeleted &&
				elementHistory.version !== PRE_CREATION_VERSION
			) {
				visibleElements.push(elementHistory.presentElement);
			}
		}
		return visibleElements;
	}

	create = (elements: BoardElementCreate[]) => {
		if (this.actualStep + 1 < this.historySteps.length) {
			this.pruneFutureSteps();
		}
		const modifiedElements: BoardElement['id'][] = [];
		for (const element of elements) {
			try {
				const validatedElement = BoardElementCreateSchema.parse(element);
				const bounds = getBounds(
					validatedElement.data,
					validatedElement.visualData.strokeWidth,
					validatedElement.type,
				);
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

				const elementHistory = this.buildHistoryElement(entireElement);
				modifiedElements.push(entireElement.id);
				this.elementIndexMap[entireElement.id] = this.elements.length;
				this.elements.push(elementHistory);
				this.rtree.insert(elementHistory.presentElement.shapeBox);
			} catch (err) {
				console.debug(err);
			}
		}
		if (modifiedElements.length > 0) {
			this.actualStep++;
			this.historySteps.push(modifiedElements);
		}
	};
	update = (
		elements: { id: BoardElement['id']; element: BoardElementUpdate }[],
	) => {
		if (this.actualStep + 1 < this.historySteps.length) {
			this.pruneFutureSteps();
		}
		const modifiedElements: BoardElement['id'][] = [];
		for (const updateEntry of elements) {
			try {
				const validatedElement = BoardElementUpdateSchema.parse(
					updateEntry.element,
				);
				const elementHistory = this.resolveHistoryElement(updateEntry.id);
				if (elementHistory === undefined) {
					continue;
				}

				const diff = getDiff<BoardElementUpdate>(
					elementHistory.presentElement,
					validatedElement,
				);

				this.rtree.remove(elementHistory.presentElement.shapeBox);
				if (
					diff.current.data !== undefined ||
					diff.current.visualData !== undefined
				) {
					const shapeBox = this.recalculateShapeBox(
						elementHistory.presentElement,
						validatedElement,
					);
					if (shapeBox) {
						elementHistory.presentElement.shapeBox = shapeBox;
					}
				}

				elementHistory.presentElement = applyPatch<BoardElement>(
					elementHistory.presentElement,
					diff.current,
				);
				if (!elementHistory.presentElement.isDeleted) {
					this.rtree.insert(elementHistory.presentElement.shapeBox);
				}
				this.truncateElementHistory(elementHistory);
				elementHistory.history.push(diff);
				elementHistory.version++;
				modifiedElements.push(updateEntry.id);
			} catch (err) {
				console.debug(err);
			}
		}
		if (modifiedElements.length > 0) {
			this.actualStep++;
			this.historySteps.push(modifiedElements);
		}
	};
	undo = () => {
		if (!this.canUndo) {
			return;
		}
		const elementIds = this.historySteps[this.actualStep];
		for (const id of elementIds) {
			const elementHistory = this.resolveHistoryElement(id);
			if (elementHistory) {
				elementHistory.version--;
				this.rtree.remove(elementHistory.presentElement.shapeBox);
				if (elementHistory.version === PRE_CREATION_VERSION) {
					continue;
				}
				if (elementHistory.history[elementHistory.version]) {
					const previous =
						elementHistory.history[elementHistory.version].previous;
					if (
						previous.data !== undefined ||
						previous.visualData !== undefined
					) {
						const shapeBox = this.recalculateShapeBox(
							elementHistory.presentElement,
							previous,
						);
						if (shapeBox) {
							elementHistory.presentElement.shapeBox = shapeBox;
						}
					}
					elementHistory.presentElement = applyPatch<BoardElement>(
						elementHistory.presentElement,
						previous,
					);
					if (!elementHistory.presentElement.isDeleted) {
						this.rtree.insert(elementHistory.presentElement.shapeBox);
					}
				}
			}
		}
		this.actualStep--;
	};
	redo = () => {
		if (!this.canRedo) {
			return;
		}
		this.actualStep++;
		const elementIds = this.historySteps[this.actualStep];
		for (const id of elementIds) {
			const elementHistory = this.resolveHistoryElement(id);
			if (elementHistory) {
				if (elementHistory.version === PRE_CREATION_VERSION) {
					if (!elementHistory.presentElement.isDeleted) {
						this.rtree.insert(elementHistory.presentElement.shapeBox);
					}
				} else if (elementHistory.history[elementHistory.version]) {
					const current =
						elementHistory.history[elementHistory.version].current;
					this.rtree.remove(elementHistory.presentElement.shapeBox);
					if (current.data !== undefined || current.visualData !== undefined) {
						const shapeBox = this.recalculateShapeBox(
							elementHistory.presentElement,
							current,
						);
						if (shapeBox) {
							elementHistory.presentElement.shapeBox = shapeBox;
						}
					}
					elementHistory.presentElement = applyPatch<BoardElement>(
						elementHistory.presentElement,
						current,
					);

					if (!elementHistory.presentElement.isDeleted) {
						this.rtree.insert(elementHistory.presentElement.shapeBox);
					}
				}
				elementHistory.version++;
			}
		}
	};

	has = (id: BoardElement['id']) => {
		return id in this.elementIndexMap;
	};
	getElement = (
		id: BoardElement['id'],
	): DeepReadonly<BoardElement> | undefined => {
		if (id in this.elementIndexMap) {
			return this.elements[this.elementIndexMap[id]].presentElement;
		}
		return undefined;
	};
	getElementSnapshot = (id: BoardElement['id']): BoardElement | undefined => {
		if (id in this.elementIndexMap) {
			const index = this.elementIndexMap[id];
			return toJS(this.elements[index].presentElement);
		}
		return undefined;
	};
	searchByBounds = (bounds: Bounds): DeepReadonly<BoardElement>[] => {
		try {
			const validBounds = BoundsSchema.parse(bounds);
			const shapeBoxes = this.rtree.search(validBounds);
			const elements = [];
			for (const box of shapeBoxes) {
				const element = this.getElement(box.ownerId);
				if (element !== undefined) {
					elements.push(element);
				}
			}
			return elements;
		} catch (err) {
			console.debug(err);
			return [];
		}
	};

	private buildHistoryElement = (element: BoardElement) => {
		return makeObservable(
			HistoryElementSchema.parse({
				history: [],
				version: 0,
				presentElement: element,
			}),
			{
				history: false,
				version: observable,
				presentElement: observable,
			},
		);
	};
	private recalculateShapeBox = (
		element: BoardElement,
		patch: DeepReadonly<BoardElementUpdate>,
	): ShapeBox | null => {
		const newData = {
			...element.data,
			...patch.data,
		};
		const newVisualData = {
			...element.visualData,
			...patch.visualData,
		};
		const result = ShapeBoxSchema.safeParse({
			...getBounds(newData, newVisualData.strokeWidth, element.type),
			ownerId: element.id,
		});
		if (result.success) {
			return result.data;
		}
		return null;
	};
	private resolveHistoryElement = (id: string) => {
		if (id in this.elementIndexMap) {
			return this.elements[this.elementIndexMap[id]];
		}
		return undefined;
	};
	private truncateElementHistory = (elementHistory: HistoryElement) => {
		elementHistory.history.splice(elementHistory.version);
	};
	private pruneFutureSteps = () => {
		let leftP = 0;
		for (let rightP = 0; rightP < this.elements.length; rightP++) {
			const elementHistory = this.elements[rightP];
			if (elementHistory.version === PRE_CREATION_VERSION) {
				delete this.elementIndexMap[elementHistory.presentElement.id];
				continue;
			}
			this.elements[leftP] = elementHistory;
			this.elementIndexMap[elementHistory.presentElement.id] = leftP;
			leftP++;
		}
		this.elements.splice(leftP);
		this.historySteps.splice(this.actualStep + 1);
	};
}
