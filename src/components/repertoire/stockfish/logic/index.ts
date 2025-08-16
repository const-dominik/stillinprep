import { getBoardAfterMove } from "@/components/utils/chessLogic";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import {
    Chessboard,
    Pieces,
    StockfishEval,
    UCIPromotionPiece,
} from "@/lib/types/types";
import { blackPieces, fileAndRankToPosition } from "@/lib/utils";

const stockfishPromotionMap: Record<
    UCIPromotionPiece,
    [whitePiece: Pieces, blackPiece: Pieces]
> = {
    r: [Pieces.WHITE_ROOK, Pieces.BLACK_ROOK],
    q: [Pieces.WHITE_QUEEN, Pieces.BLACK_QUEEN],
    n: [Pieces.WHITE_KNIGHT, Pieces.BLACK_KNIGHT],
    b: [Pieces.WHITE_BISHOP, Pieces.BLACK_BISHOP],
};

const pieceGuard = (piece: string): piece is UCIPromotionPiece => {
    return [..."rqbn"].includes(piece);
};

export const parseStockfishResponse = (line: string, board: Chessboard) => {
    const from = fileAndRankToPosition(line.slice(0, 2));
    const to = fileAndRankToPosition(line.slice(2, 4));

    const extraInfo: { type: "normal" | "promotion"; promotionPiece: Pieces } =
        {
            type: "normal",
            promotionPiece: Pieces.EMPTY,
        };

    if (line.length === 5) {
        const piece = line[4];
        if (!pieceGuard(piece)) {
            throw new Error("Stockfish returned unknown promotion piece");
        }

        const [white, black] = stockfishPromotionMap[piece];
        extraInfo.type = "promotion";

        extraInfo.promotionPiece = to[0] === 0 ? white : black;
    }

    const whiteNode = new MovesTreeNode(Pieces.EMPTY, [0, 0], [0, 0], board);
    const nextBoard = getBoardAfterMove(
        board,
        from,
        to,
        extraInfo.type,
        extraInfo.promotionPiece
    );

    const { node: blackNode } = whiteNode.addMove(0, [0, 0], [0, 0], board);
    const prevNode = blackPieces.includes(nextBoard[to[0]][to[1]])
        ? blackNode
        : whiteNode;

    const { node } = prevNode.addMove(
        nextBoard[to[0]][to[1]],
        from,
        to,
        nextBoard
    );
    return node.getAlgebraicNotation();
};

export const parseStockfishScore = (evaluation: StockfishEval): string => {
    if (evaluation.type === "cp") {
        const score = evaluation.value / 100;

        if (score < 0) {
            return String(score.toFixed(2));
        }
        return `+${score.toFixed(2)}`;
    }
    return `#${evaluation.value}`;
};
