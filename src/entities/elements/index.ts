export type {
	BoardElement,
	BoardElementCreate,
} from './interfaces/board-element.ts';
export {
	BoardElementCreateSchema,
	BoardElementSchema,
	BoardElementUpdateSchema,
} from './interfaces/board-element.ts';
export type { Bounds } from './interfaces/bounds.ts';
export type { ElementType } from './interfaces/element-type-variant.ts';
export {
	ElementsEnum,
	ElementTypeSchema,
} from './interfaces/element-type-variant.ts';
export type {
	EllipseElement,
	EllipseElementCreate,
} from './interfaces/ellipse-element.ts';
export {
	EllipseElementCreateSchema,
	EllipseElementSchema,
} from './interfaces/ellipse-element.ts';
export type {
	LineElement,
	LineElementCreate,
} from './interfaces/line-element.ts';
export {
	LineElementCreateSchema,
	LineElementSchema,
} from './interfaces/line-element.ts';
export type {
	RectElement,
	RectElementCreate,
} from './interfaces/rect-element.ts';
export {
	RectElementCreateSchema,
	RectElementSchema,
} from './interfaces/rect-element.ts';
export type { ShapeBox } from './interfaces/shape-element.ts';
export { ShapeBoxSchema } from './interfaces/shape-element.ts';
export { getDistanceToBoardElement } from './lib/getDistanceToBoardElement';
export { ElementsStore } from './model/ElementsStore.ts';
export { InteractiveStore } from './model/InteractiveStore.ts';
export { REMOVE_ELEMENT_VERSION } from './model/statuses.ts';
export { EllipseComponent } from './ui/EllipseComponent.tsx';
export { LineComponent } from './ui/LineComponent.tsx';

export { RectComponent } from './ui/RectComponent.tsx';
