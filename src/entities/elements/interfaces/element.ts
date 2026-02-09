import type { EllipseElement, EllipseElementDraft } from './ellipse-element.ts';
import type { LineElement, LineElementDraft } from './line-element.ts';
import type { RectElement, RectElementDraft } from './rect-element.ts';

export type BoardElement = LineElement | EllipseElement | RectElement;
export type BoardElementOptionalId =
	| LineElementDraft
	| EllipseElementDraft
	| RectElementDraft;
