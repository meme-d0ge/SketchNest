import { makeAutoObservable } from 'mobx';
import type { BoardElementOptionalId } from '@/entities/elements';

export class InteractiveStore {
	constructor() {
		makeAutoObservable(this);
	}
	element: BoardElementOptionalId | null = null;
	set = (addElement: BoardElementOptionalId | null) => {
		this.element = addElement;
	};
}
