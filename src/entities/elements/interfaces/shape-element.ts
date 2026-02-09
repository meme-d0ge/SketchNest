import type { Bounds } from '@/shared/types/shape.ts';

export interface ShapeBox extends Bounds {
	ownerId: string;
}
