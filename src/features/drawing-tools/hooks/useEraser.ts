import Konva from 'konva';
import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';

export const useEraser = () => {
	const isDrawing = useRef<boolean>(false);
	const isRestoreMode = useRef<boolean>(false);
	const arrayIdToTrash = useRef<Set<string>>(new Set());
	const { entities } = useStore();

	const keyDown = useCallback((e: globalThis.KeyboardEvent) => {
		if (e.altKey) {
			isRestoreMode.current = true;
		}
	}, []);
	const keyUp = useCallback((e: globalThis.KeyboardEvent) => {
		if (!e.altKey) {
			isRestoreMode.current = false;
		}
	}, []);

	const startEraser = useCallback(() => {
		isDrawing.current = true;
	}, []);
	const moveEraser = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current || e.target.getClassName() === 'Stage') return;
			const id = e.target.attrs.id;
			if (!id) return;
			if (!isRestoreMode.current) {
				if (arrayIdToTrash.current.has(id)) {
					return;
				}
				if (e.target instanceof Konva.Shape)
					e.target.setAttr('opacity', (e.target.attrs.opacity ?? 1) * 0.5);
				arrayIdToTrash.current.add(id);
			} else {
				if (!arrayIdToTrash.current.has(id)) {
					return;
				}
				if (e.target instanceof Konva.Shape) {
					e.target.setAttr('opacity', (e.target.attrs.opacity ?? 0.5) * 2);
				}
				arrayIdToTrash.current.delete(id);
			}
		},
		[],
	);
	const endEraser = useCallback(() => {
		isDrawing.current = false;
		const arrayElementToTrash = [];
		for (const id of arrayIdToTrash.current) {
			const historyElement = entities.elementsStore.getLatestVersion(id)
			arrayElementToTrash.push({
				...historyElement,
				isDeleted: true
			});
		}
		if (arrayElementToTrash.length > 0) {
			entities.elementsStore.add(arrayElementToTrash);
			arrayIdToTrash.current = new Set();
		}
	}, [entities]);

	useEffect(() => {
		document.addEventListener('keydown', keyDown);
		document.addEventListener('keyup', keyUp);
		return () => {
			document.removeEventListener('keydown', keyDown);
			document.removeEventListener('keyup', keyUp);
		};
	}, [keyDown, keyUp]);
	return { startEraser, moveEraser, endEraser };
};
