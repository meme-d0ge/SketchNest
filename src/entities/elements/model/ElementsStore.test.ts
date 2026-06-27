import { beforeEach, describe, expect, it } from 'vitest';
import type { BoardElementUpdate } from '@/entities/elements/interfaces/board-element.ts';
import {
	createEllipse,
	createLine,
	createRect,
} from '@/shared/testing/factories.ts';
import { ElementsStore } from './ElementsStore.ts';

const recolor = (stroke: string): BoardElementUpdate =>
	({ visualData: { stroke } }) as BoardElementUpdate;
const softDelete = (): BoardElementUpdate =>
	({ isDeleted: true }) as BoardElementUpdate;

describe('ElementsStore — create', () => {
	let store: ElementsStore;
	beforeEach(() => {
		store = new ElementsStore();
	});

	it('adds a valid element and opens an undo step', () => {
		store.create([createRect()]);
		expect(store.visibleElements).toHaveLength(1);
		expect(store.canUndo).toBe(true);
		expect(store.canRedo).toBe(false);
	});

	it('creates several elements in a single step', () => {
		store.create([createRect(), createEllipse(), createLine()]);
		expect(store.visibleElements).toHaveLength(3);
		store.undo();
		// all three were one user action -> one undo removes all
		expect(store.visibleElements).toHaveLength(0);
	});

	it('silently skips invalid elements without corrupting state', () => {
		store.create([createRect({ width: 0 })]);
		expect(store.visibleElements).toHaveLength(0);
		expect(store.canUndo).toBe(false);
	});

	it('drops invalid elements but keeps valid ones from the same batch', () => {
		store.create([createRect({ width: 0 }), createRect()]);
		expect(store.visibleElements).toHaveLength(1);
		expect(store.canUndo).toBe(true);
	});
});

describe('ElementsStore — update / undo / redo', () => {
	let store: ElementsStore;
	let id: string;
	beforeEach(() => {
		store = new ElementsStore();
		store.create([createRect()]);
		id = store.visibleElements[0].id;
	});

	it('applies an update and reverts/replays it (round-trip identity)', () => {
		store.update([{ id, element: recolor('blue') }]);
		expect(store.getElement(id)?.visualData.stroke).toBe('blue');

		store.undo();
		expect(store.getElement(id)?.visualData.stroke).toBe('red');

		store.redo();
		expect(store.getElement(id)?.visualData.stroke).toBe('blue');
	});

	it('undo of the creation hides the element and can be redone', () => {
		store.undo();
		expect(store.visibleElements).toHaveLength(0);
		expect(store.canUndo).toBe(false);
		expect(store.canRedo).toBe(true);

		store.redo();
		expect(store.visibleElements).toHaveLength(1);
		expect(store.getElement(id)?.id).toBe(id);
	});

	it('is a no-op when undo/redo are unavailable', () => {
		const store2 = new ElementsStore();
		expect(store2.canUndo).toBe(false);
		expect(() => store2.undo()).not.toThrow();
		expect(() => store2.redo()).not.toThrow();
		expect(store2.visibleElements).toHaveLength(0);
	});
});

describe('ElementsStore — soft delete', () => {
	it('hides a deleted element but keeps it recoverable via undo', () => {
		const store = new ElementsStore();
		store.create([createRect()]);
		const id = store.visibleElements[0].id;

		store.update([{ id, element: softDelete() }]);
		expect(store.visibleElements).toHaveLength(0);
		// still tracked, just flagged deleted
		expect(store.getElement(id)?.isDeleted).toBe(true);

		store.undo();
		expect(store.visibleElements).toHaveLength(1);
		expect(store.getElement(id)?.isDeleted).toBe(false);
	});
});

describe('ElementsStore — searchByBounds (R-tree)', () => {
	it('returns elements intersecting the query box and excludes deleted ones', () => {
		const store = new ElementsStore();
		store.create([createRect({ x: 0, y: 0 })]);
		const id = store.visibleElements[0].id;

		expect(
			store.searchByBounds({ minX: 0, maxX: 1, minY: 0, maxY: 1 }),
		).toHaveLength(1);
		expect(
			store.searchByBounds({ minX: 500, maxX: 600, minY: 500, maxY: 600 }),
		).toHaveLength(0);

		store.update([{ id, element: softDelete() }]);
		expect(
			store.searchByBounds({ minX: 0, maxX: 1, minY: 0, maxY: 1 }),
		).toHaveLength(0);
	});

	it('returns [] for invalid bounds without throwing', () => {
		const store = new ElementsStore();
		expect(store.searchByBounds({ minX: 0 } as never)).toEqual([]);
	});
});

describe('ElementsStore — branch pruning', () => {
	it('drops the redo branch when a new edit follows an undo', () => {
		const store = new ElementsStore();
		store.create([createRect({ x: 0 })]);
		const idA = store.visibleElements[0].id;
		store.create([createRect({ x: 50 })]);
		const idB = store.visibleElements[1].id;

		store.undo(); // hide B's creation
		expect(store.canRedo).toBe(true);

		store.create([createRect({ x: 100 })]); // new edit -> prune B
		expect(store.canRedo).toBe(false);

		const visibleIds = store.visibleElements.map((e) => e.id);
		expect(visibleIds).toContain(idA);
		expect(visibleIds).not.toContain(idB);
		expect(store.visibleElements).toHaveLength(2);
		// B was pruned out of the index entirely
		expect(store.getElement(idB)).toBeUndefined();
	});
});
