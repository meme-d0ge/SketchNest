import type Konva from 'konva';
import type { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import type { BoardElement } from '@/entities/elements';
import { ElementsEnum } from '@/entities/elements/interfaces/element-type-variant.ts';
import { isVector2d } from '@/shared/guards/isVector2d.ts';
import { getDistanceToEllipse } from '@/shared/lib/math/getDistanceToEllipse.ts';
import { getDistanceToLine } from '@/shared/lib/math/getDistanceToLine.ts';
import { getDistanceToRect } from '@/shared/lib/math/getDistanceToRect.ts';

const eraserRadius = 20;
const radiusLine = 5;

export const useEraser = () => {
	const isDrawing = useRef<boolean>(false);
	const isRestoreMode = useRef<boolean>(false);
	const arrayIdToTrash = useRef<Set<string>>(new Set());
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
					return entities.elementsStore.getActualVersion(item.ownerId);
				});

			for (let i = hypotenuse; i >= 0; i = i - 5) {
				const x = absolutePos.x + i * cosA;
				const y = absolutePos.y + i * sinA;

				for (const item of allObjects) {
					let flag = false;
					if (item.type === ElementsEnum.Line) {
						const position = { x, y };
						if (
							getDistanceToLine(position, item.data) >
							radiusLine + eraserRadius
						)
							continue;
						flag = true;
					} else if (item.type === ElementsEnum.Rect) {
						const position = { x, y };
						if (getDistanceToRect(position, item.data) > eraserRadius) continue;
						flag = true;
					} else if (item.type === ElementsEnum.Ellipse) {
						const position = { x, y };
						if (getDistanceToEllipse(position, item.data) > eraserRadius)
							continue;
						flag = true;
					}
					if (flag) {
						if (isRestoreMode.current) {
							entities.interactiveStore.removeFromPendingSoftDelete(item.id);
							arrayIdToTrash.current.delete(item.id);
						} else {
							entities.interactiveStore.addToPendingSoftDelete(item.id);
							arrayIdToTrash.current.add(item.id);
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
		const arrayElementToTrash = [];
		for (const id of arrayIdToTrash.current) {
			const historyElement = entities.elementsStore.getActualVersion(id);
			historyElement.isDeleted = true;
			arrayElementToTrash.push(historyElement);
		}
		if (arrayElementToTrash.length > 0) {
			entities.interactiveStore.clearPendingSoftDelete();
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
