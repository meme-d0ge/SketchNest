import { Redo, Undo } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { Button } from '@/shared/components/ui/button.tsx';

export const HistoryPanel = observer(
	({ className }: { className?: string }) => {
		const { entities } = useStore();
		const { undo, redo, canRedo, canUndo } = entities.elementsStore;

		const keyDownHandle = useCallback(
			(event: KeyboardEvent) => {
				if (event.ctrlKey && event.code === 'KeyZ') {
					if (event.shiftKey) {
						redo();
					} else {
						undo();
					}
				}
			},
			[undo, redo],
		);

		useEffect(() => {
			document.addEventListener('keydown', keyDownHandle);
			return () => {
				document.removeEventListener('keydown', keyDownHandle);
			};
		}, [keyDownHandle]);

		return (
			<div className={`flex flex-row gap-2 ${className}`}>
				<Button onClick={undo} className="cursor-pointer" disabled={!canUndo}>
					<Undo />
				</Button>
				<Button onClick={redo} className="cursor-pointer" disabled={!canRedo}>
					<Redo />
				</Button>
			</div>
		);
	},
);
