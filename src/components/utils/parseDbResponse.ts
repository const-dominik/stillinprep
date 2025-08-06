import {
    Chessboard,
    LiDbAvgRating,
    MoveType,
    PathNodes,
    Paths,
    PiecePosition,
    Pieces,
    Player,
    TimeControl,
} from "@/lib/types/types";
import { liRatingsAvgs, liTimeControls } from "@/lib/utils";
import { getBoardAfterMove } from "./chessLogic";
import { MovesTreeNode } from "./MovesTree";

const getPromotionPiece = (letter: string, player: Player): Pieces => {
    if (player === "white") {
        if (letter === "B") {
            return Pieces.WHITE_BISHOP;
        } else if (letter === "N") {
            return Pieces.WHITE_KNIGHT;
        } else if (letter === "R") {
            return Pieces.WHITE_ROOK;
        } else if (letter === "Q") {
            return Pieces.WHITE_QUEEN;
        }
    } else if (player === "black") {
        if (letter === "B") {
            return Pieces.BLACK_BISHOP;
        } else if (letter === "N") {
            return Pieces.BLACK_KNIGHT;
        } else if (letter === "R") {
            return Pieces.BLACK_ROOK;
        } else if (letter === "Q") {
            return Pieces.BLACK_QUEEN;
        }
    }
    throw new Error("Shouldn't happend");
};

const enPassantDetection = (
    board: Chessboard,
    from: PiecePosition,
    to: PiecePosition
): boolean => {
    const piece = board[from[0]][from[1]];
    if (
        (piece === Pieces.WHITE_PAWN || piece === Pieces.BLACK_PAWN) &&
        from[1] !== to[1] &&
        board[to[0]][to[1]] === Pieces.EMPTY
    )
        return true;

    return false;
};

export const mergePathsIntoTree = (segments: PathNodes[]) => {
    const root = new MovesTreeNode();
    let lastMove = root;
    let longest = 1;
    for (const path of segments) {
        let current = root;

        for (const move of path) {
            const piece = current.board[move.from[0]][move.from[1]];
            const kings = [Pieces.BLACK_KING, Pieces.WHITE_KING];
            const pawns = [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN];
            let moveType: MoveType = "normal";
            let promotingTo = Pieces.EMPTY;

            if (kings.includes(piece) && move.to[1] - move.from[1] === 2) {
                moveType = "short castling";
            }
            if (kings.includes(piece) && move.to[1] - move.from[1] === -2) {
                moveType = "long castling";
            }
            if (pawns.includes(piece) && [0, 7].includes(move.to[0])) {
                moveType = "promotion";
                promotingTo = getPromotionPiece(
                    move.promotion,
                    current.getCurrentPlayer()
                );
            }
            if (enPassantDetection(current.board, move.from, move.to)) {
                moveType = "en passant";
            }

            const board = getBoardAfterMove(
                current.board,
                move.from,
                move.to,
                moveType,
                promotingTo
            );
            const { node } = current.addMove(
                board[move.to[0]][move.to[1]],
                move.from,
                move.to,
                board
            );

            current = node;
        }

        if (path.length > longest) {
            lastMove = current;
            longest = path.length;
        }
    }

    return [root, lastMove];
};

export const flattenResult = (paths: Paths) =>
    paths!.map((path) =>
        // this reduce just returns for each path it's simple flat version - list of nodes from root to leaf
        path.segments.reduce<PathNodes>(
            (arr, segment) => {
                arr.push(segment.end.properties);

                return arr;
            },
            [] as unknown as PathNodes
        )
    );

const timeControlGuard = (s: string): s is TimeControl =>
    (liTimeControls as string[]).includes(s);

const ratingsGuard = (rating: number): rating is LiDbAvgRating =>
    (liRatingsAvgs as number[]).includes(rating);

const parseTimeControls = (timeControls: string): TimeControl[] => {
    const timeControlsArr = timeControls.split(",");
    if (timeControlsArr.every((control) => timeControlGuard(control))) {
        return timeControlsArr;
    }

    throw new Error("Unknown time controls!");
};

const parseRatings = (ratings: string): LiDbAvgRating[] => {
    const ratingsArr = ratings.split(",").map((n) => Number(n));
    if (ratingsArr.every((rating) => ratingsGuard(rating))) {
        return ratingsArr;
    }

    throw new Error("Unknown ratings!");
};

export const getTimeControls = (timeControls: string | null): TimeControl[] => {
    if (!timeControls) {
        return ["rapid"];
    }

    return parseTimeControls(timeControls);
};

export const getRatings = (ratings: string | null): LiDbAvgRating[] => {
    if (!ratings) {
        return [1700, 1900, 2100];
    }

    return parseRatings(ratings);
};

export const getDepth = (depth: string | null): number => {
    if (!depth) {
        return 15;
    }

    return Number(depth);
};
