import { Redo, Undo } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { Button } from '@/shared/components/ui/button.tsx';

export const HistoryPanel = observer(
	({ className }: { className?: string }) => {
		const { entities } = useStore();
		const { undo, redo, canRedo, canUndo } = entities.elementsStore;

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
