import {
    LiDbAvgRating,
    PathNodes,
    Paths,
    Pieces,
    TimeControl,
} from "@/lib/types/types";
import { liRatingsAvgs, liTimeControls } from "@/lib/utils";
import { getBoardAfterMove } from "./chessLogic";
import { MovesTreeNode } from "./MovesTree";

export const mergePathsIntoTree = (segments: PathNodes[]) => {
    const root = new MovesTreeNode();
    let lastMove = root;
    let longest = 1;
    for (const path of segments) {
        let current = root;

        for (const move of path) {
            // TODO: proper move type and promotion piece
            const board = getBoardAfterMove(
                current.board,
                move.from,
                move.to,
                "normal",
                Pieces.EMPTY
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
