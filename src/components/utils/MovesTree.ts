import {
    AlgebraicPosition,
    AlgebraicPromotionPieces,
    BoardFile,
    BoardRank,
    CastleType,
    CastlingRigths,
    Chessboard,
    PiecePosition,
    Pieces,
    Player,
} from "@/lib/types/types";
import {
    bishopMoves,
    chessboardToFEN,
    copyBoard,
    getOppositePlayer,
    initialBoard,
    knightMoves,
    rookMoves,
    xToFile,
    yToRank,
} from "@/lib/utils";
import { createHash } from "crypto";
import {
    getAlgebraicMove,
    positionToAlgebraicNotation,
} from "./chessAlgebraicNotation";
import { isCheckmate, isInBoard, isKingChecked } from "./chessLogic";

export class MovesTreeNode {
    public parent: MovesTreeNode;
    public children: MovesTreeNode[] = [];
    public moveId: number;
    public piece: Pieces;
    public from: PiecePosition;
    public to: PiecePosition;
    public player: Player;
    public board: Chessboard;
    private isPuzzleClaimed: boolean;
    private algebraicNotation: string;
    private hash: string;

    constructor(
        piece: Pieces = Pieces.EMPTY,
        from: PiecePosition = [0, 0],
        to: PiecePosition = [0, 0],
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
        this.algebraicNotation = "";
        this.hash = "";
        this.isPuzzleClaimed = false;
    }

    private addChild(child: MovesTreeNode) {
        this.children.push(child);
        child.parent = this;
    }

    public addMove(
        piece: Pieces,
        from: PiecePosition,
        to: PiecePosition,
        board: Chessboard
    ): { node: MovesTreeNode; isNew: boolean } {
        const childId = this.player === "black" ? this.moveId + 1 : this.moveId;
        const existingMove = this.children.find((move) => {
            return (
                move.piece === piece &&
                from[0] === move.from[0] &&
                from[1] === move.from[1] &&
                to[0] === move.to[0] &&
                to[1] === move.to[1] &&
                move.moveId === childId
            );
        });

        if (existingMove) {
            return { node: existingMove, isNew: false };
        }

        const child = new MovesTreeNode(piece, from, to, board);
        child.moveId = this.player === "black" ? this.moveId + 1 : this.moveId;
        child.player = getOppositePlayer(this.player);
        this.addChild(child);
        return { node: child, isNew: true };
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
        return isCheckmate(this) > 0;
    }

    public castled(): CastleType | false {
        if (
            this.piece !== Pieces.BLACK_KING &&
            this.piece !== Pieces.WHITE_KING
        ) {
            return false;
        }

        const xDifference = this.from[1] - this.to[1];
        if (xDifference === -2) return "short";
        if (xDifference === 2) return "long";
        return false;
    }

    public promotedTo(): [Pieces, AlgebraicPromotionPieces] | false {
        const prevPiece = this.parent.board[this.from[0]][this.from[1]];
        const currentPiece = this.board[this.to[0]][this.to[1]];

        if (prevPiece === currentPiece) return false;

        const promotionMap: [Pieces[], AlgebraicPromotionPieces][] = [
            [[Pieces.BLACK_BISHOP, Pieces.WHITE_BISHOP], "B"],
            [[Pieces.BLACK_KNIGHT, Pieces.WHITE_KNIGHT], "N"],
            [[Pieces.BLACK_ROOK, Pieces.WHITE_ROOK], "R"],
            [[Pieces.BLACK_QUEEN, Pieces.WHITE_QUEEN], "Q"],
        ];

        for (const [pieces, algebraicPiece] of promotionMap) {
            if (pieces.includes(currentPiece)) {
                return [prevPiece, algebraicPiece];
            }
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

    public getPrecisePosition():
        | BoardFile
        | BoardRank
        | AlgebraicPosition
        | "" {
        const piece = this.board[this.to[0]][this.to[1]];
        // === Pawns ===
        // if (
        //     [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece) &&
        //     this.from[1] !== this.to[1]
        // ) {
        //     const dx = this.to[1] - this.from[0];
        //     const otherside: PiecePosition = [this.to[0], this.from[1] - dx];
        //     if (
        //         isInBoard(otherside) &&
        //         this.board[otherside[0]][otherside[1]] === piece
        //     )
        //         return xToFile(otherside[0]);
        // }

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

    public getAlgebraicNotation(): string {
        if (this.algebraicNotation === "") {
            this.algebraicNotation = getAlgebraicMove(this);
        }

        return this.algebraicNotation;
    }

    public getMoveHash(): string {
        if (this.hash === "") {
            const compositeKey = `${this.moveId}${this.from[0]}${this.from[1]}${this.to[0]}${this.to[1]}${chessboardToFEN(this.board)}`;
            this.hash = createHash("sha256").update(compositeKey).digest("hex");
        }

        return this.hash;
    }

    public isClaimed(): boolean {
        return this.isPuzzleClaimed;
    }

    public claim() {
        this.isPuzzleClaimed = true;
    }

    private getPath(): MovesTreeNode[] {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node: MovesTreeNode = this;
        const nodeArr: MovesTreeNode[] = [];

        while (node.moveId > 0) {
            nodeArr.push(node);
            node = node.parent;
        }
        return nodeArr.reverse();
    }

    private pieceToFEN(piece: Pieces): string {
        switch (piece) {
            case Pieces.WHITE_PAWN:
                return "P";
            case Pieces.WHITE_KNIGHT:
                return "N";
            case Pieces.WHITE_BISHOP:
                return "B";
            case Pieces.WHITE_ROOK:
                return "R";
            case Pieces.WHITE_QUEEN:
                return "Q";
            case Pieces.WHITE_KING:
                return "K";

            case Pieces.BLACK_PAWN:
                return "p";
            case Pieces.BLACK_KNIGHT:
                return "n";
            case Pieces.BLACK_BISHOP:
                return "b";
            case Pieces.BLACK_ROOK:
                return "r";
            case Pieces.BLACK_QUEEN:
                return "q";
            case Pieces.BLACK_KING:
                return "k";

            default:
                return "0";
        }
    }

    private isCapture(): boolean {
        let pieceCount1 = 0;
        for (const row of this.board)
            for (const square of row)
                if (square !== Pieces.EMPTY) pieceCount1 += 1;

        let pieceCount2 = 0;
        for (const row of this.board)
            for (const square of row)
                if (square !== Pieces.EMPTY) pieceCount2 += 1;

        return pieceCount1 !== pieceCount2;
    }

    private getBoardFEN(): string {
        let FENBoard = "";
        let emptyCount = 0;
        for (const row in this.board) {
            emptyCount = 0;
            for (const square in this.board) {
                const letter = this.pieceToFEN(this.board[row][square]);
                if (letter === "0") {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        FENBoard += String(emptyCount);
                    }
                    emptyCount = 0;
                    FENBoard += letter;
                }
            }
            if (emptyCount > 0) {
                FENBoard += String(emptyCount);
            }
            FENBoard += "/";
        }
        return FENBoard.slice(0, -1) + " ";
    }

    private getColorFEN(): string {
        return "white" === this.getCurrentPlayer() ? "w " : "b ";
    }

    private getCastlingRightsFEN(): string {
        const nodeArr = this.getPath();
        const rights = [true, true, true, true];
        const letters = ["K", "Q", "k", "q"];

        for (const node of nodeArr) {
            const piece = node.piece;

            if (piece === Pieces.WHITE_KING) {
                rights[0] = false;
                rights[1] = false;
            }
            if (piece === Pieces.BLACK_KING) {
                rights[2] = false;
                rights[3] = false;
            }

            if (piece === Pieces.WHITE_ROOK && node.from[1] === 7)
                rights[0] = false;
            if (piece === Pieces.WHITE_ROOK && node.from[1] === 0)
                rights[1] = false;
            if (piece === Pieces.BLACK_ROOK && node.from[1] === 7)
                rights[2] = false;
            if (piece === Pieces.BLACK_ROOK && node.from[1] === 0)
                rights[3] = false;
        }

        let castlingFEN = "";
        for (let i = 0; i < 4; i++) {
            if (rights[i]) castlingFEN += letters[i];
        }
        if (castlingFEN === "") castlingFEN = "-";

        return castlingFEN + " ";
    }

    private enPassantFEN(): string {
        let enpFEN = "- ";
        if (
            [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(this.piece) &&
            Math.abs(this.from[0] - this.to[0]) === 2
        ) {
            const [y, x] = this.to;
            const otherPawn =
                this.piece === Pieces.WHITE_PAWN
                    ? Pieces.BLACK_PAWN
                    : Pieces.WHITE_PAWN;

            if (
                (x > 0 && this.board[y][x - 1] === otherPawn) ||
                (x < 7 && this.board[y][x + 1] === otherPawn)
            ) {
                enpFEN = String.fromCharCode(97 + x);
                enpFEN += this.piece === Pieces.WHITE_PAWN ? "3 " : "6 ";
            }
        }
        return enpFEN;
    }

    private rule50FEN(): string {
        if (this.moveId === 0) return "0 ";

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node: MovesTreeNode = this;
        let count = 0;

        while (count < 50) {
            if (
                [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(node.piece) ||
                node.isCapture() ||
                node.moveId === 0
            )
                return String(count) + " ";

            count += 1;
            node = node.parent;
        }
        return "50 ";
    }

    private getMoveFEN(): string {
        if (this.getCurrentPlayer() === "white") return String(this.moveId + 1);
        return String(this.moveId);
    }

    public getFEN() {
        let FEN = this.getBoardFEN();
        FEN += this.getColorFEN();
        FEN += this.getCastlingRightsFEN();
        FEN += this.enPassantFEN();
        FEN += this.rule50FEN();
        FEN += this.getMoveFEN();
        return FEN;
    }
}
