import { PiecePosition } from "@/app/types/types";

export const getSquareSelector = (position: PiecePosition) =>
    `div[class*="board"] div:nth-child(${position[0] + 1}) > div:nth-child(${position[1] + 1})`;
