import * as z from 'zod/v4';

import {
	EllipseElementDraftSchema,
	EllipseElementSchema,
} from './ellipse-element.ts';
import { LineElementDraftSchema, LineElementSchema } from './line-element.ts';
import { RectElementDraftSchema, RectElementSchema } from './rect-element.ts';

export const BoardElementSchema = z.union([
	LineElementSchema,
	EllipseElementSchema,
	RectElementSchema,
]);
export type BoardElement = z.infer<typeof BoardElementSchema>;

export const BoardElementDraftSchema = z.union([
	LineElementDraftSchema,
	EllipseElementDraftSchema,
	RectElementDraftSchema,
]);
export type BoardElementDraft = z.infer<typeof BoardElementDraftSchema>;
