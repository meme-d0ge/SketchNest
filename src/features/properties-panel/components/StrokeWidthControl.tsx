import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shared/components/ui/toggle-group.tsx';
import { STROKE_WIDTH_PRESETS } from '../model/palette.ts';

interface StrokeWidthControlProps {
	value: number;
	onChange: (width: number) => void;
}

const itemClassName =
	'flex-1 cursor-pointer data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary';

export function StrokeWidthControl({
	value,
	onChange,
}: StrokeWidthControlProps) {
	return (
		<ToggleGroup
			spacing={0.5}
			type="single"
			variant="outline"
			className="w-full"
			value={String(value)}
			onValueChange={(next) => {
				if (next !== '') onChange(Number(next));
			}}
		>
			{STROKE_WIDTH_PRESETS.map((preset) => (
				<ToggleGroupItem
					key={preset.value}
					value={String(preset.value)}
					aria-label={preset.label}
					title={preset.label}
					className={itemClassName}
				>
					<span
						className="w-5 rounded-full bg-current"
						style={{ height: preset.bar }}
					/>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
