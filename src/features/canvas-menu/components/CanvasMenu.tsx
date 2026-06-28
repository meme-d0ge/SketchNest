import { Monitor, Moon, Sun, TextAlignJustify } from 'lucide-react';
import { memo, useState } from 'react';
import { Button } from '@/shared/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';
import { type Theme, useTheme } from '@/shared/hooks/useTheme.ts';

export const CanvasMenu = memo(({ className }: { className?: string }) => {
	const [open, setOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	return (
		<div className={className}>
			<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="cursor-pointer">
						<TextAlignJustify />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-44">
					<DropdownMenuLabel>Theme</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={theme}
						onValueChange={(value) => setTheme(value as Theme)}
					>
						<DropdownMenuRadioItem value="light" className="cursor-pointer">
							<Sun />
							Light
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark" className="cursor-pointer">
							<Moon />
							Dark
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system" className="cursor-pointer">
							<Monitor />
							System
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
});
