import { makeAutoObservable } from 'mobx';
import {
	type BoardElementInteractive,
	BoardElementInteractiveSchema,
} from '@/entities/elements/interfaces/board-element';

export class InteractiveStore {
	constructor() {
		makeAutoObservable(this);
	}
	element: BoardElementInteractive | null = null;
	pendingSoftDelete: Record<string, null> = {};

	set = (addElement: BoardElementInteractive) => {
		try {
			this.element = BoardElementInteractiveSchema.parse(addElement);
		} catch (e) {
			console.debug(e);
		}
	};
	clear = () => {
		this.element = null;
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
