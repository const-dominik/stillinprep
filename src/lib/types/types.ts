import { MovesTreeNode } from "@/components/utils/MovesTree";
import { z } from "zod/v4";
import {
    LichessMovePopularityResponse,
    MoveSchema,
    PathSchema,
    PopularMove,
    RepertoireSchema,
} from "../schema";

export const enum Pieces {
    EMPTY,

    WHITE_PAWN,
    WHITE_BISHOP,
    WHITE_KNIGHT,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,

    BLACK_PAWN,
    BLACK_BISHOP,
    BLACK_KNIGHT,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING,
}

export type Chessboard = Pieces[][];
export type Player = "white" | "black";
export type PiecePosition = [y: number, x: number];
export type CastleType = "short" | "long";
export type CastlingRigths = "both" | "none" | CastleType;
export type Move = {
    from: PiecePosition;
    to: PiecePosition;
};
export type MoveType =
    | "normal"
    | "en passant"
    | "promotion"
    | "long castling"
    | "short castling";

export type BoardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type BoardFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type AlgebraicPiece = "" | "K" | "Q" | "N" | "B" | "R";
export type AlgebraicPromotionPieces = "Q" | "N" | "B" | "R";
export type AlgebraicPosition = `${BoardFile}${BoardRank}`;

export type Repertoire = z.infer<typeof RepertoireSchema>;

export type StockfishAPI = {
    multiPV: Analysis;
    depth: number;
    setPositionAndGo: (moves: string) => void;
    setDepth: (depth: number) => void;
    terminate: () => void;
};

export type StockfishEval = {
    type: "cp" | "mate";
    value: number;
};

export type ParsedLine = {
    depth?: number;
    seldepth?: number;
    multipv?: number;
    score?: StockfishEval;
    pv?: string[];
};

export type Analysis = {
    line: ParsedLine;
    nodeId: string;
}[];

export type UCIPromotionPiece = "r" | "q" | "n" | "b";

export type Stockfish = Promise<{
    postMessage: (command: string) => void;
    addMessageListener: (cb: (line: string) => void) => void;
    terminate: () => void;
}>;

export type DbType = "players" | "masters";
export type TimeControl =
    | "ultraBullet"
    | "bullet"
    | "blitz"
    | "rapid"
    | "classical"
    | "correspondence";
export type LiDbRating =
    | 0
    | 1000
    | 1200
    | 1400
    | 1600
    | 1800
    | 2000
    | 2200
    | 2500;
export type LiDbAvgRating =
    | 500
    | 1100
    | 1300
    | 1500
    | 1700
    | 1900
    | 2100
    | 2300;

export type MovePopualritySettings = {
    timeControls: TimeControl[];
    ratings: LiDbAvgRating[];
};

type LiQueryCommonParams = {
    play: string;
    moves: number;
};

type LichessParams = LiQueryCommonParams & {
    db: "lichess";
    variant: "standard";
    speeds: TimeControl[];
    ratings: LiDbRating[];
};

type MastersParams = LiQueryCommonParams & {
    db: "masters";
};

export type LiAPIQueryParameters = LichessParams | MastersParams;

export type MoveData = {
    parent: string;
    repertoire: string;
    move: {
        name: string;
        from: PiecePosition;
        to: PiecePosition;
        promotion: AlgebraicPromotionPieces | null;
        id: string;
    };
};

export type GroupedMoves = {
    moveNumber: number;
    whiteMove: MovesTreeNode;
    blackMove?: MovesTreeNode;
}[];

export type LichessResponse = z.infer<typeof LichessMovePopularityResponse>;
export type LichessPopularMove = z.infer<typeof PopularMove>;
export type MoveNode = z.infer<typeof MoveSchema>;
export type PathNodes = MoveNode["properties"][];
export type Paths = z.infer<typeof PathSchema>[];

export type RepertoireData = {
    id: string;
    timeControls: TimeControl[];
    ratings: LiDbAvgRating[];
    depth: number;
    paths: PathNodes[];
    color: "white" | "black";
};

export type PositionContextValue = {
    currentNode: MovesTreeNode;
    lastNode: MovesTreeNode;
    setCurrentNode: (n: MovesTreeNode) => void;
    setLastNode: (n: MovesTreeNode) => void;
};

export type PendingPromotion = {
    from: PiecePosition;
    to: PiecePosition;
};

export type SelectedPieceData = {
    position: PiecePosition | null;
    legalMoves: [PiecePosition, MoveType][];
};

export type RegistrationData = {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type GivenAccess = {
    nickname: string;
    mode: "readonly" | "edit";
};

export type RepertoireEditData = {
    name: string;
    visibility: "private" | "public";
    hasAccess: GivenAccess[];
    color: "white" | "black";
};

export type Puzzle = {
    color: "white" | "black";
    root: MovesTreeNode;
    startingNode: MovesTreeNode;
    targetNode: MovesTreeNode;
    solution: number[];
    newLeaf: MovesTreeNode | null;
};

export type PuzzleFeedback = "other" | "correct" | "wrong" | "go" | "done";
export type PuzzleMode = "global" | "spaced" | "repertoire";
export type MyOption = { label: string; value: string };
