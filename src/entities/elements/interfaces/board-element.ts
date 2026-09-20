import * as z from 'zod/v4';

import {
	EllipseElementCreateSchema,
	EllipseElementInteractiveSchema,
	EllipseElementSchema,
	EllipseElementUpdateSchema,
} from './ellipse-element.ts';
import {
	LineElementCreateSchema,
	LineElementInteractiveSchema,
	LineElementSchema,
	LineElementUpdateSchema,
} from './line-element.ts';
import {
	RectElementCreateSchema,
	RectElementInteractiveSchema,
	RectElementSchema,
	RectElementUpdateSchema,
} from './rect-element.ts';

export const BoardElementSchema = z.discriminatedUnion('type', [
	LineElementSchema,
	EllipseElementSchema,
	RectElementSchema,
]);
export type BoardElement = z.infer<typeof BoardElementSchema>;

export const BoardElementCreateSchema = z.discriminatedUnion('type', [
	LineElementCreateSchema,
	EllipseElementCreateSchema,
	RectElementCreateSchema,
]);
export type BoardElementCreate = z.infer<typeof BoardElementCreateSchema>;

export const BoardElementUpdateSchema = z.union([
	LineElementUpdateSchema,
	EllipseElementUpdateSchema,
	RectElementUpdateSchema,
]);
export type BoardElementUpdate = z.infer<typeof BoardElementUpdateSchema>;

export const BoardElementInteractiveSchema = z.discriminatedUnion('type', [
	LineElementInteractiveSchema,
	RectElementInteractiveSchema,
	EllipseElementInteractiveSchema,
]);
export type BoardElementInteractive = z.infer<
	typeof BoardElementInteractiveSchema
>;
