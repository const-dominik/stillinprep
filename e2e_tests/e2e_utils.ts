import { PiecePosition } from "@/app/types";

export const getSquareSelector = (position: PiecePosition) =>
    `div:nth-child(${position[0] + 1}) > div:nth-child(${position[1] + 1})`;
