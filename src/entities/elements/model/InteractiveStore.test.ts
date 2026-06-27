import { describe, expect, it } from 'vitest';
import { createRect } from '@/shared/testing/factories.ts';
import type { BoardElementInteractive } from '../interfaces/board-element.ts';
import { InteractiveStore } from './InteractiveStore.ts';

const validInteractive = () =>
	createRect() as unknown as BoardElementInteractive;

describe('InteractiveStore — draft element', () => {
	it('parses and stores a valid interactive element', () => {
		const store = new InteractiveStore();
		store.set(validInteractive());
		expect(store.element?.type).toBe('rect');
	});

	it('clear() resets the draft to null', () => {
		const store = new InteractiveStore();
		store.set(validInteractive());
		store.clear();
		expect(store.element).toBeNull();
	});

	it('ignores invalid input without throwing or mutating state', () => {
		const store = new InteractiveStore();
		expect(() => store.set({ type: 'rect' } as never)).not.toThrow();
		expect(store.element).toBeNull();
	});

});

describe('InteractiveStore — pending soft-delete set', () => {
	it('adds, removes and clears ids', () => {
		const store = new InteractiveStore();
		store.addToPendingSoftDelete('a');
		store.addToPendingSoftDelete('b');
		expect('a' in store.pendingSoftDelete).toBe(true);
		expect('b' in store.pendingSoftDelete).toBe(true);

		store.removeFromPendingSoftDelete('a');
		expect('a' in store.pendingSoftDelete).toBe(false);

		store.clearPendingSoftDelete();
		expect(Object.keys(store.pendingSoftDelete)).toHaveLength(0);
	});
});
