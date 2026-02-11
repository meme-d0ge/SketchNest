import * as z from 'zod/v4';

export const ElementsEnum = {
    Line: 'line',
    Ellipse: 'ellipse',
    Rect: 'rect'
} as const;

export const ElementTypeSchema = z.enum(ElementsEnum);
export type ElementType = z.infer<typeof ElementTypeSchema>;