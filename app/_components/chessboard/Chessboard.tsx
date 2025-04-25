"use client";

import { Dispatch, SetStateAction, useState } from "react";

import styles from "./styles.module.scss";

import {
    getCurrentPlayerPieces,
    getOppositePlayer,
    includesMove,
    whitePromotionPieces,
    blackPromotionPieces,
} from "@/app/utils";
import type { Chessboard, PiecePosition, MoveType } from "@/app/types";
import { Pieces } from "@/app/types";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";

import { getLegalMoves, isMoveLegal, makeMove } from "./utils/chessLogic";

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
    const [selectedPieceData, setSelectedPieceData] = useState<{
        position: PiecePosition | null;
        legalMoves: [PiecePosition, MoveType][];
    }>({ position: null, legalMoves: [] });
    const [pendingPromotion, setPendingPromotion] = useState<{
        from: PiecePosition;
        to: PiecePosition;
        type: "promotion";
    } | null>(null);

    const handleChangeSelectedPiece = (newPosition: PiecePosition | null) => {
        if (!newPosition) {
            setSelectedPieceData({ position: null, legalMoves: [] });
            return;
        }
        const legalMoves = getLegalMoves(currentNode, newPosition);
        setSelectedPieceData({ position: newPosition, legalMoves });
    };

    const getPendingPromotionSquares = ():
        | [PiecePosition, Pieces][]
        | undefined => {
        if (!pendingPromotion) return;

        const [y, x] = pendingPromotion.to;

        if (currentPlayer === "white") {
            return whitePromotionPieces
                .toReversed()
                .map((piece, index) => [[y + index, x], piece]);
        }

        return blackPromotionPieces
            .toReversed()
            .map((piece, index) => [[y - index, x], piece]);
    };

    const board = currentNode.board;
    const currentPlayer = getOppositePlayer(currentNode.player);
    const selectedPiece = selectedPieceData.position;
    const legalMovesForPiece = selectedPieceData.legalMoves;

    const isChecked = currentNode.isCheck();

    const currentPlayerPieces = getCurrentPlayerPieces(currentPlayer);
    const oppositePlayerPieces = getCurrentPlayerPieces(
        getOppositePlayer(currentPlayer)
    );

    const handleSquareClick = (x: number, y: number) => {
        const clickedPiece = board[y][x];
        const isSameSquare =
            selectedPiece?.[0] === y && selectedPiece?.[1] === x;

        const isEmptyOrOpponent =
            clickedPiece === Pieces.EMPTY ||
            oppositePlayerPieces.includes(clickedPiece);

        const isOwnPiece = currentPlayerPieces.includes(clickedPiece);

        if (!selectedPiece) {
            if (!isEmptyOrOpponent) handleChangeSelectedPiece([y, x]);
            return;
        }

        if (isSameSquare) {
            handleChangeSelectedPiece(null);
            return;
        }

        if (includesMove(legalMovesForPiece, [y, x])) {
            const move = legalMovesForPiece.find(
                ([pos]) => pos[0] === y && pos[1] === x
            );
            if (!move)
                throw new Error("Move is undefined, which is unexpected");

            if (move[1] === "promotion") {
                setPendingPromotion({
                    from: selectedPiece,
                    to: [y, x],
                    type: "promotion",
                });
                return;
            }

            const newBoard = makeMove(
                board,
                selectedPiece,
                [y, x],
                move[1],
                Pieces.EMPTY
            );

            const newMove = currentNode.addMove(
                newBoard[y][x],
                selectedPiece,
                [y, x],
                newBoard
            );

            setCurrentNode(newMove);
            setLastNode(newMove);
            handleChangeSelectedPiece(null);
        } else {
            handleChangeSelectedPiece(isOwnPiece ? [y, x] : null);
        }
    };

    const handlePromotion = (promotedTo: Pieces) => {
        if (!pendingPromotion) return;
        const newBoard = makeMove(
            board,
            pendingPromotion.from,
            pendingPromotion.to,
            "promotion",
            promotedTo
        );

        const newMove = currentNode.addMove(
            promotedTo,
            pendingPromotion.from,
            pendingPromotion.to,
            newBoard
        );

        setCurrentNode(newMove);
        setLastNode(newMove);
        handleChangeSelectedPiece(null);
        setPendingPromotion(null);
    };

    return (
        <div className={styles.board}>
            {board.map((row, y) => (
                <div className={styles.row} key={y}>
                    {row.map((piece, x) => {
                        const key = `${x}${y}`;

                        if (!pendingPromotion) {
                            const legal =
                                !!selectedPiece &&
                                isMoveLegal(currentNode, selectedPiece, [y, x]);
                            const selected =
                                !!selectedPiece &&
                                selectedPiece[0] === y &&
                                selectedPiece[1] === x;
                            const pieceOnSquare =
                                !!selectedPiece && board[y][x] !== Pieces.EMPTY;

                            const isOpponentKing =
                                (currentPlayer === "white" &&
                                    piece === Pieces.WHITE_KING) ||
                                (currentPlayer === "black" &&
                                    piece === Pieces.BLACK_KING);

                            const isSquareChecked = isChecked && isOpponentKing;

                            return (
                                <Square
                                    key={key}
                                    x={x}
                                    y={y}
                                    piece={piece}
                                    isSelected={selected}
                                    isMoveLegal={legal}
                                    isPieceOnSquare={pieceOnSquare}
                                    isChecked={isSquareChecked}
                                    promotionData={[false, false]}
                                    onClick={handleSquareClick}
                                />
                            );
                        }

                        const promotionPieces = getPendingPromotionSquares()!;
                        const isPromotionSquare = promotionPieces.some(
                            ([[py, px]]) => py === y && px === x
                        );
                        const promotedPiece =
                            promotionPieces.find(
                                ([[py, px]]) => py === y && px === x
                            )?.[1] ?? piece;

                        return (
                            <Square
                                key={key}
                                x={x}
                                y={y}
                                piece={promotedPiece}
                                isSelected={false}
                                isMoveLegal={isPromotionSquare}
                                isPieceOnSquare={isPromotionSquare}
                                isChecked={false}
                                promotionData={[true, isPromotionSquare]}
                                onClick={() => handlePromotion(promotedPiece)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Chessboard;
