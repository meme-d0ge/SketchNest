import type Konva from 'konva';
import { Check, Copy, Download } from 'lucide-react';
import { type CSSProperties, type RefObject, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/shared/components/ui/dialog.tsx';
import { Switch } from '@/shared/components/ui/switch.tsx';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shared/components/ui/toggle-group.tsx';
import {
	copyCanvasToClipboard,
	downloadDataUrl,
	type RenderResult,
	renderStagePng,
} from '@/shared/lib/exportStage.ts';

interface ExportImageDialogProps {
	stageRef: RefObject<Konva.Stage | null>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const LIGHT_BG = '#ffffff';
const DARK_BG = '#121212';
const SCALES = [1, 2, 3];

const CHECKER = 'rgba(128,128,128,0.25)';
const checkerStyle: CSSProperties = {
	backgroundImage: `linear-gradient(45deg,${CHECKER} 25%,transparent 25%,transparent 75%,${CHECKER} 75%),linear-gradient(45deg,${CHECKER} 25%,transparent 25%,transparent 75%,${CHECKER} 75%)`,
	backgroundSize: '16px 16px',
	backgroundPosition: '0 0,8px 8px',
};

function Row({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="font-medium">{label}</span>
			{children}
		</div>
	);
}

export function ExportImageDialog({
	stageRef,
	open,
	onOpenChange,
}: ExportImageDialogProps) {
	const [background, setBackground] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [scale, setScale] = useState(2);
	const [preview, setPreview] = useState<RenderResult | null>(null);
	const [copied, setCopied] = useState(false);

	const bgColor = background ? (darkMode ? DARK_BG : LIGHT_BG) : null;

	useEffect(() => {
		if (open) {
			setDarkMode(document.documentElement.classList.contains('dark'));
			setCopied(false);
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const stage = stageRef.current;
		setPreview(
			stage
				? renderStagePng(stage, { pixelRatio: 1, background: bgColor })
				: null,
		);
	}, [open, bgColor, stageRef]);

	const handlePng = () => {
		const stage = stageRef.current;
		if (!stage) return;
		const result = renderStagePng(stage, {
			pixelRatio: scale,
			background: bgColor,
		});
		if (result) downloadDataUrl(result.dataUrl);
	};

	const handleCopy = async () => {
		const stage = stageRef.current;
		if (!stage) return;
		const result = renderStagePng(stage, {
			pixelRatio: scale,
			background: bgColor,
		});
		if (!result) return;
		await copyCanvasToClipboard(result.canvas);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const empty = preview === null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogDescription className="sr-only">
					Export the canvas as a PNG image.
				</DialogDescription>
				<div className="grid gap-6 md:grid-cols-[1fr_300px]">
					<div
						className="flex min-h-72 items-center justify-center rounded-xl border p-4"
						style={checkerStyle}
					>
						{empty ? (
							<span className="text-sm text-muted-foreground">
								Nothing to export
							</span>
						) : (
							<img
								src={preview.dataUrl}
								alt="Export preview"
								className="max-h-80 max-w-full object-contain"
							/>
						)}
					</div>

					<div className="flex flex-col gap-5">
						<DialogTitle className="text-2xl">Export image</DialogTitle>

						<Row label="Background">
							<Switch checked={background} onCheckedChange={setBackground} />
						</Row>
						<Row label="Dark mode">
							<Switch
								checked={darkMode}
								onCheckedChange={setDarkMode}
								disabled={!background}
							/>
						</Row>
						<Row label="Scale">
							<ToggleGroup
								spacing={0.5}
								type="single"
								variant="outline"
								value={String(scale)}
								onValueChange={(v) => v && setScale(Number(v))}
							>
								{SCALES.map((s) => (
									<ToggleGroupItem
										key={s}
										value={String(s)}
										aria-label={`${s}x`}
										className="cursor-pointer px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
									>
										{s}×
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</Row>

						<div className="mt-auto flex flex-wrap justify-end gap-2">
							<Button
								onClick={handlePng}
								disabled={empty}
								className="cursor-pointer"
							>
								<Download />
								PNG
							</Button>
							<Button
								onClick={handleCopy}
								disabled={empty}
								variant="secondary"
								className="cursor-pointer"
							>
								{copied ? <Check /> : <Copy />}
								{copied ? 'Copied' : 'Copy to clipboard'}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
