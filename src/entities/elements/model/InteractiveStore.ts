import { makeAutoObservable } from 'mobx';
import type { BoardElementDraft } from '@/entities/elements';

export class InteractiveStore {
	constructor() {
		makeAutoObservable(this);
	}
	element: BoardElementDraft | null = null;
	set = (addElement: BoardElementDraft | null) => {
		this.element = addElement;
	};
}
