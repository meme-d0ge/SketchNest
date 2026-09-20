export const TRANSPARENT = 'transparent';

export interface ColorPreset {
	value: string;
	label: string;
}

export const STROKE_PRESETS: ColorPreset[] = [
	{ value: '#1e1e1e', label: 'Black' },
	{ value: '#e03131', label: 'Red' },
	{ value: '#2f9e44', label: 'Green' },
	{ value: '#1971c2', label: 'Blue' },
	{ value: '#f08c00', label: 'Orange' },
];

export const STROKE_PALETTE: ColorPreset[] = [
	...STROKE_PRESETS,
	{ value: '#343a40', label: 'Dark gray' },
	{ value: '#868e96', label: 'Gray' },
	{ value: '#ffffff', label: 'White' },
	{ value: '#c2255c', label: 'Pink' },
	{ value: '#9c36b5', label: 'Grape' },
	{ value: '#6741d9', label: 'Violet' },
	{ value: '#3b5bdb', label: 'Indigo' },
	{ value: '#0c8599', label: 'Cyan' },
	{ value: '#66a80f', label: 'Lime' },
	{ value: '#e8590c', label: 'Pumpkin' },
];

export const BACKGROUND_PRESETS: ColorPreset[] = [
	{ value: TRANSPARENT, label: 'Transparent' },
	{ value: '#ffa8a8', label: 'Red' },
	{ value: '#8ce99a', label: 'Green' },
	{ value: '#74c0fc', label: 'Blue' },
	{ value: '#ffe066', label: 'Yellow' },
];

export const BACKGROUND_PALETTE: ColorPreset[] = [
	...BACKGROUND_PRESETS,
	{ value: '#eebefa', label: 'Grape' },
	{ value: '#b197fc', label: 'Violet' },
	{ value: '#91a7ff', label: 'Indigo' },
	{ value: '#66d9e8', label: 'Cyan' },
	{ value: '#c0eb75', label: 'Lime' },
	{ value: '#ffc078', label: 'Orange' },
	{ value: '#ced4da', label: 'Gray' },
	{ value: '#ffffff', label: 'White' },
	{ value: '#ff8787', label: 'Coral' },
	{ value: '#63e6be', label: 'Teal' },
];

export interface StrokeWidthPreset {
	value: number;
	label: string;
	bar: number;
}

export const STROKE_WIDTH_PRESETS: StrokeWidthPreset[] = [
	{ value: 2, label: 'Thin', bar: 2 },
	{ value: 4, label: 'Bold', bar: 4 },
	{ value: 8, label: 'Extra bold', bar: 7 },
];
