"use client";

import styles from "./styles.module.scss";
import { initialBoard, pieceAssets } from "@/app/utils";
import type { Chessboard, PiecePosition, Player } from "@/app/types";
import { Pieces } from "@/app/types";
import Image from "next/image";
import { useState } from "react";

type SquareProps = {
    x: number;
    y: number;
    piece: Pieces;
    isSelected: boolean;
    onClick: (x: number, y: number) => void;
};

const switchPlayer = (player: Player): Player => {
    return player === "white" ? "black" : "white";
};

const getLegalMoves = (
    board: Chessboard,
    position: PiecePosition,
    currentPlayer: Player
): PiecePosition[] => {
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
        if (piece === Pieces.BLACK_KNIGHT || piece === Pieces.WHITE_KNIGHT)
            return true;
        const startY = Math.min(position[0], newY);
        const startX = Math.min(position[1], newX);
        const endY = Math.max(position[0], newY);
        const endX = Math.max(position[1], newX);
        for (let i = 1; startX + i < endX || startY + i < endY; i++) {
            if (
                board[Math.min(startY + i, endY)][
                    Math.min(startX + i, endX)
                ] !== Pieces.EMPTY
            ) {
                return false;
            }
        }
        return true;
    };

    const filterIllegalMoves = (
        possibleMoves: PiecePosition[]
    ): PiecePosition[] => {
        const movesFilter = (possibleMove: PiecePosition): boolean => {
            return (
                isInBoard(possibleMove) &&
                isNotOverstepping(possibleMove) &&
                isNotJumpingOver(possibleMove)
            );
        };
        return possibleMoves.filter(movesFilter);
    };

    const getBlackPawnMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [[y + 1, x]];

        if (y == 1) possibleMoves.push([y + 2, x]);
        if (x != 0 && whitePieces.includes(board[y + 1][x - 1]))
            possibleMoves.push([y + 1, x - 1]);
        if (x != 7 && whitePieces.includes(board[y + 1][x + 1]))
            possibleMoves.push([y + 1, x + 1]);
        return possibleMoves;
    };

    const getWhitePawnMoves = (): PiecePosition[] => {
        const possibleMoves: PiecePosition[] = [[y - 1, x]];

        if (y == 6) possibleMoves.push([y - 2, x]);
        if (x != 0 && blackPieces.includes(board[y - 1][x - 1]))
            possibleMoves.push([y - 1, x - 1]);
        if (x != 7 && blackPieces.includes(board[y - 1][x + 1]))
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

    const getKingsMoves = (): PiecePosition[] => {
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
            moves = getKingsMoves();
        }
    };

    if (isRightTurn()) {
        getMoves();
    }
    return filterIllegalMoves(moves);
};

const isMoveLegal = (
    board: Chessboard,
    startPosition: PiecePosition,
    endPosition: PiecePosition,
    currentPlayer: Player
): boolean => {
    const legalMoves = getLegalMoves(board, startPosition, currentPlayer);
    return !!legalMoves.find(
        ([y, x]) => y === endPosition[0] && x === endPosition[1]
    );
};

const Chessboard = () => {
    const [board, setBoard] = useState(initialBoard);
    const [currentPiece, setCurrentPiece] = useState<PiecePosition | null>(
        null
    );
    const [currentPlayer, setCurrentPlayer] = useState<Player>("white");

    const handleSquareClick = (x: number, y: number) => {
        if (currentPiece === null) {
            if (board[y][x] === Pieces.EMPTY) return;
            setCurrentPiece([y, x]);
        } else if (currentPiece[0] === y && currentPiece[1] === x) {
            setCurrentPiece(null);
        } else {
            if (isMoveLegal(board, currentPiece, [y, x], currentPlayer)) {
                const [currentY, currentX] = currentPiece;
                const newBoard = board.map((row) => [...row]);
                newBoard[y][x] = board[currentY][currentX];
                newBoard[currentY][currentX] = Pieces.EMPTY;

                setBoard(newBoard);
                setCurrentPlayer(switchPlayer(currentPlayer));
            }
            setCurrentPiece(null);
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
                                    !!currentPiece &&
                                    currentPiece[0] === y &&
                                    currentPiece[1] === x
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

const Square = ({ x, y, piece, isSelected, onClick }: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const squareClass = isDark ? styles.dark : styles.light;
    const selectionClass = isSelected ? styles.selected : "";

    return (
        <div
            className={[squareClass, selectionClass].join(" ")}
            onClick={() => onClick(x, y)}
        >
            {piece !== Pieces.EMPTY && (
                <Image
                    src={pieceAssets[piece]}
                    alt="piece"
                    width={70}
                    height={70}
                />
            )}
        </div>
    );
};

export default Chessboard;
