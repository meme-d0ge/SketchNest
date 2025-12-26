import { Circle, Hand, MousePointer2, Square } from 'lucide-react';
import { memo, useCallback } from 'react';
import {
	ToolsEnum,
	type ToolType,
	useToolsStore,
} from '@/entities/tools/useToolsStore.ts';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shared/components/ui/toggle-group.tsx';

export const CanvasTools = memo(({ className }: { className?: string }) => {
	const { tool, setTool } = useToolsStore();
	const handleValueChange = useCallback(
		(newValue: ToolType) => {
			setTool(newValue);
		},
		[setTool],
	);
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			className={className}
			onValueChange={handleValueChange}
			value={tool}
		>
			<ToggleGroupItem
				value={ToolsEnum.Hand}
				aria-label="Toggle hand"
				disabled={tool === ToolsEnum.Hand}
				className="cursor-pointer"
			>
				<Hand className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Cursor}
				aria-label="Toggle mouse pointer"
				disabled={tool === ToolsEnum.Cursor}
				className="cursor-pointer"
			>
				<MousePointer2 className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Square}
				aria-label="Toggle square"
				disabled={tool === ToolsEnum.Square}
				className="cursor-pointer"
			>
				<Square className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Circle}
				aria-label="Toggle circle"
				disabled={tool === ToolsEnum.Circle}
				className="cursor-pointer"
			>
				<Circle className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
});
