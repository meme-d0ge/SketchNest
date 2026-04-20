import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useStore } from '@/app/providers/StoreProvider.tsx';
import { Card } from '@/shared/components/ui/card.tsx';
import { Slider } from '@/shared/components/ui/slider.tsx';

interface PropertiesPanelProps {
	className?: string;
	showStroke?: boolean;
	showFill?: boolean;
	showStrokeWidth?: boolean;
	showOpacity?: boolean;
}

export const PropertiesPanel = observer(
	({
		className,
		showStroke = false,
		showFill = false,
		showStrokeWidth = false,
		showOpacity = false,
	}: PropertiesPanelProps) => {
		const { entities } = useStore();
		const propertiesStore = entities.propertiesStore;

		const handleOpacity = useCallback(
			(value: number[]) => {
				propertiesStore.setOpacity(value[0]);
			},
			[propertiesStore.setOpacity],
		);
		const handleStrokeWidth = useCallback(
			(value: number[]) => {
				propertiesStore.setStrokeWidth(value[0]);
			},
			[propertiesStore.setStrokeWidth],
		);

		return (
			<Card className={className}>
				{showOpacity ? (
					<div className="flex flex-col gap-1">
						<span className="text-right text-xl">
							{propertiesStore.opacity}
						</span>
						<Slider
							onValueChange={handleOpacity}
							defaultValue={[propertiesStore.opacity]}
							max={1}
							step={0.1}
							className="mx-auto w-full max-w-xs"
						/>
					</div>
				) : null}
				{showStrokeWidth ? (
					<div className="flex flex-col gap-1">
						<span className="text-right text-xl">
							{propertiesStore.strokeWidth}
						</span>
						<Slider
							onValueChange={handleStrokeWidth}
							defaultValue={[propertiesStore.strokeWidth]}
							min={1}
							max={100}
							step={1}
							className="mx-auto w-full max-w-xs"
						/>
					</div>
				) : null}
			</Card>
		);
	},
);
