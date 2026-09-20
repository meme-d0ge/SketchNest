import { describe, expect, it } from 'vitest';
import { ToolsEnum, ToolsStore } from './ToolsStore.ts';

describe('ToolsStore', () => {
	it('defaults to the Hand tool', () => {
		expect(new ToolsStore().tool).toBe(ToolsEnum.Hand);
	});

	it('switches the active tool', () => {
		const store = new ToolsStore();
		store.setTool(ToolsEnum.Eraser);
		expect(store.tool).toBe(ToolsEnum.Eraser);
		store.setTool(ToolsEnum.Rect);
		expect(store.tool).toBe(ToolsEnum.Rect);
	});
});
