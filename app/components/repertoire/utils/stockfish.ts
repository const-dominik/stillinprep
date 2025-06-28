import {
    Chessboard,
    ParsedLine,
    Pieces,
    Player,
    StockfishEval,
    UCIPromotionPiece,
} from "@/app/types/types";
import { fileAndRankToPosition } from "@/app/utils";
import { getBoardAfterMove } from "./chessLogic";
import { MovesTreeNode } from "./MovesTree";

export const parseStockfishLine = (
    line: string,
    currentPlayer: Player
): ParsedLine | null => {
    if (!line.startsWith("info")) return null;

    const result: ParsedLine = {};

    const depthMatch = line.match(/\bdepth (\d+)/);
    if (depthMatch) result.depth = parseInt(depthMatch[1], 10);

    const seldepthMatch = line.match(/\bseldepth (\d+)/);
    if (seldepthMatch) result.seldepth = parseInt(seldepthMatch[1], 10);

    const multipvMatch = line.match(/\bmultipv (\d+)/);
    if (multipvMatch) result.multipv = parseInt(multipvMatch[1], 10);

    const scoreMatch = line.match(/\bscore (cp|mate) (-?\d+)/);
    if (scoreMatch) {
        result.score = {
            type: scoreMatch[1] as "cp" | "mate",
            value: parseInt(scoreMatch[2], 10),
        };

        // in UCI, evaluation is relative to the player -
        // if black is to move and score is positive, it means that black is winning
        // we want score to always be relative to white

        if (currentPlayer === "black") {
            result.score.value *= -1;
        }
    }

    const pvMatch = line.match(/\bpv (.+)/);
    if (pvMatch) {
        result.pv = pvMatch[1].trim().split(/\s+/);
    }

    return result;
};

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

    const baseNode = new MovesTreeNode(Pieces.EMPTY, [0, 0], [0, 0], board);
    const nextBoard = getBoardAfterMove(
        board,
        from,
        to,
        extraInfo.type,
        extraInfo.promotionPiece
    );
    const { node } = baseNode.addMove(
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
