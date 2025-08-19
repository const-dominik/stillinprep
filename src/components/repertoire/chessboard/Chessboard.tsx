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

import { usePosition } from "@/lib/context/current-position/PositionContext";
import { Pieces, Puzzle, PuzzleFeedback } from "@/lib/types/types";
import { pieceAssets } from "@/lib/utils";
import { useId, useState } from "react";
import { useChessboard } from "./logic/useChessboard";

const Chessboard = ({
    mode,
    feedbackFunction,
    puzzleTree,
    feedback,
    isPublic,
}: {
    mode?: "puzzle" | "regular";
    feedbackFunction?: (feedback: PuzzleFeedback, nodeId?: string) => void;
    puzzleTree?: Puzzle;
    feedback?: PuzzleFeedback;
    isPublic?: boolean;
}) => {
    const {
        board,
        color,
        renderSquare,
        changeSelectedPiece,
        handleSquareClick,
    } = useChessboard(mode, feedbackFunction, puzzleTree, feedback);

    const [draggedPiece, setDraggedPiece] = useState<Pieces | null>(null);
    const { currentNode, lastNode } = usePosition();
    const handleDragStart = (e: DragStartEvent) => {
        if (
            feedback &&
            (feedback === "done" ||
                feedback === "correct" ||
                currentNode !== lastNode)
        )
            return;
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
            <div>
                {isPublic && (
                    <p className={styles["public-info"]}>
                        This is a public repertoire. Feel free to explore, but
                        changes won&apos;t be saved.
                    </p>
                )}
                <div className={styles.board}>
                    {board.map((row, rowIndex) => {
                        const y = color === "black" ? 7 - rowIndex : rowIndex;
                        return (
                            <div className={styles.row} key={rowIndex}>
                                {row.map((_, colIndex) => {
                                    const x =
                                        color === "black"
                                            ? 7 - colIndex
                                            : colIndex;
                                    return renderSquare(x, y);
                                })}
                            </div>
                        );
                    })}
                </div>
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
                        width={0}
                        height={0}
                        sizes="5vw"
                        style={{
                            width: "80%",
                            height: "auto",
                            cursor: "grabbing",
                        }}
                        draggable={false}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default Chessboard;
