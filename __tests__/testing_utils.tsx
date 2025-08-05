import {
    getBoardAfterMove,
    getLegalMoves,
} from "@/components/utils/chessLogic";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { RepertoireProvider } from "@/lib/context/repertoire/RepertoireContext";
import {
    AlgebraicPromotionPieces,
    MoveType,
    PiecePosition,
    Pieces,
    Player,
    StockfishAPI,
} from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";
import { ElementHandle, expect, Page } from "@playwright/test";
import { ReactNode } from "react";
import { MockPositionProvider, MockStockfishProvider } from "./test_providers";

export const create_e4_e5_Nf3 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: e5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 4],
        [3, 4],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: Nf3 } = e5.addMove(
        Pieces.WHITE_KNIGHT,
        [7, 6],
        [5, 5],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    );

    return [e4, e5, Nf3];
};

export const create_e4_d5_exd5 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: d5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 3],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: exd5 } = d5.addMove(
        Pieces.WHITE_PAWN,
        [4, 4],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR")
    );

    return [e4, d5, exd5];
};

const pieceMap = {
    B: 0,
    N: 1,
    R: 2,
    Q: 3,
    K: 4,
};

const isPromotionPiece = (piece: string): piece is AlgebraicPromotionPieces => {
    if (!["B", "N", "R", "Q"].includes(piece)) {
        return false;
    }

    return true;
};

const enPassantDetection = (
    prevMove: string,
    currMove: string,
    player: Player
) => {
    const prevMatch = prevMove.match(/^([a-h])([1-8])$/);
    const nextMatch = currMove.match(/^([a-h])x([a-h])([1-8])$/);
    if (!prevMatch || !nextMatch) return false;

    if (prevMove[prevMove.length - 2] !== currMove[currMove.length - 2])
        return false;

    if (
        (player === "white" &&
            prevMove[prevMove.length - 1] === "5" &&
            currMove[currMove.length - 1] === "6") ||
        (player === "black" &&
            prevMove[prevMove.length - 1] === "4" &&
            currMove[currMove.length - 1] === "3")
    )
        return true;
    return false;
};

const getSquare = (move: string) => {
    const match = move.match(/([a-h][1-8])$/);
    if (!match) throw new Error("Shouldn't happend");
    const square = match[1];
    const col = square[0].charCodeAt(0) - "a".charCodeAt(0);
    const row = 8 - parseInt(square[1]);
    const to: PiecePosition = [row, col];
    return to;
};

const getPiece = (move: string, player: Player): Pieces => {
    const figure = move[0];
    if (!(figure in pieceMap))
        return player === "white" ? Pieces.WHITE_PAWN : Pieces.BLACK_PAWN;

    if (!isPromotionPiece(figure)) {
        throw new Error("Shouldn't happen");
    }

    return player === "white" ? 8 : 2 + pieceMap[figure];
};

export const notationToChessTree = (chess_game: string) => {
    const cleaned_game = chess_game.replace(/\d-\d|½-½|1\/2-1\/2/g, "");
    const noMoveNumbers = cleaned_game
        .replace(/\d+\./g, "")
        .replace(/[+#]/g, "");
    const moves = noMoveNumbers
        .trim()
        .split(/\s+/)
        .filter((move) => move.length > 0);

    console.log(moves);

    const moveList: MovesTreeNode[] = [];
    let lastMove = new MovesTreeNode();
    moveList.push(lastMove);

    moves.forEach((move, index) => {
        const board = lastMove.board;
        const player = lastMove.getCurrentPlayer();

        // === castling ===

        if (move === "0-0" || move === "0-0-0") {
            const row = player === "white" ? 7 : 0;
            const king =
                player === "white" ? Pieces.WHITE_KING : Pieces.BLACK_KING;

            const from: PiecePosition = [row, 4];
            const to: PiecePosition = [row, move === "0-0" ? 6 : 2];
            const castlingType: MoveType =
                move === "0-0" ? "short castling" : "long castling";

            const newBoard = getBoardAfterMove(
                board,
                from,
                to,
                castlingType,
                Pieces.EMPTY
            );

            lastMove = lastMove.addMove(king, from, to, newBoard).node;

            // === promotion ===
        } else if (move.includes("=")) {
            const to = getSquare(move);
            let from: PiecePosition;
            const piece =
                player === "white" ? Pieces.WHITE_PAWN : Pieces.BLACK_PAWN;

            const promotionPiece = move[move.length - 1];

            if (!isPromotionPiece(promotionPiece)) {
                throw new Error("Shouldn't happen");
            }

            const promotionTo: Pieces =
                player === "white" ? 8 : 2 + pieceMap[promotionPiece];

            if (move.includes("x")) {
                from = [
                    player === "white" ? 1 : 6,
                    move[0].charCodeAt(0) - "a".charCodeAt(0),
                ];
            } else {
                from = [player === "white" ? 1 : 6, to[1]];
            }

            const newBoard = getBoardAfterMove(
                board,
                from,
                to,
                "promotion",
                promotionTo
            );

            lastMove = lastMove.addMove(piece, from, to, newBoard).node;
            // === enPassant ===
        } else if (
            index > 1 &&
            enPassantDetection(moves[index - 1], move, player)
        ) {
            const piece =
                player === "white" ? Pieces.WHITE_PAWN : Pieces.BLACK_PAWN;
            const to = getSquare(move);
            const from: PiecePosition = [
                player === "white" ? 3 : 4,
                moves[index - 1].charCodeAt(0) - "a".charCodeAt(0),
            ];
            const newBoard = getBoardAfterMove(
                board,
                from,
                to,
                "en passant",
                piece
            );
            lastMove = lastMove.addMove(piece, from, to, newBoard).node;
        } else {
            const piece = getPiece(move, player);
            const to = getSquare(move);
            const squaresToCheck: PiecePosition[] = [];
            console.log();

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if (board[y][x] === piece) {
                        const legalMoves = getLegalMoves(lastMove, [y, x]);

                        const expectedMove = legalMoves.find(
                            ([[y, x], moveType]) =>
                                y === to[0] &&
                                x === to[1] &&
                                moveType === "normal"
                        );

                        if (!!expectedMove) {
                            squaresToCheck.push([y, x]);
                        }
                    }
                }
            }
            console.log(squaresToCheck);
            if (squaresToCheck.length === 1) {
                const from = squaresToCheck[0];

                const newBoard = getBoardAfterMove(
                    board,
                    from,
                    to,
                    "normal",
                    piece
                );
                lastMove = lastMove.addMove(piece, from, to, newBoard).node;
            } else {
                let from: PiecePosition;
                const match = move.match(/[a-h1-8]/);
                if (match === null) throw new Error("Shouldn't happend");
                if (/^[a-h]$/.test(match[0])) {
                    const col = match[0].charCodeAt(0) - "a".charCodeAt(0);
                    from = squaresToCheck.find(([_, x]) => x === col)!;
                } else {
                    const row = 8 - parseInt(match[0]);
                    from = squaresToCheck.find(([y, _]) => y === row)!;
                }

                const newBoard = getBoardAfterMove(
                    board,
                    from,
                    to,
                    "normal",
                    piece
                );
                lastMove = lastMove.addMove(piece, from, to, newBoard).node;
            }
        }

        moveList.push(lastMove);
        console.log(move);
    });
};

export const TestProviders = ({
    children,
    current,
    last,
    mockSetRoot,
    mockSetLast,
}: {
    children: ReactNode;
    current?: MovesTreeNode;
    last?: MovesTreeNode;
    mockSetRoot?: typeof jest.fn;
    mockSetLast?: typeof jest.fn;
}) => {
    const mockRepertoireData = {
        ratings: "1900",
        timeControls: "rapid",
        depth: "15",
        paths: [],
    };

    const root = new MovesTreeNode();

    return (
        <ConfirmProvider>
            <RepertoireProvider
                repertoireData={mockRepertoireData}
                repertoireId={"test-id"}
            >
                <MockPositionProvider
                    root={current || root}
                    last={last || root}
                    mockSetRoot={mockSetRoot}
                    mockSetLast={mockSetLast}
                >
                    <MockStockfishProvider currentNode={current || root}>
                        {children}
                    </MockStockfishProvider>
                </MockPositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

export const getSquareSelector = (position: PiecePosition) =>
    `div[class*="board"] div:nth-child(${position[0] + 1}) > div:nth-child(${position[1] + 1})`;

export const getSquareBySelector = async (
    page: Page,
    position: PiecePosition
): Promise<{
    square: ElementHandle<SVGElement | HTMLElement>;
    selector: string;
}> => {
    const selector = getSquareSelector(position);
    const square = await page.$(selector);

    expect(square).not.toBeNull();

    if (!square) {
        throw new Error("Square is null.");
    }

    return { square, selector };
};

export const getLocatorWithText = (
    classPart: string,
    text: string,
    page: Page
) => page.locator(`div[class*="${classPart}"] >> text=${text}`);

export const getMockedStockfishAPI = (): StockfishAPI => ({
    setPositionAndGo: jest.fn(),
    setDepth: jest.fn(),
    terminate: jest.fn(),
    multiPV: [
        {
            line: {
                score: { type: "cp", value: 150 },
            },
            nodeId: "123",
        },
    ],
    depth: 15,
});

export const authenticate = () => {};
