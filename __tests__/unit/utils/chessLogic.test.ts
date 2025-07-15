/**
 * @jest-environment node
 */

import { isKingChecked } from "@/components/utils/chessLogic";
import { FENToChessboard } from "@/lib/utils";

describe("chessLogic", () => {
    it("check detection", () => {
        const board = FENToChessboard(
            "r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R"
        );
        expect(isKingChecked(board)).toEqual([]);
    });

    it.todo("gets correct legal moves list");
    it.todo("detects mate");
    it.todo("checks move legality");
});
