import { expect, test } from "@playwright/test";
import { getLocatorWithText, getSquareBySelector } from "../testing_utils";

test("Stockfish", async ({ page }) => {
    test.slow();
    await page.goto("http://localhost:3000/repertoire/mock-id");

    await test.step("is loaded", async () => {
        await page.evaluate(() => {
            return typeof window.Stockfish !== "undefined";
        });
    });

    await test.step("loads some suggestions for first move", async () => {
        await page.waitForFunction(() => {
            const lines = document.querySelectorAll(
                "div[class*='stockfish-line']"
            );
            return lines.length === 5;
        });
    });

    await test.step("generates best moves after making move", async () => {
        const [e2, e4] = await Promise.all([
            getSquareBySelector(page, [6, 4]),
            getSquareBySelector(page, [4, 4]),
        ]);
        await page.click(e2.selector);
        await page.click(e4.selector);

        await page.waitForFunction(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-move']")
            );
            const moves = lines.map((node) => node.textContent);

            return (
                moves.length === 3 &&
                moves.every((move) => move && Number(move[1]) >= 5)
            );
        });
    });

    await test.step("generates best moves after playing couple more moves", async () => {
        const [e4, f7, f5] = await Promise.all([
            getSquareBySelector(page, [4, 4]),
            getSquareBySelector(page, [1, 5]),
            getSquareBySelector(page, [3, 5]),
        ]);

        await page.click(f7.selector);
        await page.click(f5.selector);
        await page.click(e4.selector);
        await page.click(f5.selector);

        await page.waitForFunction(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-move']")
            );
            const moves = lines.map((node) => node.textContent);

            return (
                moves.length === 3 &&
                moves.some((move) => move && move === "Nh6")
            );
        });
    });

    await test.step("changing move in move history changes eval", async () => {
        const f5 = getLocatorWithText("move", "f5", page).first();
        await f5.click();

        await page.waitForFunction(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-move']")
            );
            const moves = lines.map((node) => node.textContent);

            return moves.some((move) => move && move === "exf5");
        });
    });

    await test.step("changing depth causes recalculcation", async () => {
        // save old scores
        const scores = await page.evaluate(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-score']")
            );
            const moves = lines.map((node) => node.textContent);
            return moves;
        });

        const plus = getLocatorWithText("depth-controls", "+", page);
        await plus.click();

        // after changing depth, moves should disappear while stockfish calculates
        await page.waitForFunction(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-move']")
            );

            return lines.length === 0;
        });

        // after a moment they should appear again
        await page.waitForSelector("div[class*='stockfish-score']");

        // very unlikely that newScores will be exactly equal prev scores
        const newScores = await page.evaluate(() => {
            const lines = Array.from(
                document.querySelectorAll("div[class*='stockfish-score']")
            );
            const moves = lines.map((node) => node.textContent);
            return moves;
        });

        expect(scores).not.toEqual(newScores);
    });
});
