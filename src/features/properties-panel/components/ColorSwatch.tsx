import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '@/shared/lib/cn.ts';
import { TRANSPARENT } from '../model/palette.ts';

interface ColorSwatchProps extends Omit<ComponentProps<'button'>, 'color'> {
	color: string;
	selected?: boolean;
}

const CHECKER = '#d4d4d4';
const TRANSPARENT_STYLE: CSSProperties = {
	backgroundColor: '#ffffff',
	backgroundImage: `linear-gradient(45deg,${CHECKER} 25%,transparent 25%,transparent 75%,${CHECKER} 75%),linear-gradient(45deg,${CHECKER} 25%,transparent 25%,transparent 75%,${CHECKER} 75%)`,
	backgroundSize: '8px 8px',
	backgroundPosition: '0 0,4px 4px',
};

export function ColorSwatch({
	color,
	selected = false,
	className,
	style,
	...props
}: ColorSwatchProps) {
	const isTransparent = color === TRANSPARENT;
	return (
		<button
			type="button"
			data-slot="color-swatch"
			aria-pressed={selected}
			className={cn(
				'size-6 shrink-0 cursor-pointer rounded-md border border-border bg-clip-padding transition-transform',
				'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
				selected &&
					'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110',
				className,
			)}
			style={{
				...(isTransparent ? TRANSPARENT_STYLE : { backgroundColor: color }),
				...style,
			}}
			{...props}
		/>
	);
}
