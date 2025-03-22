"use client";

import { useState } from "react";

import styles from "./styles.module.scss";

import { copyBoard, initialBoard, getCurrentPlayerPieces } from "@/app/utils";
import type { Chessboard, PiecePosition, Player } from "@/app/types";
import { Pieces } from "@/app/types";
import { MovesTree } from "@/app/_components/chessboard/utils/MovesTree";

import { getLegalMoves, isMate } from "./utils/chessLogic";

import Square from "./Square";

const Chessboard = () => {
    const [board, setBoard] = useState(initialBoard);
    const [movesTree, setMovesTree] = useState<MovesTree>(new MovesTree());
    const [currentPiece, setCurrentPiece] = useState<PiecePosition | null>(
        null
    );
    const [currentPlayer, setCurrentPlayer] = useState<Player>("white");

    const resetBoard = () => {
        setBoard(initialBoard);
        setCurrentPiece(null);
        setCurrentPlayer("white");
        setMovesTree(new MovesTree());
    };

    const getOppositePlayer = (player: Player): Player => {
        return player === "white" ? "black" : "white";
    };

    const isMoveLegal = (
        endPosition: PiecePosition,
        movesTree: MovesTree
    ): boolean => {
        const legalMoves = getLegalMoves(
            board,
            currentPiece,
            currentPlayer,
            movesTree
        );
        return !!legalMoves.find(
            ([y, x]) => y === endPosition[0] && x === endPosition[1]
        );
    };

    const handleSquareClick = (x: number, y: number) => {
        if (currentPiece === null) {
            if (
                board[y][x] === Pieces.EMPTY ||
                getCurrentPlayerPieces(
                    getOppositePlayer(currentPlayer)
                ).includes(board[y][x])
            )
                return;
            setCurrentPiece([y, x]);
        } else if (currentPiece[0] === y && currentPiece[1] === x) {
            setCurrentPiece(null);
        } else {
            if (isMoveLegal([y, x], movesTree)) {
                const [currentY, currentX] = currentPiece;
                const newBoard = copyBoard(board);

                newBoard[y][x] = board[currentY][currentX];
                newBoard[currentY][currentX] = Pieces.EMPTY;

                movesTree.addMove(newBoard[y][x], currentPiece, [y, x], board);
                if (
                    [Pieces.BLACK_KING, Pieces.WHITE_KING].includes(
                        board[currentY][currentX]
                    ) &&
                    Math.abs(currentX - x) === 2
                ) {
                    newBoard[y][x === 2 ? 0 : 7] = Pieces.EMPTY;
                    newBoard[y][x === 2 ? 3 : 5] =
                        y === 0 ? Pieces.BLACK_ROOK : Pieces.WHITE_ROOK;
                }

                setBoard(newBoard);
                setCurrentPlayer(getOppositePlayer(currentPlayer));

                const matedKing = isMate(newBoard, movesTree);
                if (matedKing !== Pieces.EMPTY) {
                    console.log(
                        "Mate! %s wins!",
                        matedKing === Pieces.BLACK_KING ? "White" : "Black"
                    );
                }
            }
            setCurrentPiece(null);
        }
    };

    return (
        <div className={styles.board}>
            <div className={styles.infobar}>
                <span>It&apos;s {currentPlayer}s turn.</span>
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

export default Chessboard;
