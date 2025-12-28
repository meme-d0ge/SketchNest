import type Konva from 'konva';
import { type RefObject, useCallback, useEffect } from 'react';

const scaleBy = 1.05;
export const useZoom = (stage: RefObject<Konva.Stage | null>) => {
	const zoom = useCallback(
		(stage: Konva.Stage, direction: '+' | '-', to: 'cursor' | 'center') => {
			const position = stage.getPosition();
			const oldScale = stage.scaleX();
			const newScale =
				direction === '+' ? oldScale * scaleBy : oldScale / scaleBy;
			const center = {
				x: stage.width() / 2,
				y: stage.height() / 2,
			};
			const cursor = stage.getPointerPosition();

			stage.scale({
				x: newScale,
				y: newScale,
			});
			if (to === 'center') {
				stage.position({
					x: center.x - ((center.x - position.x) / oldScale) * newScale,
					y: center.y - ((center.y - position.y) / oldScale) * newScale,
				});
			} else if (cursor !== null) {
				stage.position({
					x: cursor.x - ((cursor.x - position.x) / oldScale) * newScale,
					y: cursor.y - ((cursor.y - position.y) / oldScale) * newScale,
				});
			} else {
				stage.position({
					x: center.x - ((center.x - position.x) / oldScale) * newScale,
					y: center.y - ((center.y - position.y) / oldScale) * newScale,
				});
			}
		},
		[],
	);

	const handlerWheelEvent = useCallback(
		(e: WheelEvent) => {
			e.preventDefault();
			if (stage.current !== null) {
				if (e.deltaY > 0) {
					zoom(stage.current, '-', 'cursor');
				} else if (e.deltaY < 0) {
					zoom(stage.current, '+', 'cursor');
				}
			}
		},
		[stage, zoom],
	);
	const handlerKeyEvent = useCallback(
		(e: globalThis.KeyboardEvent) => {
			if (e.ctrlKey && (e.key === '-' || e.key === '=')) {
				e.preventDefault();
				if (stage.current !== null) {
					if (e.key === '=') {
						zoom(stage.current, '+', 'center');
					} else {
						zoom(stage.current, '-', 'center');
					}
				}
			}
		},
		[stage, zoom],
	);
	useEffect(() => {
		window.addEventListener('wheel', handlerWheelEvent, { passive: false });
		return () => {
			window.removeEventListener('wheel', handlerWheelEvent);
		};
	}, [handlerWheelEvent]);
	useEffect(() => {
		document.addEventListener('keydown', handlerKeyEvent, { passive: false });
		return () => {
			document.removeEventListener('keydown', handlerKeyEvent);
		};
	}, [handlerKeyEvent]);
};
