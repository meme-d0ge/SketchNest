import {
	Circle,
	Eraser,
	Hand,
	MousePointer2,
	Pencil,
	Square,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { ToolsEnum, type ToolType } from '@/entities/tools';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shared/components/ui/toggle-group.tsx';

export const CanvasTools = observer(({ className }: { className?: string }) => {
	const { entities } = useStore();
	const { tool, setTool } = entities.toolsStore;
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
				value={ToolsEnum.Selection}
				aria-label="Toggle mouse pointer"
				disabled={tool === ToolsEnum.Selection}
				className="cursor-pointer"
			>
				<MousePointer2 className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Rect}
				aria-label="Toggle rectangle"
				disabled={tool === ToolsEnum.Rect}
				className="cursor-pointer"
			>
				<Square className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Ellipse}
				aria-label="Toggle ellipse"
				disabled={tool === ToolsEnum.Ellipse}
				className="cursor-pointer"
			>
				<Circle className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Draw}
				aria-label="Toggle draw"
				disabled={tool === ToolsEnum.Draw}
				className="cursor-pointer"
			>
				<Pencil className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value={ToolsEnum.Eraser}
				aria-label="Toggle eraser"
				disabled={tool === ToolsEnum.Eraser}
				className="cursor-pointer"
			>
				<Eraser className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
});
