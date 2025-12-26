import { Circle, Hand, MousePointer2, Square } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shared/components/ui/toggle-group.tsx';

const defaultValue = 'pointer';
export const CanvasTools = memo(({ className }: { className?: string }) => {
	const [value, setValue] = useState<string>(defaultValue);
	const handleValueChange = useCallback((newValue: string) => {
		setValue(newValue);
	}, []);
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			className={className}
			onValueChange={handleValueChange}
			value={value}
		>
			<ToggleGroupItem
				value="hand"
				aria-label="Toggle hand"
				disabled={value === 'hand'}
				className="cursor-pointer"
			>
				<Hand className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="pointer"
				aria-label="Toggle mouse pointer"
				disabled={value === 'pointer'}
				className="cursor-pointer"
			>
				<MousePointer2 className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="square"
				aria-label="Toggle square"
				disabled={value === 'square'}
				className="cursor-pointer"
			>
				<Square className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="circle"
				aria-label="Toggle circle"
				disabled={value === 'circle'}
				className="cursor-pointer"
			>
				<Circle className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
});
