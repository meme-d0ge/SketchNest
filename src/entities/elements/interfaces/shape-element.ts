// import type {BoardElement} from "@/entities/elements";

export interface ShapeBox {
    maxY: number;
    minY: number;
    maxX: number;
    minX: number;

    ownerId: string;
}