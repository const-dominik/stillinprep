"use client";

import styles from "./styles.module.scss";
import { initialBoard, pieceAssets } from "@/app/utils";
import type { Chessboard, PiecePosition, Player } from "@/app/types";
import { Pieces } from "@/app/types";
import { MovesTree } from "@/app/_components/chessboard/MovesTree";
import Image from "next/image";
import { useState } from "react";
import { getLegalMoves } from "./chessLogic";

type SquareProps = {
    x: number;
    y: number;
    piece: Pieces;
    isSelected: boolean;
    isMoveLegal: boolean;
    onClick: (x: number, y: number) => void;
};

const Chessboard = () => {
    const [board, setBoard] = useState(initialBoard);
    const [movesTree, setMovesTree] = useState<MovesTree>(new MovesTree());
    const [currentPiece, setCurrentPiece] = useState<PiecePosition | null>(
        null
    );
    const [selectedPiece, setSelectedPiece] = useState<Player>("white");

    const resetBoard = () => {
        setBoard(initialBoard);
        setCurrentPiece(null);
        setSelectedPiece("white");
        setMovesTree(new MovesTree());
    };

    const switchPlayer = (player: Player): Player => {
        return player === "white" ? "black" : "white";
    };

    const isMoveLegal = (
        endPosition: PiecePosition,
        movesTree: MovesTree
    ): boolean => {
        const legalMoves = getLegalMoves(
            board,
            currentPiece,
            selectedPiece,
            movesTree
        );
        return !!legalMoves.find(
            ([y, x]) => y === endPosition[0] && x === endPosition[1]
        );
    };

    const handleSquareClick = (x: number, y: number) => {
        if (currentPiece === null) {
            if (board[y][x] === Pieces.EMPTY) return;
            setCurrentPiece([y, x]);
        } else if (currentPiece[0] === y && currentPiece[1] === x) {
            setCurrentPiece(null);
        } else {
            if (isMoveLegal([y, x], movesTree)) {
                const [currentY, currentX] = currentPiece;
                const newBoard = board.map((row) => [...row]);
                newBoard[y][x] = board[currentY][currentX];
                newBoard[currentY][currentX] = Pieces.EMPTY;
                movesTree.addMove(newBoard[y][x], currentPiece, [y, x]);
                if (
                    [Pieces.BLACK_KING, Pieces.WHITE_KING].includes(
                        board[currentY][currentX]
                    ) &&
                    Math.abs(currentX - x) === 2
                ) {
                    console.log("szarada");
                    newBoard[y][x === 2 ? 0 : 7] = Pieces.EMPTY;
                    newBoard[y][x === 2 ? 3 : 5] =
                        y === 0 ? Pieces.BLACK_ROOK : Pieces.WHITE_ROOK;
                }

                setBoard(newBoard);
                setSelectedPiece(switchPlayer(selectedPiece));
            }
            setCurrentPiece(null);
        }
    };

    return (
        <div className={styles.board}>
            <div className={styles.infobar}>
                <span>It&apos;s {selectedPiece}s turn.</span>
                <span onClick={() => resetBoard()} className={styles.pointer}>
                    Reset board.
                </span>
            </div>
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
                                isMoveLegal={
                                    !!currentPiece &&
                                    isMoveLegal([y, x], movesTree)
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

const Square = ({
    x,
    y,
    piece,
    isSelected,
    isMoveLegal,
    onClick,
}: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const classes = [];
    classes.push(isDark ? styles.dark : styles.light);
    if (isSelected) {
        classes.push(styles.selected);
    }
    if (isMoveLegal) {
        classes.push(styles.legalmove);
    }

    return (
        <div className={classes.join(" ")} onClick={() => onClick(x, y)}>
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
