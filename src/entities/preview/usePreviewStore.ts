import { create } from 'zustand';
import type { BoardElement } from '@/entities/elements';

interface PreviewState {
	element: BoardElement | null;
	set: (addElement: BoardElement | null) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
	element: null,
	set: (addElement) => set(() => ({ element: addElement })),
}));
