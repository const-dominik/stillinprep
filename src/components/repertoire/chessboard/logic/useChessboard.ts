import { useEffect, useState } from "react";

import {
    getBoardAfterMove,
    getLegalMoves,
    isMoveOnPath,
} from "@/components/utils/chessLogic";
import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import {
    PendingPromotion,
    PiecePosition,
    Pieces,
    SelectedPieceData,
} from "@/lib/types/types";
import {
    getCurrentPlayerPieces,
    getOppositePlayer,
    includesMove,
} from "@/lib/utils";
import { addMoveToDb } from ".";
import { SquareRenderer } from "../SquareRenderer";

const baseSelectedPieceData = { position: null, legalMoves: [] };

export const useChessboard = () => {
    const { currentNode, lastNode, setCurrentNode, setLastNode } =
        usePosition();
    const { id: repertoireId } = useRepertoire();

    const board = currentNode.board;
    const currentPlayer = getOppositePlayer(currentNode.player);
    const currentPlayerPieces = getCurrentPlayerPieces(currentPlayer);

    const [selectedPieceData, setSelectedPieceData] =
        useState<SelectedPieceData>(baseSelectedPieceData);
    const [pendingPromotion, setPendingPromotion] =
        useState<PendingPromotion | null>(null);

    useEffect(() => {
        setSelectedPieceData(baseSelectedPieceData);
        setPendingPromotion(null);
    }, [currentNode]);

    const changeSelectedPiece = (pos: PiecePosition | null) => {
        if (!pos) return setSelectedPieceData(baseSelectedPieceData);
        const legalMoves = getLegalMoves(currentNode, pos);
        setSelectedPieceData({ position: pos, legalMoves });
    };

    const finalizeMove = (
        piece: Pieces,
        from: PiecePosition,
        to: PiecePosition,
        newBoard: Pieces[][]
    ) => {
        const { node, isNew } = currentNode.addMove(piece, from, to, newBoard);
        setCurrentNode(node);

        let finalNode = node;

        if (!isNew) {
            if (!isMoveOnPath(lastNode, node)) {
                while (finalNode.children.length === 1) {
                    finalNode = finalNode.children[0];
                }
                setLastNode(finalNode);
            }
        } else {
            setLastNode(node);
        }

        changeSelectedPiece(null);

        if (isNew) {
            addMoveToDb(node, repertoireId);
        }
    };

    const handleMove = (x: number, y: number) => {
        const move = selectedPieceData.legalMoves.find(
            ([pos]) => pos[0] === y && pos[1] === x
        );
        if (!move || !selectedPieceData.position) return;
        const from = selectedPieceData.position;
        const to: [number, number] = [y, x];
        const moveType = move[1];

        if (moveType === "promotion") {
            setPendingPromotion({ from, to });
            return;
        }

        const newBoard = getBoardAfterMove(
            board,
            from,
            to,
            moveType,
            Pieces.EMPTY
        );
        finalizeMove(newBoard[y][x], from, to, newBoard);
    };

    const handlePromotion = (promotedTo: Pieces) => {
        if (!pendingPromotion) return;
        const { from, to } = pendingPromotion;
        const newBoard = getBoardAfterMove(
            board,
            from,
            to,
            "promotion",
            promotedTo
        );
        finalizeMove(promotedTo, from, to, newBoard);
        setPendingPromotion(null);
    };

    const handleSquareClick = (x: number, y: number) => {
        const clickedPiece = board[y][x];
        const selected = selectedPieceData.position;
        const isSame = selected?.[0] === y && selected?.[1] === x;

        if (!selected) {
            if (currentPlayerPieces.includes(clickedPiece))
                changeSelectedPiece([y, x]);
            return;
        }

        if (isSame) return changeSelectedPiece(null);
        if (includesMove(selectedPieceData.legalMoves, [y, x]))
            return handleMove(x, y);
        if (currentPlayerPieces.includes(clickedPiece))
            return changeSelectedPiece([y, x]);

        changeSelectedPiece(null);
    };

    const renderSquare = (x: number, y: number) =>
        SquareRenderer({
            x,
            y,
            currentNode,
            selectedPieceData,
            pendingPromotion,
            onSquareClick: handleSquareClick,
            onPromotion: handlePromotion,
        });

    return {
        board,
        changeSelectedPiece,
        handleSquareClick,
        renderSquare,
    };
};
