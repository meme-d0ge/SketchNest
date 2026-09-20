import { useEffect, useId, useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shared/components/ui/popover.tsx';
import { cn } from '@/shared/lib/cn.ts';
import { type ColorPreset, TRANSPARENT } from '../model/palette.ts';
import { ColorSwatch } from './ColorSwatch.tsx';

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	label: string;
	palette: ColorPreset[];
}

const HEX_PATTERN = /^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const toHexDigits = (value: string) => value.replace(/^#/, '');

export function ColorPicker({
	value,
	onChange,
	label,
	palette,
}: ColorPickerProps) {
	const hexId = useId();
	const [draft, setDraft] = useState(() => toHexDigits(value));

	useEffect(() => {
		setDraft(toHexDigits(value));
	}, [value]);

	const handleHexChange = (raw: string) => {
		const digits = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 8);
		setDraft(digits);
		if (HEX_PATTERN.test(digits)) {
			onChange(`#${digits.toLowerCase()}`);
		} else if (digits === '') {
			onChange(TRANSPARENT);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<ColorSwatch
					color={value}
					aria-label={`Open ${label} picker`}
					className="size-8 rounded-lg"
				/>
			</PopoverTrigger>
			<PopoverContent align="start" side="right" sideOffset={12}>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-2">
						<span className="text-sm text-muted-foreground">Colors</span>
						<div className="grid grid-cols-5 gap-2">
							{palette.map((preset) => (
								<ColorSwatch
									key={preset.value || 'transparent'}
									color={preset.value}
									title={preset.label}
									selected={preset.value === value}
									onClick={() => onChange(preset.value)}
								/>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor={hexId} className="text-sm text-muted-foreground">
							Hex code
						</label>
						<div
							className={cn(
								'flex h-9 items-center gap-1 rounded-md border border-input px-2',
								'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
							)}
						>
							<span className="text-muted-foreground select-none">#</span>
							<input
								id={hexId}
								value={draft}
								spellCheck={false}
								autoComplete="off"
								placeholder="transparent"
								onChange={(e) => handleHexChange(e.target.value)}
								className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
