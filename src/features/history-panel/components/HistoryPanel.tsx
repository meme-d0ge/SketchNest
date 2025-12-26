import { Redo, Undo } from 'lucide-react';
import { memo } from 'react';
import { useHistoryStore } from '@/entities/history';
import { Button } from '@/shared/components/ui/button.tsx';

export const HistoryPanel = memo(({ className }: { className?: string }) => {
	const { undo, redo, canRedo, canUndo } = useHistoryStore();
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
});
