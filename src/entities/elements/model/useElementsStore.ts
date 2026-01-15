import { create } from 'zustand';
import type { BoardElement, BoardElementOptionalId } from '@/entities/elements';

interface IElement {
	history: BoardElement[];
	version: number;
}
interface IElementsStoreState {
	elements: IElement[];
	historySteps: Array<number[]>;
	actualStep: number;
	add: (elements: BoardElementOptionalId[]) => void;
	undo: () => void;
	canUndo: boolean;
	redo: () => void;
	canRedo: boolean;
}

export const useElementsStore = create<IElementsStoreState>((set) => ({
	elements: [],
	historySteps: [],
	actualStep: -1,
	canUndo: false,
	canRedo: false,
	add: (elements: BoardElementOptionalId[]) =>
		set((state) => {
			const newActualStep = state.actualStep + 1;
			const newHistorySteps = state.historySteps.slice(0, newActualStep);
			const newElementsArray = [...state.elements];
			const arrayModElements: number[] = [];
			for (const element of elements) {
				if (element.id === undefined) {
					arrayModElements.push(newElementsArray.length);
					newElementsArray.push({
						history: [
							{
								...element,
								id: String(newElementsArray.length),
							} as BoardElement,
						],
						version: 0,
					});
				} else {
					const index = Number(element.id);
					arrayModElements.push(index);
					newElementsArray[index] = {
						history: [
							...newElementsArray[index].history.slice(
								0,
								newElementsArray[index].version + 1,
							),
							{ ...element, id: String(index) } as BoardElement,
						],
						version: newElementsArray[index].version + 1,
					};
				}
			}
			return {
				elements: newElementsArray,
				historySteps: [...newHistorySteps, arrayModElements],
				actualStep: newActualStep,
				canUndo: newActualStep >= 0,
				canRedo: false,
			};
		}),
	undo: () =>
		set((state) => {
			if (state.canUndo) {
				const indexOfModifiedElements = state.historySteps[state.actualStep];
				const newElementsArray = [...state.elements];
				for (const index of indexOfModifiedElements) {
					newElementsArray[index] = {
						history: newElementsArray[index].history,
						version: newElementsArray[index].version - 1,
					};
				}
				const newActualStep = state.actualStep - 1;
				return {
					elements: [...newElementsArray],
					actualStep: newActualStep,
					canUndo: newActualStep >= 0,
					canRedo: true,
				};
			}
			return {};
		}),
	redo: () =>
		set((state) => {
			if (state.canRedo) {
				const newActualStep = state.actualStep + 1;
				const indexOfModifiedElements = state.historySteps[newActualStep];
				const newElementsArray = [...state.elements];
				for (const index of indexOfModifiedElements) {
					newElementsArray[index] = {
						history: newElementsArray[index].history,
						version: newElementsArray[index].version + 1,
					};
				}
				return {
					elements: [...newElementsArray],
					actualStep: newActualStep,
					canUndo: true,
					canRedo: newActualStep + 1 < state.historySteps.length,
				};
			}
			return {};
		}),
}));
