import { isMoveLegal } from "@/components/utils/chessLogic";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import { PendingPromotion, Pieces, SelectedPieceData } from "@/lib/types/types";
import { getOppositePlayer } from "@/lib/utils";
import { getPromotionSquares } from "./logic";
import Square from "./Square";

type SquareRendererProps = {
    x: number;
    y: number;
    currentNode: MovesTreeNode;
    selectedPieceData: SelectedPieceData;
    pendingPromotion: PendingPromotion | null;
    onSquareClick: (x: number, y: number) => void;
    onPromotion: (p: Pieces) => void;
};

export const SquareRenderer = ({
    x,
    y,
    currentNode,
    selectedPieceData,
    pendingPromotion,
    onSquareClick,
    onPromotion,
}: SquareRendererProps) => {
    const key = `${x}${y}`;
    const board = currentNode.board;
    const currentPlayer = getOppositePlayer(currentNode.player);
    const piece = board[y][x];
    const isCheck = currentNode.isCheck();

    if (pendingPromotion) {
        const promotionSquares = getPromotionSquares(
            pendingPromotion,
            currentPlayer
        );
        const match = promotionSquares.find(
            ([[py, px]]) => py === y && px === x
        );
        const isPromo = !!match;
        const promoPiece = match?.[1] ?? piece;

        return (
            <Square
                key={key}
                x={x}
                y={y}
                piece={promoPiece}
                isSelected={false}
                isMoveLegal={isPromo}
                isPieceOnSquare={isPromo}
                isChecked={false}
                promotionData={[true, isPromo]}
                onMouseDown={() => isPromo && onPromotion(promoPiece)}
                currentPlayer={currentPlayer}
            />
        );
    }

    const selected = selectedPieceData.position;
    const isSelected = selected?.[0] === y && selected?.[1] === x;
    const isLegal = selected && isMoveLegal(currentNode, selected, [y, x]);
    const isKingInCheck =
        isCheck &&
        ((currentPlayer === "white" && piece === Pieces.WHITE_KING) ||
            (currentPlayer === "black" && piece === Pieces.BLACK_KING));

    return (
        <Square
            key={key}
            x={x}
            y={y}
            piece={piece}
            isSelected={isSelected}
            isMoveLegal={!!isLegal}
            isPieceOnSquare={piece !== Pieces.EMPTY}
            isChecked={isKingInCheck}
            promotionData={[false, false]}
            onMouseDown={() => onSquareClick(x, y)}
            currentPlayer={currentPlayer}
        />
    );
};
