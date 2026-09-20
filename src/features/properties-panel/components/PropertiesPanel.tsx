import { observer } from 'mobx-react-lite';
import { type ReactNode, useCallback } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { Card } from '@/shared/components/ui/card.tsx';
import { Slider } from '@/shared/components/ui/slider.tsx';
import { cn } from '@/shared/lib/cn.ts';
import {
	BACKGROUND_PALETTE,
	BACKGROUND_PRESETS,
	type ColorPreset,
	STROKE_PALETTE,
	STROKE_PRESETS,
} from '../model/palette.ts';
import { ColorPicker } from './ColorPicker.tsx';
import { ColorSwatch } from './ColorSwatch.tsx';
import { StrokeWidthControl } from './StrokeWidthControl.tsx';

interface PropertiesPanelProps {
	className?: string;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm text-muted-foreground">{label}</span>
			{children}
		</div>
	);
}

function ColorRow({
	label,
	presets,
	palette,
	value,
	onChange,
}: {
	label: string;
	presets: ColorPreset[];
	palette: ColorPreset[];
	value: string;
	onChange: (color: string) => void;
}) {
	return (
		<div className="flex items-center gap-2">
			{presets.map((preset) => (
				<ColorSwatch
					key={preset.value}
					color={preset.value}
					title={preset.label}
					selected={preset.value === value}
					onClick={() => onChange(preset.value)}
				/>
			))}
			<span className="mx-1 h-6 w-px bg-border" aria-hidden />
			<ColorPicker
				value={value}
				onChange={onChange}
				label={label}
				palette={palette}
			/>
		</div>
	);
}

export const PropertiesPanel = observer(
	({ className }: PropertiesPanelProps) => {
		const { entities } = useStore();
		const propertiesStore = entities.propertiesStore;

		const handleOpacity = useCallback(
			(value: number[]) => {
				propertiesStore.setOpacity(value[0] / 100);
			},
			[propertiesStore.setOpacity],
		);

		return (
			<Card className={cn('flex flex-col gap-5 p-4', className)}>
				<Section label="Stroke">
					<ColorRow
						label="stroke colour"
						presets={STROKE_PRESETS}
						palette={STROKE_PALETTE}
						value={propertiesStore.stroke}
						onChange={propertiesStore.setStroke}
					/>
				</Section>

				<Section label="Background">
					<ColorRow
						label="background colour"
						presets={BACKGROUND_PRESETS}
						palette={BACKGROUND_PALETTE}
						value={propertiesStore.fill}
						onChange={propertiesStore.setFill}
					/>
				</Section>

				<Section label="Stroke width">
					<StrokeWidthControl
						value={propertiesStore.strokeWidth}
						onChange={propertiesStore.setStrokeWidth}
					/>
				</Section>

				<Section label="Opacity">
					<Slider
						value={[propertiesStore.opacity * 100]}
						onValueChange={handleOpacity}
						min={0}
						max={100}
						step={10}
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>0</span>
						<span>100</span>
					</div>
				</Section>
			</Card>
		);
	},
);
