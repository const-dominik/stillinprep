import type {
    CastlingRigths,
    Chessboard,
    PiecePosition,
    Player,
} from "@/app/types";
import { Pieces } from "@/app/types";
import { initialBoard, copyBoard } from "@/app/utils";

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
        this.board = board;
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
        child.player = this.player === "black" ? "white" : "black";
        child.parent = this;
        this.addChild(child);
        return child;
    }

    public checkCastlingRigths(rights: CastlingRigths): CastlingRigths {
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
}

export class MovesTree {
    private root: MovesTreeNode;
    private currentNode: MovesTreeNode;

    constructor() {
        this.root = new MovesTreeNode(Pieces.EMPTY, [0, 0], [0, 0]);
        this.currentNode = this.root;
    }

    public addMove(
        piece: Pieces,
        from: PiecePosition,
        to: PiecePosition,
        board: Chessboard
    ) {
        const newBoard = copyBoard(board);
        this.currentNode = this.currentNode.addMove(piece, from, to, newBoard);
    }

    public checkCastlingRigths(): CastlingRigths {
        return this.currentNode.parent.checkCastlingRigths("both");
    }
}
