import { TextAlignJustify } from 'lucide-react';
import { memo, useState } from 'react';
import { Button } from '@/shared/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';

export const CanvasMenu = memo(({ className }: { className?: string }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className={className}>
			<DropdownMenu
				modal={false}
				open={open}
				onOpenChange={(value) => setOpen(value)}
			>
				<DropdownMenuTrigger asChild>
					<Button className="cursor-pointer">
						<TextAlignJustify />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="pointer-events-auto"></DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
});
