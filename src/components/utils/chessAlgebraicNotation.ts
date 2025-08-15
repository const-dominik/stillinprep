import {
    AlgebraicPiece,
    AlgebraicPosition,
    BoardFile,
    Chessboard,
    MoveType,
    PiecePosition,
    Pieces,
    Player,
} from "@/lib/types/types";
import { xToFile, yToRank } from "@/lib/utils";
import { MovesTreeNode } from "./MovesTree";
import { getBoardAfterMove, getLegalMoves } from "./chessLogic";

export const positionToAlgebraicNotation = ([
    y,
    x,
]: PiecePosition): AlgebraicPosition => `${xToFile(x)}${yToRank(y)}`;

const pieceToAlgebraicPiece = (piece: Pieces): AlgebraicPiece => {
    if ([Pieces.EMPTY, Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece)) {
        return "";
    }
    if ([Pieces.BLACK_KNIGHT, Pieces.WHITE_KNIGHT].includes(piece)) {
        return "N";
    }
    if ([Pieces.BLACK_BISHOP, Pieces.WHITE_BISHOP].includes(piece)) {
        return "B";
    }
    if ([Pieces.BLACK_ROOK, Pieces.WHITE_ROOK].includes(piece)) {
        return "R";
    }
    if ([Pieces.BLACK_QUEEN, Pieces.WHITE_QUEEN].includes(piece)) {
        return "Q";
    }
    return "K";
};

export const getAlgebraicMove = (fullMove: MovesTreeNode) => {
    if (fullMove.piece === Pieces.EMPTY) {
        return "root";
    }

    const prevBoard = fullMove.parent.board;
    const [y, x] = fullMove.to;
    const takenPiece = prevBoard[y][x];
    const piece = fullMove.board[y][x];

    let take = takenPiece === Pieces.EMPTY ? "" : "x";
    if (
        [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece) &&
        fullMove.from[1] !== fullMove.to[1] &&
        takenPiece === Pieces.EMPTY
    ) {
        take = "x";
    }

    const mate = fullMove.isMate() ? "#" : "";
    const check = fullMove.isCheck() && !mate ? "+" : "";
    const promotedTo = fullMove.promotedTo();

    let algebraicPiece: AlgebraicPiece | BoardFile = pieceToAlgebraicPiece(
        promotedTo ? promotedTo[0] : fullMove.piece
    );
    if (algebraicPiece === "" && take) {
        algebraicPiece = xToFile(fullMove.from[1]);
    }

    const castle = fullMove.castled();
    if (castle) {
        if (castle === "short") {
            return `0-0${check}${mate}`;
        }
        return `0-0-0${check}${mate}`;
    }

    const endPosition = positionToAlgebraicNotation(fullMove.to);
    const extraPrecision = fullMove.getPrecisePosition();

    return `${algebraicPiece}${extraPrecision}${take}${endPosition}${promotedTo ? `=${promotedTo[1]}` : ""}${check}${mate}`;
};

const notationToPiece = (move: string, color: "white" | "black"): Pieces => {
    const isWhite = color === "white";

    if (["0-0", "0-0-0", "O-O", "O-O-O"].includes(move))
        return isWhite ? Pieces.WHITE_KING : Pieces.BLACK_KING;

    let piece = move.split("").filter((ch) => ch >= "A" && ch <= "Z");
    if (piece.length === 0 || move.includes("=")) piece = ["P"];

    switch (piece[0]) {
        case "P":
            return isWhite ? Pieces.WHITE_PAWN : Pieces.BLACK_PAWN;
        case "B":
            return isWhite ? Pieces.WHITE_BISHOP : Pieces.BLACK_BISHOP;
        case "N":
            return isWhite ? Pieces.WHITE_KNIGHT : Pieces.BLACK_KNIGHT;
        case "R":
            return isWhite ? Pieces.WHITE_ROOK : Pieces.BLACK_ROOK;
        case "Q":
            return isWhite ? Pieces.WHITE_QUEEN : Pieces.BLACK_QUEEN;
        case "K":
            return isWhite ? Pieces.WHITE_KING : Pieces.BLACK_KING;
        default:
            return Pieces.EMPTY;
    }
};

const notationToCoords = (notation: string): PiecePosition => {
    if (["0-0", "0-0-0", "O-O", "O-O-O"].includes(notation)) return [8, 8];
    if (notation.includes("=")) notation = notation.slice(0, -2);

    const square = notation.slice(-2);
    const file = square[0].toLowerCase();
    const rank = parseInt(square[1], 10);

    const col = file.charCodeAt(0) - "a".charCodeAt(0);
    const row = 8 - rank;

    return [row, col];
};

const getExtraCoordinates = (
    move: string
): [number | undefined, number | undefined] => {
    const letters = move.split("").filter((ch) => ch >= "a" && ch <= "h");
    const digits = move.split("").filter((ch) => ch >= "1" && ch <= "8");
    let [col, row]: [number | undefined, number | undefined] = [
        undefined,
        undefined,
    ];

    if (letters.length === 2) {
        col = letters[0].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
    }

    if (digits.length === 2) {
        row = 8 - parseInt(digits[0], 10);
    }

    return [row, col];
};

const getPromotionPiece = (move: string, color: Player): Pieces => {
    const index = move.indexOf("=");
    if (index === -1 || index === move.length - 1) {
        return Pieces.EMPTY;
    }
    return notationToPiece(move[index + 1], color);
};

export const parseMove = (
    move: string,
    node: MovesTreeNode
): [PiecePosition, PiecePosition, Pieces, Chessboard] => {
    if (move.endsWith("+") || move.endsWith("#")) move = move.slice(0, -1);
    const piece = notationToPiece(move, node.getCurrentPlayer());
    const board = node.board;

    //=== CASTLING ===
    if (["0-0", "0-0-0", "O-O", "O-O-O"].includes(move)) {
        const row = node.getCurrentPlayer() === "white" ? 7 : 0;
        const from: PiecePosition = [row, 4];
        const to: PiecePosition = [row, ["O-O", "0-0"].includes(move) ? 6 : 2];
        const castlingType: MoveType = ["O-O", "0-0"].includes(move)
            ? "short castling"
            : "long castling";

        const newBoard = getBoardAfterMove(
            node.board,
            from,
            to,
            castlingType,
            Pieces.EMPTY
        );

        return [from, to, piece, newBoard];
    }

    const to = notationToCoords(move);
    let positionsToCheck: [PiecePosition, MoveType][] = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === piece) {
                const legalMoves = getLegalMoves(node, [row, col]);
                const moveToCheck = legalMoves.find(
                    ([[y, x]]) => y === to[0] && x === to[1]
                );

                if (moveToCheck) {
                    positionsToCheck.push([[row, col], moveToCheck[1]]);
                }
            }
        }
    }

    if (positionsToCheck.length > 1) {
        const fromCoord = getExtraCoordinates(move);

        if (fromCoord[0] !== undefined) {
            positionsToCheck = positionsToCheck.filter(
                ([[y]]) => y === fromCoord[0]
            );
        }

        if (fromCoord[1] !== undefined) {
            positionsToCheck = positionsToCheck.filter(
                ([[, x]]) => x === fromCoord[1]
            );
        }
    }

    const newBoard = getBoardAfterMove(
        board,
        positionsToCheck[0][0],
        to,
        positionsToCheck[0][1],
        getPromotionPiece(move, node.getCurrentPlayer())
    );

    return [positionsToCheck[0][0], to, piece, newBoard];
};

export const getLastFour = (
    movesString: string,
    node: MovesTreeNode
): string => {
    let moves = node.getLastMoves(3);
    const splitMoves = movesString.split(" ");
    if (node.getCurrentPlayer() === "white") moves += `${node.moveId + 1}.`;
    return moves + splitMoves[splitMoves.length - 1];
};
