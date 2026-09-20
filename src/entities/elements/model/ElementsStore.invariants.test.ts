import { describe, expect, it } from 'vitest';
import type { BoardElementUpdate } from '@/entities/elements/interfaces/board-element.ts';
import {
	createEllipse,
	createLine,
	createRect,
} from '@/shared/testing/factories.ts';
import { ElementsStore } from './ElementsStore.ts';

// Dependency-free seeded PRNG (mulberry32) so the fuzz is deterministic.
function mulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const snapshot = (store: ElementsStore): string[] =>
	store.visibleElements.map((e) => `${e.id}:${e.visualData.stroke}`).sort();

const randomCreate = (rnd: () => number) => {
	const x = Math.floor(rnd() * 200);
	const y = Math.floor(rnd() * 200);
	const t = rnd();
	if (t < 0.34) return createRect({ x, y });
	if (t < 0.67)
		return createEllipse({
			x,
			y,
			radiusX: 4 + Math.floor(rnd() * 6),
			radiusY: 3 + Math.floor(rnd() * 6),
		});
	return createLine({ x, y });
};

describe('ElementsStore — invariants (seeded fuzz)', () => {
	it('full undo empties the board, full redo restores the exact visible state', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const rnd = mulberry32(seed);
			const store = new ElementsStore();
			const ids: string[] = [];
			const ops = 3 + Math.floor(rnd() * 10);

			for (let i = 0; i < ops; i++) {
				if (ids.length === 0 || rnd() < 0.6) {
					const before = store.visibleElements.length;
					store.create([randomCreate(rnd)]);
					if (store.visibleElements.length > before) {
						ids.push(
							store.visibleElements[store.visibleElements.length - 1].id,
						);
					}
				} else {
					const id = ids[Math.floor(rnd() * ids.length)];
					store.update([
						{
							id,
							element: {
								visualData: { stroke: `#${seed}_${i}` },
							} as BoardElementUpdate,
						},
					]);
				}
			}

			const expected = snapshot(store);

			let guard = 0;
			while (store.canUndo && guard++ < 10_000) store.undo();
			expect(store.visibleElements, `seed ${seed}: undo to empty`).toHaveLength(
				0,
			);

			guard = 0;
			while (store.canRedo && guard++ < 10_000) store.redo();
			expect(snapshot(store), `seed ${seed}: redo restores state`).toEqual(
				expected,
			);
		}
	});

	it('a new edit after N undos prunes the redo branch and keeps the index consistent', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const rnd = mulberry32(seed * 7 + 1);
			const store = new ElementsStore();
			const n = 2 + Math.floor(rnd() * 6);
			for (let i = 0; i < n; i++) store.create([createRect({ x: i * 30 })]);

			const undos = Math.floor(rnd() * (n + 1)); // 0..n
			for (let i = 0; i < undos; i++) store.undo();
			const visibleBefore = store.visibleElements.length;

			store.create([createRect({ x: 999 })]); // new edit -> prune redo branch
			expect(store.canRedo, `seed ${seed}: redo branch dropped`).toBe(false);
			expect(store.visibleElements, `seed ${seed}: count`).toHaveLength(
				visibleBefore + 1,
			);

			// every visible element still resolves to itself through the index map
			for (const el of store.visibleElements) {
				expect(store.getElement(el.id)?.id).toBe(el.id);
			}
		}
	});
});
