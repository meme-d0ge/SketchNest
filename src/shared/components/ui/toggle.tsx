import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/shared/lib/cn.ts';

const toggleVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 disabled:opacity-50',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 disabled:opacity-50',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50',
				ghost:
					'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:opacity-50',
				link: 'text-primary underline-offset-4 hover:underline disabled:opacity-50',

				sidebar: `				
					rounded-md
					bg-sidebar
					text-sidebar-foreground
					hover:bg-sidebar-primary-foreground
					disabled:bg-sidebar-accent
					disabled:text-sidebar-accent-foreground
				`,
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Toggle({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
	VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive.Root
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Toggle, toggleVariants };
