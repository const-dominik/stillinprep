"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import Image from "next/image";
import styles from "./styles/Chessboard.module.scss";

import { Pieces } from "@/lib/types/types";
import { pieceAssets } from "@/lib/utils";
import { useId, useState } from "react";
import { useChessboard } from "./logic/useChessboard";

const Chessboard = () => {
    const {
        board,
        color,
        renderSquare,
        changeSelectedPiece,
        handleSquareClick,
    } = useChessboard();
    const [draggedPiece, setDraggedPiece] = useState<Pieces | null>(null);

    const handleDragStart = (e: DragStartEvent) => {
        const data = e.active.data.current;
        if (!data) return;

        const piece = board[data.fromY][data.fromX];
        setDraggedPiece(piece);
        changeSelectedPiece([data.fromY, data.fromX]);
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const data = e.over?.data.current;
        if (!data) return;

        handleSquareClick(data.toX, data.toY);
        changeSelectedPiece(null);
        setDraggedPiece(null);
    };

    const sensors = useSensor(PointerSensor, {
        activationConstraint: { distance: 0 },
    });

    return (
        <DndContext
            id={useId()}
            sensors={[sensors]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
        >
            <div className={styles.board}>
                {board.map((row, rowIndex) => {
                    const y = color === "black" ? 7 - rowIndex : rowIndex;
                    return (
                        <div className={styles.row} key={rowIndex}>
                            {row.map((_, colIndex) => {
                                const x =
                                    color === "black" ? 7 - colIndex : colIndex;
                                return renderSquare(x, y);
                            })}
                        </div>
                    );
                })}
            </div>

            <DragOverlay
                adjustScale={false}
                modifiers={[snapCenterToCursor]}
                dropAnimation={null}
            >
                {draggedPiece && (
                    <Image
                        src={pieceAssets[draggedPiece]}
                        alt="dragging"
                        width={70}
                        height={70}
                        style={{ cursor: "grabbing" }}
                        draggable={false}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default Chessboard;
