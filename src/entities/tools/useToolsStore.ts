import { create } from 'zustand';

export const ToolsEnum = {
	Selection: 'selection',
	Hand: 'hand',
	Circle: 'circle',
	Square: 'square',
	Draw: 'draw',
	Eraser: 'eraser',
} as const;
export type ToolType = (typeof ToolsEnum)[keyof typeof ToolsEnum];

interface ToolsState {
	tool: ToolType;
	setTool: (newTool: ToolType) => void;
}
export const useToolsStore = create<ToolsState>((set) => ({
	tool: ToolsEnum.Hand,
	setTool: (newTool: ToolType) =>
		set(() => {
			return { tool: newTool };
		}),
}));
