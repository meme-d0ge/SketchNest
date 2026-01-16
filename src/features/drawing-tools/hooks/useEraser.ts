import Konva from 'konva';
import { useCallback, useEffect, useRef } from 'react';
import { useElementsStore } from '@/entities/elements';

export const useEraser = () => {
	const isDrawing = useRef<boolean>(false);
	const arrayIdToTrash = useRef<Set<number>>(new Set());
	const isRestoreMode = useRef<boolean>(false);
	const { add: addToElementsStore } = useElementsStore();

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
			const idNumber = Number(e.target.attrs.id);
			if (!isRestoreMode.current) {
				if (arrayIdToTrash.current.has(idNumber)) {
					return;
				}
				if (e.target instanceof Konva.Shape)
					e.target.setAttr('opacity', (e.target.attrs.opacity | 1) * 0.5);
				arrayIdToTrash.current.add(idNumber);
			} else {
				if (!arrayIdToTrash.current.has(idNumber)) {
					return;
				}
				if (e.target instanceof Konva.Shape) {
					e.target.setAttr('opacity', (e.target.attrs.opacity || 0.5) * 2);
				}
				arrayIdToTrash.current.delete(idNumber);
			}
		},
		[],
	);
	const endEraser = useCallback(() => {
		isDrawing.current = false;
		const history = useElementsStore.getState().elements;
		const arrayElementToTrash = [];
		for (const id of arrayIdToTrash.current) {
			const historyElement = history[id];
			const newHistoryElement = structuredClone(
				historyElement.history[historyElement.version],
			);
			newHistoryElement.isDeleted = true;
			arrayElementToTrash.push(newHistoryElement);
		}
		addToElementsStore(arrayElementToTrash);
		arrayIdToTrash.current = new Set();
	}, [addToElementsStore]);

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
