export type {
	BoardElement,
	BoardElementDraft,
} from './interfaces/board-element.ts';
export {
	BoardElementDraftSchema,
	BoardElementSchema,
} from './interfaces/board-element.ts';
export type { Bounds } from './interfaces/bounds.ts';
export type { ElementType } from './interfaces/element-type-variant.ts';
export {
	ElementsEnum,
	ElementTypeSchema,
} from './interfaces/element-type-variant.ts';
export type {
	EllipseElement,
	EllipseElementDraft,
} from './interfaces/ellipse-element.ts';
export {
	EllipseElementDraftSchema,
	EllipseElementSchema,
} from './interfaces/ellipse-element.ts';
export type {
	LineElement,
	LineElementDraft,
} from './interfaces/line-element.ts';
export {
	LineElementDraftSchema,
	LineElementSchema,
} from './interfaces/line-element.ts';
export type {
	RectElement,
	RectElementDraft,
} from './interfaces/rect-element.ts';
export {
	RectElementDraftSchema,
	RectElementSchema,
} from './interfaces/rect-element.ts';
export type { ShapeBox } from './interfaces/shape-element.ts';
export { ShapeBoxSchema } from './interfaces/shape-element.ts';
export { getDistanceToBoardElement } from './lib/getDistanceToBoardElement';
export { ElementsStore } from './model/ElementsStore.ts';
export { InteractiveStore } from './model/InteractiveStore.ts';
export { EllipseComponent } from './ui/EllipseComponent.tsx';
export { LineComponent } from './ui/LineComponent.tsx';

export { RectComponent } from './ui/RectComponent.tsx';
