import type { SquareElement } from '@/entities/elements';
import type { CircleElement } from '@/entities/elements/interfaces/circle-element.ts';
import type { LineElement } from '@/entities/elements/interfaces/line-element.ts';
export type BoardElement = LineElement | CircleElement | SquareElement;
