"use client";

import { Pieces, Player } from "@/lib/types/types";
import { getCurrentPlayerPieces, pieceAssets } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { getSquareClasses } from "./logic";
import styles from "./styles/Square.module.scss";

type SquareProps = {
    x: number;
    y: number;
    piece: Pieces;
    isSelected: boolean;
    isMoveLegal: boolean;
    isPieceOnSquare: boolean;
    isChecked: boolean;
    promotionData: [boolean, boolean];
    currentPlayer: Player;
    onMouseDown: (x: number, y: number) => void;
};

const Square = ({
    x,
    y,
    piece,
    isSelected,
    isMoveLegal,
    isPieceOnSquare,
    isChecked,
    promotionData: [promoting, isChoosable],
    currentPlayer,
    onMouseDown,
}: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const currentPlayerPieces = getCurrentPlayerPieces(currentPlayer);
    const isCurrentPlayerPiece = currentPlayerPieces.includes(piece);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `${x}-${y}`,
        data: { fromX: x, fromY: y },
        disabled: !isCurrentPlayerPiece,
    });

    const { setNodeRef: setNodeRefDrop, isOver } = useDroppable({
        id: `${x}-${y}`,
        data: { toX: x, toY: y },
    });

    const classes = getSquareClasses(
        isDark,
        promoting,
        isChoosable,
        isMoveLegal,
        isPieceOnSquare,
        isChecked,
        isOver,
        isSelected
    );

    return (
        <div
            className={classes.join(" ")}
            onMouseDown={() => onMouseDown(x, y)}
            ref={setNodeRefDrop}
        >
            {promoting && !isChoosable && <div className={styles.overlay} />}
            {piece !== Pieces.EMPTY && (
                <div
                    ref={setNodeRef}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                    {...listeners}
                    {...attributes}
                >
                    <Image
                        src={pieceAssets[piece]}
                        alt="piece"
                        width={70}
                        height={70}
                        draggable={false}
                    />
                </div>
            )}
        </div>
    );
};

export default Square;
