import { create } from 'zustand';
import type { BoardElement } from '@/entities/elements';

interface IElement {
	history: BoardElement[];
	version: number;
}
interface IElementsStoreState {
	elements: IElement[];
	historySteps: number[];
	actualStep: number;
	add: (element: BoardElement, index?: number) => void;
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
	add: (element: BoardElement, index?: number) =>
		set((state) => {
			if (index === undefined) {
				const newActualStep = state.actualStep + 1;
				const newHistorySteps = state.historySteps.slice(0, newActualStep);
				const newElementsArray = [
					...state.elements,
					{ history: [element], version: 0 },
				];
				return {
					elements: newElementsArray,
					historySteps: [...newHistorySteps, newElementsArray.length - 1],
					actualStep: newActualStep,
					canUndo: newActualStep >= 0,
					canRedo: false,
				};
			} else {
				const newActualStep = state.actualStep + 1;
				const newHistorySteps = state.historySteps.slice(0, newActualStep);
				const newElementsArray = [...state.elements];
				newElementsArray[index] = {
					history: [
						...newElementsArray[index].history.slice(
							0,
							newElementsArray[index].version + 1,
						),
						element,
					],
					version: newElementsArray[index].version + 1,
				};
				return {
					elements: newElementsArray,
					historySteps: [...newHistorySteps, index],
					actualStep: newActualStep,
					canUndo: newActualStep >= 0,
					canRedo: false,
				};
			}
		}),
	undo: () =>
		set((state) => {
			if (state.canUndo) {
				const element_index = state.historySteps[state.actualStep];
				const newElementsArray = [...state.elements];
				newElementsArray[element_index] = {
					history: newElementsArray[element_index].history,
					version: newElementsArray[element_index].version - 1,
				};
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
				const element_index = state.historySteps[newActualStep];
				const newElementsArray = [...state.elements];
				newElementsArray[element_index] = {
					history: newElementsArray[element_index].history,
					version: newElementsArray[element_index].version + 1,
				};
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
