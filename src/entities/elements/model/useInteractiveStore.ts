import { create } from 'zustand';
import type { BoardElementOptionalId } from '@/entities/elements';

interface PreviewState {
	element: BoardElementOptionalId | null;
	set: (addElement: BoardElementOptionalId | null) => void;
}

export const useInteractiveStore = create<PreviewState>((set) => ({
	element: null,
	set: (addElement) => set(() => ({ element: addElement })),
}));
