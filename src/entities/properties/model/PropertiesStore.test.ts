import { describe, expect, it } from 'vitest';
import { PropertiesStore } from './PropertiesStore.ts';

describe('PropertiesStore', () => {
	it('exposes sensible defaults', () => {
		const store = new PropertiesStore();
		expect(store.stroke).toBe('red');
		expect(store.opacity).toBe(1);
		expect(store.strokeWidth).toBe(4);
		expect(store.fill).toBe('');
	});

	it('updates each property through its setter', () => {
		const store = new PropertiesStore();
		store.setStroke('blue');
		store.setOpacity(0.5);
		store.setStrokeWidth(8);
		store.setFill('#fff');
		expect(store.stroke).toBe('blue');
		expect(store.opacity).toBe(0.5);
		expect(store.strokeWidth).toBe(8);
		expect(store.fill).toBe('#fff');
	});
});
