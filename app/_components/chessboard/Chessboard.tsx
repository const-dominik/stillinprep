"use client";

import styles from "./styles.module.scss";
import { initialBoard, pieceAssets } from "@/app/utils";
import type { Chessboard, PiecePosition } from "@/app/types";
import { Pieces } from "@/app/types";
import Image from "next/image";
import { useState } from "react";

type SquareProps = {
    x: number;
    y: number;
    piece: Pieces;
    isSelected: boolean;
    onClick: (x: number, y: number) => void;
};

const getLegalMoves = (
    board: Chessboard,
    position: PiecePosition
): PiecePosition[] => {
    const [y, x] = position;
    const piece = board[y][x]; // eslint-disable-line

    return [[0, 0]];
};

const isMoveLegal = (
    board: Chessboard,
    startPosition: PiecePosition,
    endPosition: PiecePosition
): boolean => {
    const legalMoves = getLegalMoves(board, startPosition);
    return !!legalMoves.find(
        ([y, x]) => y === endPosition[0] && x === endPosition[1]
    );
};

const Chessboard = () => {
    const [board, setBoard] = useState(initialBoard);
    const [currentPiece, setCurrentPiece] = useState<PiecePosition | null>(
        null
    );

    const handleSquareClick = (x: number, y: number) => {
        if (currentPiece === null) {
            if (board[y][x] === Pieces.EMPTY) return;
            setCurrentPiece([y, x]);
        } else if (currentPiece[0] === y && currentPiece[1] === x) {
            setCurrentPiece(null);
        } else {
            if (isMoveLegal(board, currentPiece, [y, x])) {
                const [currentY, currentX] = currentPiece;
                const newBoard = board.map((row) => [...row]);
                newBoard[y][x] = board[currentY][currentX];
                newBoard[currentY][currentX] = Pieces.EMPTY;

                setBoard(newBoard);
            }
            setCurrentPiece(null);
        }
    };

    return (
        <div className={styles.board}>
            {board.map((row, y) => (
                <div className={styles.row} key={y}>
                    {row.map((piece, x) => {
                        return (
                            <Square
                                x={x}
                                y={y}
                                piece={piece}
                                isSelected={
                                    !!currentPiece &&
                                    currentPiece[0] === y &&
                                    currentPiece[1] === x
                                }
                                onClick={handleSquareClick}
                                key={`${x}${y}`}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

const Square = ({ x, y, piece, isSelected, onClick }: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const squareClass = isDark ? styles.dark : styles.light;
    const selectionClass = isSelected ? styles.selected : "";

    return (
        <div
            className={[squareClass, selectionClass].join(" ")}
            onClick={() => onClick(x, y)}
        >
            {piece !== Pieces.EMPTY && (
                <Image
                    src={pieceAssets[piece]}
                    alt="piece"
                    width={70}
                    height={70}
                />
            )}
        </div>
    );
};

export default Chessboard;
