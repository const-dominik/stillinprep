"use client";

import { Dispatch, SetStateAction, useState } from "react";

import styles from "./styles.module.scss";

import {
    copyBoard,
    getCurrentPlayerPieces,
    getOppositePlayer,
} from "@/app/utils";
import type { Chessboard, PiecePosition } from "@/app/types";
import { Pieces } from "@/app/types";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";

import { isMate, isMoveLegal } from "./utils/chessLogic";

import Square from "./Square";

const Chessboard = ({
    currentNode,
    setCurrentNode,
    setLastNode,
}: {
    currentNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
    setLastNode: Dispatch<SetStateAction<MovesTreeNode>>;
}) => {
    const [selectedPiece, setSelectedPiece] = useState<PiecePosition | null>(
        null
    );
    const board = currentNode.board;
    const currentPlayer = getOppositePlayer(currentNode.player);

    const currentPlayerPieces = getCurrentPlayerPieces(currentPlayer);
    const oppositePlayerPieces = getCurrentPlayerPieces(
        getOppositePlayer(currentPlayer)
    );

    const handleSquareClick = (x: number, y: number) => {
        if (selectedPiece === null) {
            if (
                board[y][x] === Pieces.EMPTY ||
                oppositePlayerPieces.includes(board[y][x])
            )
                return;
            setSelectedPiece([y, x]);
        } else if (selectedPiece[0] === y && selectedPiece[1] === x) {
            setSelectedPiece(null);
        } else {
            const isLegal = isMoveLegal(
                board,
                selectedPiece,
                currentPlayer,
                [y, x],
                currentNode
            );
            if (isLegal) {
                const [currentY, currentX] = selectedPiece;

                const newBoard = copyBoard(board);
                newBoard[y][x] = newBoard[currentY][currentX];
                newBoard[currentY][currentX] = Pieces.EMPTY;

                const newMove = currentNode.addMove(
                    newBoard[y][x],
                    selectedPiece,
                    [y, x],
                    newBoard
                );

                setCurrentNode(newMove);
                setLastNode(newMove);

                const michaelCondition =
                    [Pieces.BLACK_KING, Pieces.WHITE_KING].includes(
                        board[currentY][currentX]
                    ) && Math.abs(currentX - x) === 2;

                if (michaelCondition) {
                    board[y][x === 2 ? 0 : 7] = Pieces.EMPTY;
                    board[y][x === 2 ? 3 : 5] =
                        y === 0 ? Pieces.BLACK_ROOK : Pieces.WHITE_ROOK;
                }

                const matedKing = isMate(board, currentNode);
                if (matedKing !== Pieces.EMPTY) {
                    console.log(
                        "Mate! %s wins!",
                        matedKing === Pieces.BLACK_KING ? "White" : "Black"
                    );
                }
            }
            if (currentPlayerPieces.includes(board[y][x])) {
                setSelectedPiece([y, x]);
            } else {
                setSelectedPiece(null);
            }
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
                                    !!selectedPiece &&
                                    selectedPiece[0] === y &&
                                    selectedPiece[1] === x
                                }
                                isMoveLegal={
                                    !!selectedPiece &&
                                    isMoveLegal(
                                        board,
                                        selectedPiece,
                                        currentPlayer,
                                        [y, x],
                                        currentNode
                                    )
                                }
                                isPieceOnSquare={
                                    !!selectedPiece &&
                                    board[y][x] !== Pieces.EMPTY
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
