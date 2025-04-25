import { test, expect } from "@playwright/test";
import { getSquareSelector } from "./e2e_utils";

test("test repertoire", async ({ page }) => {
    await page.route("**/api/repertoire/**", async (route) => {
        route.fulfill({
            status: 200,
            body: JSON.stringify({ id: "mock-id", name: "Mock Repertoire" }),
        });
    });
    await page.goto("http://localhost:3000/repertoire/mock-id");

    await test.step("Clicking piece of opposite player doesn't do anything", async () => {
        const a8 = await page.$(getSquareSelector([0, 0]));

        expect(a8).not.toBeNull();

        await a8!.click();

        expect(await a8!.getAttribute("class")).not.toContain("selected");
    });

    await test.step("Clicking piece of current player selects it and highlights possible moves", async () => {
        const [e2, e3, e4, e5] = await Promise.all([
            page.$(getSquareSelector([6, 4])),
            page.$(getSquareSelector([5, 4])),
            page.$(getSquareSelector([4, 4])),
            page.$(getSquareSelector([3, 4])),
        ]);

        expect(e2).not.toBeNull();
        expect(e3).not.toBeNull();
        expect(e4).not.toBeNull();
        expect(e5).not.toBeNull();

        await e2!.click();

        expect(await e2!.getAttribute("class")).toContain("selected");
        expect(await e3!.getAttribute("class")).toContain("legal");
        expect(await e4!.getAttribute("class")).toContain("legal");
        expect(await e5!.getAttribute("class")).not.toContain("legal");
    });

    await test.step("Clicking illegal move removes selection", async () => {
        const [e2, d4] = await Promise.all([
            page.$(getSquareSelector([6, 4])),
            page.$(getSquareSelector([4, 3])),
        ]);
        expect(await e2!.getAttribute("class")).toContain("selected");

        await d4!.click();

        expect(await e2!.getAttribute("class")).not.toContain("selected");
    });

    await test.step("Clicking legal move moves the piece", async () => {
        const [e2, e4] = await Promise.all([
            page.$(getSquareSelector([6, 4])),
            page.$(getSquareSelector([4, 4])),
        ]);
        const pawnImg = await e2!.$("img");
        expect(pawnImg).not.toBeNull();

        const src = await pawnImg!.getAttribute("src");
        expect(src).not.toBe("");

        await e2!.click();
        await e4!.click();

        const e4Img = await e4!.$("img");
        const e4ImgSrc = await e4Img!.getAttribute("src");

        const e2Img = await e2!.$("img");

        expect(e2Img).toBeNull();
        expect(e4ImgSrc).toBe(src);
    });

    await test.step("You can play more moves", async () => {
        const [e7, e5, Ng1, Nf3] = await Promise.all([
            page.$(getSquareSelector([1, 4])),
            page.$(getSquareSelector([3, 4])),

            page.$(getSquareSelector([7, 6])),
            page.$(getSquareSelector([5, 5])),
        ]);

        await e7!.click();
        await e5!.click();
        await Ng1!.click();
        await Nf3!.click();

        const [e7Img, e5Img, Ng1Img, Nf3Img] = await Promise.all([
            e7!.$("img"),
            e5!.$("img"),
            Ng1!.$("img"),
            Nf3!.$("img"),
        ]);

        expect(e7Img).toBeNull();
        expect(Ng1Img).toBeNull();
        expect(e5Img).not.toBeNull();
        expect(Nf3Img).not.toBeNull();
    });

    await test.step("Move history saves played moves", async () => {
        const e4Text = page.getByText("e4");
        const e5Text = page.getByText("e5");
        const Nf3Text = page.getByText("Nf3");

        await expect(e4Text).toBeVisible();
        await expect(e5Text).toBeVisible();
        await expect(Nf3Text).toBeVisible();
    });

    await test.step("Move history is navigateable by clicking move", async () => {
        const e4Text = page.getByText("e4");

        const [e4, e5, f3] = await Promise.all([
            page.$(getSquareSelector([4, 4])),
            page.$(getSquareSelector([3, 4])),
            page.$(getSquareSelector([5, 5])),
        ]);

        await e4Text.click();

        const [e4Img, e5Img, f3Img] = await Promise.all([
            e4!.$("img"),
            e5!.$("img"),
            f3!.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("Move history is navigateable by keyboard", async () => {
        const e4Text = page.getByText("e4");
        const e5Text = page.getByText("e5");

        const [e4, e5, f3] = await Promise.all([
            page.$(getSquareSelector([4, 4])),
            page.$(getSquareSelector([3, 4])),
            page.$(getSquareSelector([5, 5])),
        ]);

        await page.keyboard.press("ArrowRight");

        let [e4Img, e5Img, f3Img] = await Promise.all([
            e4!.$("img"),
            e5!.$("img"),
            f3!.$("img"),
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
            e4!.$("img"),
            e5!.$("img"),
            f3!.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("Move history is navigateable by navigation panel", async () => {
        const e4Text = page.getByText("e4");
        const e5Text = page.getByText("e5");

        const leftArrow = page.getByText("←");
        const rightArrow = page.getByText("→");

        const [e4, e5, f3] = await Promise.all([
            page.$(getSquareSelector([4, 4])),
            page.$(getSquareSelector([3, 4])),
            page.$(getSquareSelector([5, 5])),
        ]);

        await rightArrow.click();

        let [e4Img, e5Img, f3Img] = await Promise.all([
            e4!.$("img"),
            e5!.$("img"),
            f3!.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).not.toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).not.toContain(
            "current-move"
        );
        expect(await e5Text.getAttribute("class")).toContain("current-move");

        await leftArrow.click();

        [e4Img, e5Img, f3Img] = await Promise.all([
            e4!.$("img"),
            e5!.$("img"),
            f3!.$("img"),
        ]);

        expect(e4Img).not.toBeNull();
        expect(e5Img).toBeNull();
        expect(f3Img).toBeNull();
        expect(await e4Text.getAttribute("class")).toContain("current-move");
    });

    await test.step("After moving back in history, we can choose other move", async () => {
        const [d7, d5] = await Promise.all([
            page.$(getSquareSelector([1, 3])),
            page.$(getSquareSelector([3, 3])),
        ]);

        await d7!.click();
        await d5!.click();

        const [d7Img, d5Img] = await Promise.all([d7!.$("img"), d5!.$("img")]);

        expect(d7Img).toBeNull();
        expect(d5Img).not.toBeNull();

        const d5Text = page.getByText("d5");
        const e5Text = page.getByText("e5");
        const Nf3Text = page.getByText("Nf3");

        await expect(d5Text).toBeVisible();
        await expect(e5Text).not.toBeVisible();
        await expect(Nf3Text).not.toBeVisible();
    });

    await test.step("If we have two moves from the position in repertoire, we can choose", async () => {
        const e4 = page.getByText("e4");
        const otherLines = page.getByText("Other lines:");

        await expect(otherLines).not.toBeVisible();

        await e4!.click();

        await expect(otherLines).toBeVisible();
    });

    await test.step("Given choice, we can't choose current line from Other lines", async () => {
        const otherLines = page.getByText("Other lines:");
        const d5 = otherLines.getByText("d5");

        await expect(d5).not.toBeVisible();

        const d5s = await page.locator("text=d5").all();
        expect(d5s).toHaveLength(1);

        const currentd5 = page.getByText("d5");
        await expect(currentd5).toBeVisible();
    });

    await test.step("If we choose other line, other line is loaded fully", async () => {
        const e5 = page.getByText("e5");

        await e5.click();

        await expect(page.getByText("Other lines:")).not.toBeVisible();
        await expect(page.getByText("e5")).toBeVisible();
        await expect(page.getByText("Nf3")).toBeVisible();
    });
});
