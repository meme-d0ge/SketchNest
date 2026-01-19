import { makeAutoObservable } from 'mobx';

export const ToolsEnum = {
	Selection: 'selection',
	Hand: 'hand',
	Ellipse: 'ellipse',
	Rect: 'rect',
	Draw: 'draw',
	Eraser: 'eraser',
} as const;
export type ToolType = (typeof ToolsEnum)[keyof typeof ToolsEnum];

export class ToolsStore {
	constructor() {
		makeAutoObservable(this);
	}
	tool: ToolType = ToolsEnum.Hand;
	setTool = (newTool: ToolType) => {
		this.tool = newTool;
	};
}
