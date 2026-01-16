import type {
	EllipseElement,
	EllipseElementOptionId,
} from './ellipse-element.ts';
import type { LineElement, LineElementOptionId } from './line-element.ts';
import type { RectElement, RectElementOptionId } from './rect-element.ts';

export type BoardElement = LineElement | EllipseElement | RectElement;
export type BoardElementOptionalId =
	| LineElementOptionId
	| EllipseElementOptionId
	| RectElementOptionId;
