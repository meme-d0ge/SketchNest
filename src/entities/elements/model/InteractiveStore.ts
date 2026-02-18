import { makeAutoObservable } from 'mobx';
import type { BoardElementDraft } from '@/entities/elements/interfaces/board-element';

export class InteractiveStore {
	constructor() {
		makeAutoObservable(this);
	}
	element: BoardElementDraft | null = null;
	pendingSoftDelete: Record<string, null> = {};

	set = (addElement: BoardElementDraft | null) => {
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
