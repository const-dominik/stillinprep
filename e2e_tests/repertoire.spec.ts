import { test, expect } from "@playwright/test";
import { getLocatorWithText, getSquareBySelector } from "./e2e_utils";

test("Test repertoire and move history", async ({ page }) => {
    process.env.TEST_MOCK_DATA = "true";

    await page.route("**", async (route) => {
        if (route.request().method() === "POST") {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    id: "mock-id",
                    name: "Mock Repertoire",
                }),
            });
        } else {
            route.continue();
        }
    });

    await page.goto("http://localhost:3000/repertoire/mock-id");

    await test.step("Clicking piece of opposite player doesn't do anything", async () => {
        const a8 = await getSquareBySelector(page, [0, 0]);

        await page.click(a8.selector, { force: true });

        expect(await a8.square.getAttribute("class")).not.toContain("selected");
    });

    await test.step("Clicking piece of current player selects it and highlights possible moves", async () => {
        const [e2, e3, e4, e5] = await Promise.all([
            getSquareBySelector(page, [6, 4]),
            getSquareBySelector(page, [5, 4]),
            getSquareBySelector(page, [4, 4]),
            getSquareBySelector(page, [3, 4]),
        ]);

        await page.click(e2.selector, { force: true });

        expect(await e2.square.getAttribute("class")).toContain("selected");
        expect(await e3.square.getAttribute("class")).toContain("legal");
        expect(await e4.square.getAttribute("class")).toContain("legal");
        expect(await e5.square.getAttribute("class")).not.toContain("legal");
    });

    await test.step("Clicking illegal move removes selection", async () => {
        const [e2, d4] = await Promise.all([
            getSquareBySelector(page, [6, 4]),
            getSquareBySelector(page, [4, 3]),
        ]);
        expect(await e2.square.getAttribute("class")).toContain("selected");

        await page.click(d4.selector, { force: true });

        expect(await e2.square.getAttribute("class")).not.toContain("selected");
    });

    await test.step("Clicking legal move moves the piece", async () => {
        const [e2, e4] = await Promise.all([
            getSquareBySelector(page, [6, 4]),
            getSquareBySelector(page, [4, 4]),
        ]);
        const pawnImg = await e2.square.$("img");
        expect(pawnImg).not.toBeNull();

        const src = await pawnImg!.getAttribute("src");
        expect(src).not.toBe("");

        await page.click(e2.selector, { force: true });
        await page.click(e4.selector, { force: true });

        const e4Img = await e4.square.$("img");
        const e4ImgSrc = await e4Img!.getAttribute("src");

        const e2Img = await e2.square.$("img");

        expect(e2Img).toBeNull();
        expect(e4ImgSrc).toBe(src);
    });

    await test.step("You can play more moves", async () => {
        const [e7, e5, Ng1, Nf3] = await Promise.all([
            getSquareBySelector(page, [1, 4]),
            getSquareBySelector(page, [3, 4]),
            getSquareBySelector(page, [7, 6]),
            getSquareBySelector(page, [5, 5]),
        ]);

        expect(Ng1).not.toBeNull();

        await page.click(e7.selector, { force: true });
        await page.click(e5.selector, { force: true });
        await page.click(Ng1.selector, { force: true });
        await page.click(Nf3.selector, { force: true });

        const [e7Img, e5Img, Ng1Img, Nf3Img] = await Promise.all([
            e7.square.$("img"),
            e5.square.$("img"),
            Ng1.square.$("img"),
            Nf3.square.$("img"),
        ]);

        expect(e7Img).toBeNull();
        expect(Ng1Img).toBeNull();
        expect(e5Img).not.toBeNull();
        expect(Nf3Img).not.toBeNull();
    });

    await test.step("Move history saves played moves", async () => {
        const e4Text = getLocatorWithText("move-history", "e4", page);
        const e5Text = getLocatorWithText("move-history", "e5", page);
        const Nf3Text = getLocatorWithText("move-history", "Nf3", page);

        await expect(e4Text).toBeVisible();
        await expect(e5Text).toBeVisible();
        await expect(Nf3Text).toBeVisible();
    });

    await test.step("Move history is navigateable by clicking move", async () => {
        const e4Text = getLocatorWithText("move-history", "e4", page);

        const [e4, e5, f3] = await Promise.all([
            getSquareBySelector(page, [4, 4]),
            getSquareBySelector(page, [3, 4]),
            getSquareBySelector(page, [5, 5]),
        ]);

        await expect(e4Text).toBeVisible();
        await e4Text.click({ force: true });

        const [e4Img, e5Img, f3Img] = await Promise.all([
            e4.square.$("img"),
            e5.square.$("img"),
            f3.square.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("Move history is navigateable by keyboard", async () => {
        const e4Text = getLocatorWithText("move-history", "e4", page);
        const e5Text = getLocatorWithText("move-history", "e5", page);

        const [e4, e5, f3] = await Promise.all([
            getSquareBySelector(page, [4, 4]),
            getSquareBySelector(page, [3, 4]),
            getSquareBySelector(page, [5, 5]),
        ]);

        await page.keyboard.press("ArrowRight");

        let [e4Img, e5Img, f3Img] = await Promise.all([
            e4.square.$("img"),
            e5.square.$("img"),
            f3.square.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).not.toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).not.toContain(
            "current-move"
        );
        expect(await e5Text.getAttribute("class")).toContain("current-move");

        await page.keyboard.press("ArrowLeft");

        [e4Img, e5Img, f3Img] = await Promise.all([
            e4.square.$("img"),
            e5.square.$("img"),
            f3.square.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("Move history is navigateable by navigation panel", async () => {
        const e4Text = getLocatorWithText("move-history", "e4", page);
        const e5Text = getLocatorWithText("move-history", "e5", page);

        const leftArrow = getLocatorWithText("tree-navigator", "←", page);
        const rightArrow = getLocatorWithText("tree-navigator", "→", page);

        const [e4, e5, f3] = await Promise.all([
            getSquareBySelector(page, [4, 4]),
            getSquareBySelector(page, [3, 4]),
            getSquareBySelector(page, [5, 5]),
        ]);

        await rightArrow.click({ force: true });

        let [e4Img, e5Img, f3Img] = await Promise.all([
            e4.square.$("img"),
            e5.square.$("img"),
            f3.square.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).not.toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).not.toContain(
            "current-move"
        );
        expect(await e5Text.getAttribute("class")).toContain("current-move");

        await leftArrow.click({ force: true });

        [e4Img, e5Img, f3Img] = await Promise.all([
            e4.square.$("img"),
            e5.square.$("img"),
            f3.square.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("After moving back in history, we can choose other move", async () => {
        const [d7, d5] = await Promise.all([
            getSquareBySelector(page, [1, 3]),
            getSquareBySelector(page, [3, 3]),
        ]);

        await page.click(d7.selector, { force: true });
        await page.click(d5.selector, { force: true });

        const [d7Img, d5Img] = await Promise.all([
            d7.square.$("img"),
            d5.square.$("img"),
        ]);

        expect(d7Img).toBeNull();
        expect(d5Img).not.toBeNull();

        const d5Text = getLocatorWithText("move-history", "d5", page);
        const e5Text = getLocatorWithText("move-history", "e5", page);
        const Nf3Text = getLocatorWithText("move-history", "Nf3", page);

        await expect(d5Text).toBeVisible();
        await expect(e5Text).not.toBeVisible();
        await expect(Nf3Text).not.toBeVisible();
    });

    await test.step("If we have two moves from the position in repertoire, we can choose", async () => {
        const e4 = getLocatorWithText("move-history", "e4", page);
        const otherLines = getLocatorWithText(
            "saved-lines",
            "Saved lines:",
            page
        );

        await expect(otherLines).not.toBeVisible();

        await e4!.click({ force: true });

        await expect(otherLines).toBeVisible();
    });

    await test.step("Given choice, we can't choose current line from Saved lines", async () => {
        const d5 = getLocatorWithText("saved-lines", "d5", page);
        await expect(d5).not.toBeVisible();

        const d5s = await page.locator("text=d5").all();
        expect(d5s).toHaveLength(1);

        const currentd5 = getLocatorWithText("move-history", "d5", page);
        await expect(currentd5).toBeVisible();
    });

    await test.step("If we choose other line, other line is loaded fully", async () => {
        const e5 = getLocatorWithText("saved-lines", "e5", page);

        await e5.click({ force: true });

        await expect(
            getLocatorWithText("saved-lines", "Saved lines:", page)
        ).not.toBeVisible();
        await expect(
            getLocatorWithText("move-history", "e5", page)
        ).toBeVisible();
        await expect(
            getLocatorWithText("move-history", "Nf3", page)
        ).toBeVisible();
    });
});
