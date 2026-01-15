import { create } from 'zustand';
import type { BoardElement } from '@/entities/elements';

interface IHistoryElement {
	history: BoardElement[];
	version: number;
}
interface IHistoryState {
	history: IHistoryElement[];
	historySteps: number[];
	version: number;
	add: (element: BoardElement, index?: number) => void;
	undo: () => void;
	canUndo: boolean;
	redo: () => void;
	canRedo: boolean;
}

export const useHistoryStore = create<IHistoryState>((set) => ({
	history: [],
	historySteps: [],
	version: -1,
	canUndo: false,
	canRedo: false,
	add: (element: BoardElement, index?: number) =>
		set((state) => {
			if (index === undefined) {
				const newVersion = state.version + 1;
				const newHistorySteps = state.historySteps.slice(0, newVersion);
				const newHistory = [
					...state.history,
					{ history: [element], version: 0 },
				];
				return {
					history: newHistory,
					historySteps: [...newHistorySteps, newHistory.length - 1],
					version: newVersion,
					canUndo: newVersion >= 0,
					// canRedo: newVersion + 1 < newHistorySteps.length,
					canRedo: false,
				};
			} else {
				const newVersion = state.version + 1;
				const newHistorySteps = state.historySteps.slice(0, newVersion);
				const newHistory = [...state.history];
				newHistory[index] = {
					history: [
						...newHistory[index].history.slice(
							0,
							newHistory[index].version + 1,
						),
						element,
					],
					version: newHistory[index].version + 1,
				};
				return {
					history: newHistory,
					historySteps: [...newHistorySteps, index],
					version: newVersion,
					canUndo: newVersion >= 0,
					// canRedo: newVersion + 1 < newHistorySteps.length,
					canRedo: false,
				};
			}
		}),
	undo: () =>
		set((state) => {
			if (state.canUndo) {
				const element_index = state.historySteps[state.version];
				const newHistory = [...state.history];
				newHistory[element_index] = {
					history: newHistory[element_index].history,
					version: newHistory[element_index].version - 1,
				};
				const newVersion = state.version - 1;
				return {
					history: [...newHistory],
					version: newVersion,
					canUndo: newVersion >= 0,
					// canRedo: newVersion + 1 < state.historySteps.length,
					canRedo: true,
				};
			}
			return {};
		}),
	redo: () =>
		set((state) => {
			if (state.canRedo) {
				const newVersion = state.version + 1;
				const element_index = state.historySteps[newVersion];
				const newHistory = [...state.history];
				newHistory[element_index] = {
					history: newHistory[element_index].history,
					version: newHistory[element_index].version + 1,
				};
				return {
					history: [...newHistory],
					version: newVersion,
					// canUndo: newVersion - 1 >= 0,
					canUndo: true,
					canRedo: newVersion + 1 < state.historySteps.length,
				};
			}
			return {};
		}),
}));
