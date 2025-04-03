import type {
    AlgebraicPromotionPieces,
    CastleType,
    CastlingRigths,
    Chessboard,
    PiecePosition,
    Player,
} from "@/app/types";
import { Pieces } from "@/app/types";
import { initialBoard, copyBoard, getOppositePlayer } from "@/app/utils";

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
        // Did this move result in check?
        return false;
    }

    public isMate(): boolean {
        // Did this move result in checkmate?
        return false;
    }

    public castled(): CastleType | false {
        // Was this move a castle? 
        return false;
    }

    public promotedTo(): AlgebraicPromotionPieces | false {
        // If this was a promiton, what was pawn promoted to?

        return false;
    }
}