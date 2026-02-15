export type {
	BoardElement,
	BoardElementDraft,
} from '@/entities/elements/interfaces/board-element.ts';
export {
	BoardElementDraftSchema,
	BoardElementSchema,
} from '@/entities/elements/interfaces/board-element.ts';
export type {
	EllipseElement,
	EllipseElementDraft,
} from '@/entities/elements/interfaces/ellipse-element.ts';
export {
	EllipseElementDraftSchema,
	EllipseElementSchema,
} from '@/entities/elements/interfaces/ellipse-element.ts';
export type {
	LineElement,
	LineElementDraft,
} from '@/entities/elements/interfaces/line-element.ts';
export {
	LineElementDraftSchema,
	LineElementSchema,
} from '@/entities/elements/interfaces/line-element.ts';
export { EllipseComponent } from './components/EllipseComponent.tsx';
export { LineComponent } from './components/LineComponent.tsx';
export { RectComponent } from './components/RectComponent.tsx';
export type { ElementType } from './interfaces/element-type-variant.ts';

export { ElementTypeSchema } from './interfaces/element-type-variant.ts';
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
export { ElementsStore } from './model/ElementsStore.ts';
export { InteractiveStore } from './model/InteractiveStore.ts';
