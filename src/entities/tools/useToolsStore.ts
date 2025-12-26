import { create } from 'zustand';

export const ToolsEnum = {
	Cursor: 'cursor',
	Hand: 'hand',
	Circle: 'circle',
	Square: 'square',
} as const;
export type ToolType = (typeof ToolsEnum)[keyof typeof ToolsEnum];

interface ToolsState {
	tool: ToolType;
	setTool: (newTool: ToolType) => void;
}
export const useToolsStore = create<ToolsState>((set) => ({
	tool: ToolsEnum.Cursor,
	setTool: (newTool: ToolType) =>
		set(() => {
			return { tool: newTool };
		}),
}));
