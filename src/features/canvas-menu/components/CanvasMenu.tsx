import type Konva from 'konva';
import { Download, Monitor, Moon, Sun, TextAlignJustify } from 'lucide-react';
import { memo, type RefObject, useState } from 'react';
import { Button } from '@/shared/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';
import { type Theme, useTheme } from '@/shared/hooks/useTheme.ts';
import { ExportImageDialog } from './ExportImageDialog.tsx';

interface CanvasMenuProps {
	className?: string;
	stageRef: RefObject<Konva.Stage | null>;
}

export const CanvasMenu = memo(({ className, stageRef }: CanvasMenuProps) => {
	const [open, setOpen] = useState(false);
	const [exportOpen, setExportOpen] = useState(false);
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
					<DropdownMenuLabel>Canvas</DropdownMenuLabel>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => setExportOpen(true)}
					>
						<Download />
						Export as PNG
					</DropdownMenuItem>
					<DropdownMenuSeparator />
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
			<ExportImageDialog
				stageRef={stageRef}
				open={exportOpen}
				onOpenChange={setExportOpen}
			/>
		</div>
	);
});
