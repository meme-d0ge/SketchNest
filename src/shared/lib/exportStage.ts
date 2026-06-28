import type Konva from 'konva';

interface RenderOptions {
	pixelRatio?: number;
	padding?: number;
	background?: string | null;
}

export interface RenderResult {
	canvas: HTMLCanvasElement;
	dataUrl: string;
	width: number;
	height: number;
}

export function defaultFileName() {
	const ts = new Date().toISOString().slice(0, 19).replaceAll(':', '-');
	return `sketchnest-${ts}.png`;
}

export function renderStagePng(
	stage: Konva.Stage,
	{ pixelRatio = 2, padding = 16, background = null }: RenderOptions = {},
): RenderResult | null {
	const layer = stage.getLayers()[0];
	if (!layer) return null;

	const scale = stage.scale();
	const position = stage.position();
	const size = stage.size();

	stage.scale({ x: 1, y: 1 });
	stage.position({ x: 0, y: 0 });
	const box = layer.getClientRect();
	let result: RenderResult | null = null;

	if (box.width > 0 && box.height > 0) {
		const width = Math.ceil(box.width + padding * 2);
		const height = Math.ceil(box.height + padding * 2);

		stage.size({ width, height });
		stage.position({ x: padding - box.x, y: padding - box.y });

		const rendered = stage.toCanvas({
			x: 0,
			y: 0,
			width,
			height,
			pixelRatio,
		});

		let canvas = rendered;
		if (background) {
			canvas = document.createElement('canvas');
			canvas.width = rendered.width;
			canvas.height = rendered.height;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.fillStyle = background;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(rendered, 0, 0);
			}
		}

		result = {
			canvas,
			dataUrl: canvas.toDataURL('image/png'),
			width: canvas.width,
			height: canvas.height,
		};
	}

	stage.size(size);
	stage.scale(scale);
	stage.position(position);
	return result;
}

export function downloadDataUrl(dataUrl: string, fileName = defaultFileName()) {
	const link = document.createElement('a');
	link.download = fileName;
	link.href = dataUrl;
	link.click();
}

export async function copyCanvasToClipboard(
	canvas: HTMLCanvasElement,
): Promise<void> {
	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, 'image/png'),
	);
	if (!blob) throw new Error('Failed to encode PNG for clipboard');
	await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
