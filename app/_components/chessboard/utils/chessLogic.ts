import { Pieces } from "@/app/types";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import type { Chessboard, PiecePosition, MoveType } from "@/app/types";
import {
    whitePieces,
    blackPieces,
    copyBoard,
    knightMoves,
    kingMoves,
    bishopMoves,
    rookMoves,
} from "@/app/utils";

export const isInBoard = (move: PiecePosition): boolean => {
    const [y, x] = move;
    return y >= 0 && y < 8 && x >= 0 && x < 8;
};

const isSquareAttack = (
    board: Chessboard,
    [y, x]: PiecePosition,
    attackedBy: "white" | "black"
): boolean => {
    // === PAWNS ===
    if (
        attackedBy === "white" &&
        y < 7 &&
        ((x > 0 && board[y + 1][x - 1] === Pieces.WHITE_PAWN) ||
            (x < 7 && board[y + 1][x + 1] === Pieces.WHITE_PAWN))
    )
        return true;

    if (
        attackedBy === "black" &&
        y > 0 &&
        ((x > 0 && board[y - 1][x - 1] === Pieces.BLACK_PAWN) ||
            (x < 7 && board[y - 1][x + 1] === Pieces.BLACK_PAWN))
    )
        return true;

    // === KNIGHTS ===
    const knight =
        attackedBy === "white" ? Pieces.WHITE_KNIGHT : Pieces.BLACK_KNIGHT;
    for (const [dy, dx] of knightMoves) {
        const ny = y + dy;
        const nx = x + dx;
        if (isInBoard([ny, nx]) && board[ny][nx] === knight) return true;
    }

    // === KINGS ===
    const king =
        attackedBy === "white" ? Pieces.WHITE_KNIGHT : Pieces.BLACK_KNIGHT;

    for (const [dy, dx] of kingMoves) {
        const ny = y + dy;
        const nx = x + dx;
        if (isInBoard([ny, nx]) && board[ny][nx] === king) return true;
    }

    // === BISHOP AND QUEENS ===
    const piecesBQ =
        attackedBy === "white"
            ? [Pieces.WHITE_BISHOP, Pieces.WHITE_QUEEN]
            : [Pieces.BLACK_BISHOP, Pieces.BLACK_QUEEN];
    for (const [dy, dx] of bishopMoves) {
        let ny = y + dy;
        let nx = x + dx;
        while (isInBoard([ny, nx]) && board[ny][nx] === Pieces.EMPTY) {
            ny += dy;
            nx += dx;
        }
        if (isInBoard([ny, nx]) && piecesBQ.includes(board[ny][nx]))
            return true;
    }

    // === ROOK AND QUEEN ===
    const piecesRQ =
        attackedBy === "white"
            ? [Pieces.WHITE_ROOK, Pieces.WHITE_QUEEN]
            : [Pieces.BLACK_ROOK, Pieces.BLACK_QUEEN];
    for (const [dy, dx] of rookMoves) {
        let ny = y + dy;
        let nx = x + dx;
        while (isInBoard([ny, nx]) && board[ny][nx] === Pieces.EMPTY) {
            ny += dy;
            nx += dx;
        }
        if (isInBoard([ny, nx]) && piecesRQ.includes(board[ny][nx]))
            return true;
    }

    return false;
};

const getBlackPawnMoves = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition
): [PiecePosition, MoveType][] => {
    const possibleMoves: [PiecePosition, MoveType][] = [];
    const board = movesTree.board;

    // === GOING FORWAD ===
    if (board[y + 1][x] === Pieces.EMPTY) {
        possibleMoves.push([[y + 1, x], y === 6 ? "promotion" : "normal"]);
        if (y === 1 && board[y + 2][x] === Pieces.EMPTY)
            possibleMoves.push([[y + 2, x], "normal"]);
    }
    // === CATPURES ===
    if (x !== 0 && whitePieces.includes(board[y + 1][x - 1]))
        possibleMoves.push([[y + 1, x - 1], y === 6 ? "promotion" : "normal"]);
    if (x !== 7 && whitePieces.includes(board[y + 1][x + 1]))
        possibleMoves.push([[y + 1, x + 1], y === 6 ? "promotion" : "normal"]);

    // === EN PASSANT ===
    if (
        y === 4 &&
        movesTree.piece === Pieces.WHITE_PAWN &&
        movesTree.from[0] === 6 &&
        movesTree.to[0] === 4
    ) {
        if (movesTree.from[1] === x - 1)
            possibleMoves.push([[5, x - 1], "en passant"]);
        if (movesTree.from[1] === x + 1)
            possibleMoves.push([[5, x + 1], "en passant"]);
    }

    return possibleMoves;
};

const getWhitePawnMoves = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition
): [PiecePosition, MoveType][] => {
    const possibleMoves: [PiecePosition, MoveType][] = [];
    const board = movesTree.board;

    // === PROMOTION ===

    // === GOING FORWAD ===
    if (board[y - 1][x] === Pieces.EMPTY) {
        possibleMoves.push([[y - 1, x], y === 1 ? "promotion" : "normal"]);
        if (y === 6 && board[y - 2][x] === Pieces.EMPTY)
            possibleMoves.push([[y - 2, x], "normal"]);
    }
    // === CATPURES ===
    if (x !== 0 && blackPieces.includes(board[y - 1][x - 1]))
        possibleMoves.push([[y - 1, x - 1], y === 1 ? "promotion" : "normal"]);
    if (x !== 7 && blackPieces.includes(board[y - 1][x + 1]))
        possibleMoves.push([[y - 1, x + 1], y === 1 ? "promotion" : "normal"]);

    // === EN PASSANT ===
    if (
        y === 3 &&
        movesTree.piece === Pieces.BLACK_PAWN &&
        movesTree.from[0] === 1 &&
        movesTree.to[0] === 3
    ) {
        if (movesTree.from[1] === x - 1)
            possibleMoves.push([[2, x - 1], "en passant"]);
        if (movesTree.from[1] === x + 1)
            possibleMoves.push([[2, x + 1], "en passant"]);
    }

    return possibleMoves;
};
const getKnightMoves = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition
): [PiecePosition, MoveType][] => {
    const possibleMoves: [PiecePosition, MoveType][] = [];
    const board = movesTree.board;
    const capturablePieces =
        board[y][x] === Pieces.WHITE_KNIGHT ? blackPieces : whitePieces;
    for (const [dy, dx] of knightMoves) {
        const ny = y + dy;
        const nx = x + dx;
        if (
            isInBoard([ny, nx]) &&
            (capturablePieces.includes(board[ny][nx]) ||
                board[ny][nx] === Pieces.EMPTY)
        )
            possibleMoves.push([[ny, nx], "normal"]);
    }

    return possibleMoves;
};

const getLongRangePieceMoves = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition,
    movement: PiecePosition[]
): [PiecePosition, MoveType][] => {
    const possibleMoves: [PiecePosition, MoveType][] = [];
    const board = movesTree.board;
    const capturablePieces = whitePieces.includes(board[y][x])
        ? blackPieces
        : whitePieces;
    for (const [dy, dx] of movement) {
        let ny = y + dy;
        let nx = x + dx;
        while (isInBoard([ny, nx]) && board[ny][nx] === Pieces.EMPTY) {
            possibleMoves.push([[ny, nx], "normal"]);
            ny += dy;
            nx += dx;
        }
        if (isInBoard([ny, nx]) && capturablePieces.includes(board[ny][nx]))
            possibleMoves.push([[ny, nx], "normal"]);
    }

    return possibleMoves;
};

const getBishopMoves = (
    movesTree: MovesTreeNode,
    pos: PiecePosition
): [PiecePosition, MoveType][] => {
    return getLongRangePieceMoves(movesTree, pos, bishopMoves);
};

const getRookMoves = (
    movesTree: MovesTreeNode,
    pos: PiecePosition
): [PiecePosition, MoveType][] => {
    return getLongRangePieceMoves(movesTree, pos, rookMoves);
};

const getQueenMoves = (
    movesTree: MovesTreeNode,
    pos: PiecePosition
): [PiecePosition, MoveType][] => {
    return getLongRangePieceMoves(
        movesTree,
        pos,
        bishopMoves.concat(rookMoves)
    );
};

const getKingMoves = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition
): [PiecePosition, MoveType][] => {
    const possibleMoves: [PiecePosition, MoveType][] = [];
    const board = movesTree.board;
    const oppositeSite = board[y][x] === Pieces.WHITE_KING ? "black" : "white";
    const capturablePieces =
        board[y][x] === Pieces.WHITE_KING ? blackPieces : whitePieces;
    for (const [dy, dx] of kingMoves) {
        const ny = y + dy;
        const nx = x + dx;
        if (
            isInBoard([ny, nx]) &&
            (capturablePieces.includes(board[ny][nx]) ||
                board[ny][nx] === Pieces.EMPTY)
        )
            possibleMoves.push([[ny, nx], "normal"]);
    }

    // === SHORT CASTLING ===
    if (
        (movesTree.checkCastlingRigths() === "both" ||
            movesTree.checkCastlingRigths() === "short") &&
        board[y][x + 1] === Pieces.EMPTY &&
        board[y][x + 2] === Pieces.EMPTY &&
        !isSquareAttack(board, [y, x], oppositeSite) &&
        !isSquareAttack(board, [y, x + 1], oppositeSite) &&
        !isSquareAttack(board, [y, x + 2], oppositeSite)
    )
        possibleMoves.push([[y, x + 2], "short castling"]);

    // === LONG CASTLING ===
    if (
        (movesTree.checkCastlingRigths() === "both" ||
            movesTree.checkCastlingRigths() === "long") &&
        board[y][x - 1] === Pieces.EMPTY &&
        board[y][x - 2] === Pieces.EMPTY &&
        board[y][x - 3] === Pieces.EMPTY &&
        !isSquareAttack(board, [y, x], oppositeSite) &&
        !isSquareAttack(board, [y, x - 1], oppositeSite) &&
        !isSquareAttack(board, [y, x - 2], oppositeSite)
    )
        possibleMoves.push([[y, x - 2], "long castling"]);

    return possibleMoves;
};

export const isKingChecked = (board: Chessboard): Pieces[] => {
    const checkedKings: Pieces[] = [];
    let whiteKingPosition: PiecePosition = [-1, -1];
    let blackKingPosition: PiecePosition = [-1, -1];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === Pieces.WHITE_KING) {
                whiteKingPosition = [y, x];
            }
            if (board[y][x] === Pieces.BLACK_KING) {
                blackKingPosition = [y, x];
            }
        }
    }
    if (isSquareAttack(board, whiteKingPosition, "black"))
        checkedKings.push(Pieces.WHITE_KING);

    if (isSquareAttack(board, blackKingPosition, "white"))
        checkedKings.push(Pieces.BLACK_KING);

    return checkedKings;
};

const getMovesToCheck = (
    movesTree: MovesTreeNode,
    [y, x]: PiecePosition
): [PiecePosition, MoveType][] => {
    const piece = movesTree.board[y][x];
    const movablePieces =
        movesTree.getCurrentPlayer() === "white" ? whitePieces : blackPieces;

    if (!movablePieces.includes(piece)) return [];

    if (piece === Pieces.BLACK_PAWN) {
        return getBlackPawnMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.WHITE_PAWN) {
        return getWhitePawnMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.BLACK_KNIGHT || piece === Pieces.WHITE_KNIGHT) {
        return getKnightMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.BLACK_BISHOP || piece === Pieces.WHITE_BISHOP) {
        return getBishopMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.BLACK_ROOK || piece === Pieces.WHITE_ROOK) {
        return getRookMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.BLACK_QUEEN || piece === Pieces.WHITE_QUEEN) {
        return getQueenMoves(movesTree, [y, x]);
    }
    if (piece === Pieces.BLACK_KING || piece === Pieces.WHITE_KING) {
        return getKingMoves(movesTree, [y, x]);
    }

    return [];
};

export const makeMove = (
    board: Chessboard,
    from: PiecePosition,
    to: PiecePosition,
    moveType: MoveType,
    promotingTo: Pieces
): Chessboard => {
    const newBoard = copyBoard(board);
    const piece = board[from[0]][from[1]];

    if (moveType !== "normal") {
        // === CASTLING ===
        if (piece === Pieces.BLACK_KING || piece === Pieces.WHITE_KING) {
            const y = from[0];
            const rook =
                piece === Pieces.WHITE_KING
                    ? Pieces.WHITE_ROOK
                    : Pieces.BLACK_ROOK;
            if (to[1] === 6) {
                newBoard[y][4] = Pieces.EMPTY;
                newBoard[y][5] = rook;
                newBoard[y][6] = piece;
                newBoard[y][7] = Pieces.EMPTY;
            }
            if (to[1] === 2) {
                newBoard[y][4] = Pieces.EMPTY;
                newBoard[y][3] = rook;
                newBoard[y][2] = piece;
                newBoard[y][0] = Pieces.EMPTY;
            }

            return newBoard;
        }

        if (piece === Pieces.BLACK_PAWN || piece === Pieces.WHITE_PAWN) {
            if (moveType === "promotion") {
                newBoard[from[0]][from[1]] = Pieces.EMPTY;
                newBoard[to[0]][to[1]] = promotingTo;
                return newBoard;
            }
            if (moveType === "en passant")
                newBoard[from[0]][from[1]] = Pieces.EMPTY;
            newBoard[to[0]][to[1]] = piece;
            newBoard[from[0]][to[1]] = Pieces.EMPTY;

            return newBoard;
        }
    }
    newBoard[from[0]][from[1]] = Pieces.EMPTY;
    newBoard[to[0]][to[1]] = piece;
    return newBoard;
};

export const getLegalMoves = (
    movesTree: MovesTreeNode,
    piecePosition: PiecePosition
): [PiecePosition, MoveType][] => {
    const movesToCheck = getMovesToCheck(movesTree, piecePosition);
    const legalMoves: [PiecePosition, MoveType][] = [];
    const currentPlayer = movesTree.getCurrentPlayer();

    movesToCheck.forEach(([to, moveType]) => {
        const newBoard = makeMove(
            movesTree.board,
            piecePosition,
            to,
            moveType,
            Pieces.WHITE_PAWN
        );

        const checkedKing = isKingChecked(newBoard);
        if (
            checkedKing.length === 0 ||
            (!checkedKing.includes(Pieces.BLACK_KING) &&
                currentPlayer === "black") ||
            (!checkedKing.includes(Pieces.WHITE_KING) &&
                currentPlayer === "white")
        )
            legalMoves.push([to, moveType]);
    });

    return legalMoves;
};

export const isMate = (movesTree: MovesTreeNode): Pieces => {
    const board = movesTree.board;
    const checkedKing = isKingChecked(board);
    if (checkedKing.length === 0) return Pieces.EMPTY;

    const movablePieces = checkedKing.includes(Pieces.WHITE_KING)
        ? whitePieces
        : blackPieces;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (movablePieces.includes(board[y][x])) {
                const legalMoves = getLegalMoves(movesTree, [y, x]);
                if (legalMoves.length > 0) return Pieces.EMPTY;
            }
        }
    }
    return checkedKing[0];
};

export const isMoveLegal = (
    movesTree: MovesTreeNode,
    from: PiecePosition,
    [ny, nx]: PiecePosition
): boolean => {
    const legalMoves = getLegalMoves(movesTree, from);
    for (const [move] of legalMoves) {
        if (move[0] === ny && move[1] === nx) return true;
    }

    return false;
};
