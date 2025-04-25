"use client";

import { Dispatch, SetStateAction, useState } from "react";

import styles from "./styles.module.scss";

import {
    getCurrentPlayerPieces,
    getOppositePlayer,
    includesMove,
} from "@/app/utils";
import type { Chessboard, PiecePosition, MoveType } from "@/app/types";
import { Pieces } from "@/app/types";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";

import {
    getLegalMoves,
    isMate,
    isMoveLegal,
    makeMove,
} from "./utils/chessLogic";

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
    const [legalMovesForPiece, setLegalMovesForPiece] = useState<
        [PiecePosition, MoveType][]
    >([]);

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
            ) {
                setLegalMovesForPiece([]);
                return;
            }
            setSelectedPiece([y, x]);
            const legalMoves = getLegalMoves(currentNode, [y, x]);
            setLegalMovesForPiece(legalMoves);
        } else if (selectedPiece[0] === y && selectedPiece[1] === x) {
            setSelectedPiece(null);
            setLegalMovesForPiece([]);
        } else {
            if (includesMove(legalMovesForPiece, [y, x])) {
                const move = legalMovesForPiece.find(
                    ([pos]) => pos[0] === y && pos[1] === x
                );
                let promotingTo = Pieces.EMPTY;

                if (!move) throw new Error("Shouldn't happen");

                if (move[1] === "promotion") {
                    /// === to daj jakieś okienko zwracające bierke, na razie tylko krórówki
                    if (
                        board[selectedPiece[0]][selectedPiece[1]] ===
                        Pieces.BLACK_PAWN
                    )
                        promotingTo = Pieces.BLACK_QUEEN;
                    if (
                        board[selectedPiece[0]][selectedPiece[1]] ===
                        Pieces.WHITE_PAWN
                    )
                        promotingTo = Pieces.WHITE_QUEEN;
                }

                const newBoard = makeMove(
                    board,
                    selectedPiece,
                    [y, x],
                    move[1],
                    promotingTo
                );

                const newMove = currentNode.addMove(
                    newBoard[y][x],
                    selectedPiece,
                    [y, x],
                    newBoard
                );

                setCurrentNode(newMove);
                setLastNode(newMove);
                setSelectedPiece(null);
                setLegalMovesForPiece([]);

                const matedKing = isMate(currentNode);
                if (matedKing !== Pieces.EMPTY) {
                    console.log(
                        "Mate! %s wins!",
                        matedKing === Pieces.BLACK_KING ? "White" : "Black"
                    );
                }
            } else if (currentPlayerPieces.includes(board[y][x])) {
                setSelectedPiece([y, x]);
                const legalMoves = getLegalMoves(currentNode, [y, x]);
                setLegalMovesForPiece(legalMoves);
            } else {
                setSelectedPiece(null);
                setLegalMovesForPiece([]);
            }
        }
    };

    return (
        <div className={styles.board}>
            {board.map((row, y) => (
                <div className={styles.row} key={y}>
                    {row.map((piece, x) => (
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
                                isMoveLegal(currentNode, selectedPiece, [y, x])
                            }
                            isPieceOnSquare={
                                !!selectedPiece && board[y][x] !== Pieces.EMPTY
                            }
                            onClick={handleSquareClick}
                            key={`${x}${y}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Chessboard;
