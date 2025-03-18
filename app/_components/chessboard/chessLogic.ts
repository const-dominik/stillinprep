import { Pieces } from "@/app/types";
import { MovesTree } from "@/app/_components/chessboard/MovesTree";
import type { Chessboard, PiecePosition, Player } from "@/app/types";

export const getLegalMoves = (
    board: Chessboard,
    position: PiecePosition | null,
    currentPlayer: Player,
    movesTree: MovesTree
): PiecePosition[] => {
    if (position === null) {
        return [];
    }

    const [y, x] = position;
    const piece = board[y][x];
    let moves: PiecePosition[] = [];
    const whitePieces = [
        Pieces.WHITE_PAWN,
        Pieces.WHITE_KNIGHT,
        Pieces.WHITE_BISHOP,
        Pieces.WHITE_ROOK,
        Pieces.WHITE_QUEEN,
        Pieces.WHITE_KING,
    ];
    const blackPieces = [
        Pieces.BLACK_PAWN,
        Pieces.BLACK_KNIGHT,
        Pieces.BLACK_BISHOP,
        Pieces.BLACK_ROOK,
        Pieces.BLACK_QUEEN,
        Pieces.BLACK_KING,
    ];

    const isRightTurn = (): boolean => {
        return (
            (currentPlayer === "white" && whitePieces.includes(piece)) ||
            (currentPlayer === "black" && blackPieces.includes(piece))
        );
    };

    const isInBoard = (move: PiecePosition): boolean => {
        const [y, x] = move;
        return y >= 0 && y < 8 && x >= 0 && x < 8;
    };

    const isNotOverstepping = ([newY, newX]: PiecePosition): boolean => {
        return (
            (currentPlayer === "white" &&
                !whitePieces.includes(board[newY][newX])) ||
            (currentPlayer === "black" &&
                !blackPieces.includes(board[newY][newX]))
        );
    };

    const isNotJumpingOver = ([newY, newX]: PiecePosition): boolean => {
        if (piece === Pieces.BLACK_KNIGHT || piece === Pieces.WHITE_KNIGHT) {
            return true;
        }

        const [y, x] = position;

        const deltaY = Math.sign(newY - y);
        const deltaX = Math.sign(newX - x);

        let currY = y + deltaY;
        let currX = x + deltaX;

        while (currY !== newY || currX !== newX) {
            if (board[currY][currX] !== Pieces.EMPTY) {
                return false;
            }
            currY += deltaY;
            currX += deltaX;
        }

        return true;
    };

    const isKingChecked = (board: Chessboard): Pieces => {
        let whiteKingPosition: PiecePosition | null = null;
        let blackKingPosition: PiecePosition | null = null;

        // Znalezienie pozycji obu króli
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

        // Sprawdzenie, czy król jest atakowany
        const isAttacked = (
            kingPos: PiecePosition,
            isWhite: boolean
        ): boolean => {
            const [y, x] = kingPos;

            // Sprawdzenie ataku pionów
            const pawnOffsets = isWhite
                ? [
                      [-1, -1],
                      [-1, 1],
                  ]
                : [
                      [1, -1],
                      [1, 1],
                  ];
            for (const [dy, dx] of pawnOffsets) {
                const ny = y + dy,
                    nx = x + dx;
                if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
                    const pawn = isWhite
                        ? Pieces.BLACK_PAWN
                        : Pieces.WHITE_PAWN;
                    if (board[ny][nx] === pawn) return true;
                }
            }

            // Sprawdzenie ataku skoczków
            const knightMoves = [
                [-2, -1],
                [-2, 1],
                [2, -1],
                [2, 1],
                [-1, -2],
                [-1, 2],
                [1, -2],
                [1, 2],
            ];
            for (const [dy, dx] of knightMoves) {
                const ny = y + dy,
                    nx = x + dx;
                if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
                    const knight = isWhite
                        ? Pieces.BLACK_KNIGHT
                        : Pieces.WHITE_KNIGHT;
                    if (board[ny][nx] === knight) return true;
                }
            }

            // Sprawdzenie ataku wież i królowej (pionowo/poziomo)
            const rookQueenDirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];
            for (const [dy, dx] of rookQueenDirs) {
                let ny = y,
                    nx = x;
                while (true) {
                    ny += dy;
                    nx += dx;
                    if (ny < 0 || ny >= 8 || nx < 0 || nx >= 8) break;
                    const piece = board[ny][nx];
                    if (piece !== Pieces.EMPTY) {
                        if (
                            (isWhite &&
                                (piece === Pieces.BLACK_ROOK ||
                                    piece === Pieces.BLACK_QUEEN)) ||
                            (!isWhite &&
                                (piece === Pieces.WHITE_ROOK ||
                                    piece === Pieces.WHITE_QUEEN))
                        ) {
                            return true;
                        }
                        break; // Zablokowane przez inną figurę
                    }
                }
            }

            // Sprawdzenie ataku gońców i królowej (diagonalnie)
            const bishopQueenDirs = [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1],
            ];
            for (const [dy, dx] of bishopQueenDirs) {
                let ny = y,
                    nx = x;
                while (true) {
                    ny += dy;
                    nx += dx;
                    if (ny < 0 || ny >= 8 || nx < 0 || nx >= 8) break;
                    const piece = board[ny][nx];
                    if (piece !== Pieces.EMPTY) {
                        if (
                            (isWhite &&
                                (piece === Pieces.BLACK_BISHOP ||
                                    piece === Pieces.BLACK_QUEEN)) ||
                            (!isWhite &&
                                (piece === Pieces.WHITE_BISHOP ||
                                    piece === Pieces.WHITE_QUEEN))
                        ) {
                            return true;
                        }
                        break;
                    }
                }
            }

            // Sprawdzenie ataku króla
            const kingMoves = [
                [-1, -1],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [0, 1],
                [1, -1],
                [1, 0],
                [1, 1],
            ];
            for (const [dy, dx] of kingMoves) {
                const ny = y + dy,
                    nx = x + dx;
                if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
                    const enemyKing = isWhite
                        ? Pieces.BLACK_KING
                        : Pieces.WHITE_KING;
                    if (board[ny][nx] === enemyKing) return true;
                }
            }

            return false;
        };

        // Sprawdzenie, który król jest pod szachem
        if (whiteKingPosition && isAttacked(whiteKingPosition, true)) {
            return Pieces.WHITE_KING;
        }
        if (blackKingPosition && isAttacked(blackKingPosition, false)) {
            return Pieces.BLACK_KING;
        }

        return Pieces.EMPTY; // Żaden król nie jest pod szachem
    };

    const isNotUnderCheck = ([newY, newX]: PiecePosition): boolean => {
        const boardAfterMove = board.map((row) => [...row]);
        boardAfterMove[newY][newX] = board[position[0]][position[1]];
        boardAfterMove[position[0]][position[1]] = Pieces.EMPTY;
        const checkedKing = isKingChecked(boardAfterMove);
        return !(
            (whitePieces.includes(checkedKing) && currentPlayer === "white") ||
            (blackPieces.includes(checkedKing) && currentPlayer === "black")
        );
    };

    const filterIllegalMoves = (
        possibleMoves: PiecePosition[]
    ): PiecePosition[] => {
        const movesFilter = (possibleMove: PiecePosition): boolean => {
            return (
                isInBoard(possibleMove) &&
                isNotOverstepping(possibleMove) &&
                isNotJumpingOver(possibleMove) &&
                isNotUnderCheck(possibleMove)
            );
        };
        return possibleMoves.filter(movesFilter);
    };

    const getBlackPawnMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [];

        if (board[y + 1][x] === Pieces.EMPTY) {
            possibleMoves.push([y + 1, x]);
            if (y === 1 && board[y + 2][x] === Pieces.EMPTY)
                possibleMoves.push([y + 2, x]);
        }
        if (x !== 0 && whitePieces.includes(board[y + 1][x - 1]))
            possibleMoves.push([y + 1, x - 1]);
        if (x !== 7 && whitePieces.includes(board[y + 1][x + 1]))
            possibleMoves.push([y + 1, x + 1]);
        return possibleMoves;
    };

    const getWhitePawnMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [];

        if (board[y - 1][x] === Pieces.EMPTY) {
            possibleMoves.push([y - 1, x]);
            if (y === 6 && board[y - 2][x] === Pieces.EMPTY)
                possibleMoves.push([y - 2, x]);
        }
        if (x !== 0 && blackPieces.includes(board[y - 1][x - 1]))
            possibleMoves.push([y - 1, x - 1]);
        if (x !== 7 && blackPieces.includes(board[y - 1][x + 1]))
            possibleMoves.push([y - 1, x + 1]);
        return possibleMoves;
    };

    const getKnightMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [
            [y - 2, x - 1],
            [y - 2, x + 1],
            [y - 1, x - 2],
            [y - 1, x + 2],
            [y + 1, x - 2],
            [y + 1, x + 2],
            [y + 2, x - 1],
            [y + 2, x + 1],
        ];
        return possibleMoves;
    };

    const getBishopMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [];
        for (let i = 1; i < 8; i++) {
            possibleMoves.push([y - i, x - i]);
            possibleMoves.push([y - i, x + i]);
            possibleMoves.push([y + i, x - i]);
            possibleMoves.push([y + i, x + i]);
        }
        return possibleMoves;
    };

    const getRookMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [];
        for (let i = 1; i < 8; i++) {
            possibleMoves.push([y, x - i]);
            possibleMoves.push([y, x + i]);
            possibleMoves.push([y - i, x]);
            possibleMoves.push([y + i, x]);
        }
        return possibleMoves;
    };

    const getQueenMoves = (): PiecePosition[] => {
        return getBishopMoves().concat(getRookMoves());
    };

    const getKingMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [
            [y - 1, x - 1],
            [y - 1, x],
            [y - 1, x + 1],
            [y, x - 1],
            [y, x + 1],
            [y + 1, x - 1],
            [y + 1, x],
            [y + 1, x + 1],
        ];

        const castlingRigths = movesTree.checkCastlingRigths();
        const row = piece === Pieces.BLACK_KING ? 0 : 7;
        if (
            ["both", "long"].includes(castlingRigths) &&
            board[row][1] === Pieces.EMPTY &&
            board[row][2] === Pieces.EMPTY &&
            board[row][3] === Pieces.EMPTY
        ) {
            possibleMoves.push([row, 2]);
        }

        if (
            ["both", "short"].includes(castlingRigths) &&
            board[row][5] === Pieces.EMPTY &&
            board[row][6] === Pieces.EMPTY
        ) {
            possibleMoves.push([row, 6]);
        }

        return possibleMoves;
    };

    const getMoves = () => {
        if (piece === Pieces.BLACK_PAWN) {
            moves = getBlackPawnMoves();
        }
        if (piece === Pieces.WHITE_PAWN) {
            moves = getWhitePawnMoves();
        }
        if (piece === Pieces.BLACK_KNIGHT || piece === Pieces.WHITE_KNIGHT) {
            moves = getKnightMoves();
        }
        if (piece === Pieces.BLACK_BISHOP || piece === Pieces.WHITE_BISHOP) {
            moves = getBishopMoves();
        }
        if (piece === Pieces.BLACK_ROOK || piece === Pieces.WHITE_ROOK) {
            moves = getRookMoves();
        }
        if (piece === Pieces.BLACK_QUEEN || piece === Pieces.WHITE_QUEEN) {
            moves = getQueenMoves();
        }
        if (piece === Pieces.BLACK_KING || piece === Pieces.WHITE_KING) {
            moves = getKingMoves();
        }
    };

    if (isRightTurn()) {
        getMoves();
    }
    return filterIllegalMoves(moves);
};