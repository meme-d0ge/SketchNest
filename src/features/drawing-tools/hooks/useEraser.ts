import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import {
	type BoardElement,
	BoardElementUpdateSchema,
	getDistanceToBoardElement,
} from '@/entities/elements';
import type { BoardElementUpdate } from '@/entities/elements/interfaces/board-element.ts';

import { isVector2d } from '@/shared/guards/isVector2d.ts';

const eraserRadius = 0;

export const useEraser = () => {
	const isDrawing = useRef<boolean>(false);
	const isRestoreMode = useRef<boolean>(false);
	const setIdToTrash = useRef<Set<string>>(new Set());
	const lastPosition = useRef<Vector2d | null>(null);
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

	const startEraser = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			isDrawing.current = true;
			const stage = e.target.getStage();
			const absolutePos = stage?.getRelativePointerPosition();
			if (isVector2d(absolutePos)) {
				lastPosition.current = absolutePos;
			}
		},
		[],
	);
	const moveEraser = useCallback(
		(e: Konva.KonvaEventObject<TouchEvent | MouseEvent>) => {
			if (!isDrawing.current || !isVector2d(lastPosition.current)) {
				return;
			}
			const stage = e.target.getStage();
			const absolutePos = stage?.getRelativePointerPosition();
			if (stage === null || !isVector2d(absolutePos)) {
				return;
			}

			const width = lastPosition.current.x - absolutePos.x;
			const height = lastPosition.current.y - absolutePos.y;
			const hypotenuse = Math.sqrt(width ** 2 + height ** 2) || 5;

			const sinA = height / hypotenuse;
			const cosA = width / hypotenuse;

			const allObjects: BoardElement[] = entities.elementsStore.rtree
				.search({
					maxX:
						Math.max(absolutePos.x + hypotenuse * cosA, absolutePos.x) +
						eraserRadius,
					minX:
						Math.min(absolutePos.x + hypotenuse * cosA, absolutePos.x) -
						eraserRadius,
					maxY:
						Math.max(absolutePos.y + hypotenuse * sinA, absolutePos.y) +
						eraserRadius,
					minY:
						Math.min(absolutePos.y + hypotenuse * sinA, absolutePos.y) -
						eraserRadius,
				})
				.map((item) => {
					return entities.elementsStore.getCopyPresentElement(item.ownerId);
				})
				.filter((item) => item !== undefined);

			for (let i = hypotenuse; i >= 0; i = i - 5) {
				const x = absolutePos.x + i * cosA;
				const y = absolutePos.y + i * sinA;

				for (const item of allObjects) {
					const distance = getDistanceToBoardElement({ x, y }, item);
					if (distance !== null && distance < eraserRadius) {
						if (isRestoreMode.current) {
							entities.interactiveStore.removeFromPendingSoftDelete(item.id);
							setIdToTrash.current.delete(item.id);
						} else {
							entities.interactiveStore.addToPendingSoftDelete(item.id);
							setIdToTrash.current.add(item.id);
						}
					}
				}
			}
			lastPosition.current = absolutePos;
		},
		[entities],
	);
	const endEraser = useCallback(() => {
		isDrawing.current = false;
		if (setIdToTrash.current.size > 0) {
			entities.interactiveStore.clearPendingSoftDelete();
			const elements: {
				id: BoardElement['id'];
				element: BoardElementUpdate;
			}[] = [];
			setIdToTrash.current.forEach((id) => {
				if (entities.elementsStore.hasId(id)) {
					elements.push({
						id: id,
						element: BoardElementUpdateSchema.parse({ isDeleted: true }),
					});
				}
			});

			entities.elementsStore.update(elements);
			setIdToTrash.current = new Set();
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
