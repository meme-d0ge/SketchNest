import { makeAutoObservable } from 'mobx';
import type { BoardElementCreate } from '@/entities/elements/interfaces/board-element';

export class InteractiveStore {
	constructor() {
		makeAutoObservable(this);
	}
	element: BoardElementCreate | null = null;
	pendingSoftDelete: Record<string, null> = {};

	set = (addElement: BoardElementCreate | null) => {
		this.element = addElement;
	};

	addToPendingSoftDelete = (id: string) => {
		this.pendingSoftDelete[id] = null;
	};
	removeFromPendingSoftDelete = (id: string) => {
		delete this.pendingSoftDelete[id];
	};
	clearPendingSoftDelete = () => {
		this.pendingSoftDelete = {};
	};
}
