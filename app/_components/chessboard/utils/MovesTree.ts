import type {
    AlgebraicPosition,
    AlgebraicPromotionPieces,
    CastleType,
    CastlingRigths,
    Chessboard,
    File,
    PiecePosition,
    Player,
    Rank,
} from "@/app/types";
import { Pieces } from "@/app/types";
import {
    initialBoard,
    copyBoard,
    getOppositePlayer,
    bishopMoves,
    knightMoves,
    rookMoves,
} from "@/app/utils";
import { isInBoard, isMate as checkMate, isKingChecked } from "./chessLogic";
import {
    xToFile,
    yToRank,
    positionToAlgebraicNotation,
} from "./chessAlgebraicNotation";

export class MovesTreeNode {
    public parent: MovesTreeNode;
    public children: MovesTreeNode[] = [];
    public moveId: number;
    public piece: Pieces;
    public from: PiecePosition;
    public to: PiecePosition;
    public player: Player;
    public board: Chessboard;

    constructor(
        piece: Pieces,
        from: PiecePosition,
        to: PiecePosition,
        board: Chessboard = initialBoard
    ) {
        this.parent = this;
        this.children = [];
        this.moveId = 0;
        this.player = "black";
        this.piece = piece;
        this.from = from;
        this.to = to;
        this.board = copyBoard(board);
    }

    public addChild(child: MovesTreeNode) {
        this.children.push(child);
        child.parent = this;
    }

    public addMove(
        piece: Pieces,
        from: PiecePosition,
        to: PiecePosition,
        board: Chessboard
    ): MovesTreeNode {
        const child = new MovesTreeNode(piece, from, to, board);
        child.moveId = this.player === "black" ? this.moveId + 1 : this.moveId;
        child.player = getOppositePlayer(this.player);
        this.addChild(child);
        return child;
    }

    public getCurrentPlayer() {
        return getOppositePlayer(this.player);
    }

    public checkCastlingRigths(rights?: CastlingRigths): CastlingRigths {
        if (!rights) {
            return this.parent.checkCastlingRigths("both");
        }

        if (this.moveId <= 1) return rights;

        if (
            this.piece === Pieces.BLACK_KING ||
            this.piece === Pieces.WHITE_KING
        )
            return "none";

        if (
            (this.piece === Pieces.BLACK_ROOK && this.from[0] === 0) ||
            (this.piece === Pieces.WHITE_ROOK && this.from[0] === 7)
        ) {
            if (this.from[1] === 0) {
                return rights === "long"
                    ? "none"
                    : this.parent.parent.checkCastlingRigths("short");
            }
            if (this.from[1] === 7) {
                return rights === "short"
                    ? "none"
                    : this.parent.parent.checkCastlingRigths("long");
            }
        }
        return this.parent.parent.checkCastlingRigths(rights);
    }

    public getAllMoves(): MovesTreeNode[] {
        const allMoves: MovesTreeNode[] = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node: MovesTreeNode = this;

        while (node.piece !== Pieces.EMPTY) {
            allMoves.push(node);
            node = node.parent;
        }

        return allMoves.toReversed();
    }

    public isCheck(): boolean {
        return isKingChecked(this.board).length > 0;
    }

    public isMate(): boolean {
        return checkMate(this) > 0;
    }

    public castled(): CastleType | false {
        const kings = [Pieces.BLACK_KING, Pieces.WHITE_KING];
        const rooks = [Pieces.BLACK_ROOK, Pieces.WHITE_ROOK];

        /// === black's castling ===
        if (
            kings.includes(this.parent.board[0][4]) &&
            rooks.includes(this.parent.board[0][7]) &&
            kings.includes(this.board[0][6]) &&
            rooks.includes(this.board[0][5])
        )
            return "short";
        if (
            kings.includes(this.parent.board[0][4]) &&
            rooks.includes(this.parent.board[0][0]) &&
            kings.includes(this.board[0][3]) &&
            rooks.includes(this.board[0][2])
        )
            return "long";

        /// === white's castling ===
        if (
            kings.includes(this.parent.board[7][4]) &&
            rooks.includes(this.parent.board[7][7]) &&
            kings.includes(this.board[7][6]) &&
            rooks.includes(this.board[7][5])
        )
            return "short";
        if (
            kings.includes(this.parent.board[7][4]) &&
            rooks.includes(this.parent.board[7][0]) &&
            kings.includes(this.board[7][3]) &&
            rooks.includes(this.board[7][2])
        )
            return "long";

        return false;
    }

    public promotedTo(): AlgebraicPromotionPieces | false {
        if (
            this.parent.board[this.from[0]][this.from[1]] !==
            this.board[this.to[0]][this.to[1]]
        ) {
            const piece = this.board[this.to[0]][this.to[1]];

            if ([Pieces.BLACK_BISHOP, Pieces.WHITE_BISHOP].includes(piece))
                return "B";
            if ([Pieces.BLACK_KNIGHT, Pieces.WHITE_KNIGHT].includes(piece))
                return "N";
            if ([Pieces.BLACK_ROOK, Pieces.WHITE_ROOK].includes(piece))
                return "R";
            if ([Pieces.BLACK_QUEEN, Pieces.WHITE_QUEEN].includes(piece))
                return "Q";
        }

        return false;
    }

    private pieceDetection(
        sqare: PiecePosition,
        piece: Pieces
    ): PiecePosition[] {
        if (
            [Pieces.EMPTY, Pieces.BLACK_KING, Pieces.WHITE_KING].includes(piece)
        )
            throw new Error("Only bishops, knighs, rooks and queens");
        const [y, x] = sqare;
        const detectedPieces: PiecePosition[] = [];

        if ([Pieces.BLACK_KNIGHT, Pieces.WHITE_KNIGHT].includes(piece)) {
            for (const [dy, dx] of knightMoves) {
                const ny = y + dy;
                const nx = x + dx;
                if (isInBoard([ny, nx]) && piece === this.parent.board[ny][nx])
                    detectedPieces.push([ny, nx]);
            }
        } else {
            const movement: PiecePosition[] = [];
            if ([Pieces.BLACK_BISHOP, Pieces.WHITE_BISHOP].includes(piece))
                movement.push(...bishopMoves);
            if ([Pieces.BLACK_ROOK, Pieces.WHITE_ROOK].includes(piece))
                movement.push(...rookMoves);
            if ([Pieces.BLACK_QUEEN, Pieces.WHITE_QUEEN].includes(piece)) {
                movement.push(...bishopMoves);
                movement.push(...rookMoves);
            }

            for (const [dy, dx] of movement) {
                let ny = y + dy;
                let nx = x + dx;
                while (
                    isInBoard([ny, nx]) &&
                    this.parent.board[ny][nx] === Pieces.EMPTY
                ) {
                    ny += dy;
                    nx += dx;
                }

                if (isInBoard([ny, nx]) && this.parent.board[ny][nx] === piece)
                    detectedPieces.push([ny, nx]);
            }
        }

        return detectedPieces;
    }

    public getPrecisePosition(): File | Rank | AlgebraicPosition | "" {
        // Do we need to define piece more precisely, e.g. Raxe5?
        // Should return piece file/rank/full position if extra precision is needed, else ""
        const piece = this.board[this.to[0]][this.to[1]];
        // === Pawns ===
        if (
            [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece) &&
            this.from[1] !== this.to[1]
        ) {
            const dx = this.to[1] - this.from[0];
            const otherside: PiecePosition = [this.to[0], this.from[1] - dx];
            if (
                isInBoard(otherside) &&
                this.board[otherside[0]][otherside[1]] === piece
            )
                return xToFile(otherside[0]);
        }

        // === Kings ===
        if ([Pieces.BLACK_KING, Pieces.WHITE_KING].includes(piece)) return "";

        // === Bishops, knighs, rooks and queens ===
        const positionsToCheck = this.pieceDetection(this.to, piece);

        if (positionsToCheck.length > 1) {
            const xFilter = positionsToCheck.filter(
                ([, x]) => x == this.from[1]
            );
            const yFilter = positionsToCheck.filter(([y]) => y == this.from[0]);

            if (xFilter.length === 1) return xToFile(this.from[1]);
            if (yFilter.length === 1) return yToRank(this.from[0]);
            return positionToAlgebraicNotation(this.from);
        }

        return "";
    }
}
