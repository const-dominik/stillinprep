import { getSquareBySelector } from "./e2e_utils";
import { test, expect } from "@playwright/test";

test("White promotion to Rook", async ({ page }) => {
    await page.route("**/api/repertoire/**", async (route) => {
        route.fulfill({
            status: 200,
            body: JSON.stringify({ id: "mock-id", name: "Mock Repertoire" }),
        });
    });
    await page.goto("http://localhost:3000/repertoire/mock-id");

    const [e2, e4, f7, f5, e7, e5, f6, f8, d6, e8] = await Promise.all([
        getSquareBySelector(page, [6, 4]),
        getSquareBySelector(page, [4, 4]),
        getSquareBySelector(page, [1, 5]),
        getSquareBySelector(page, [3, 5]),
        getSquareBySelector(page, [1, 4]),
        getSquareBySelector(page, [3, 4]),
        getSquareBySelector(page, [2, 5]),
        getSquareBySelector(page, [0, 5]),
        getSquareBySelector(page, [2, 3]),
        getSquareBySelector(page, [0, 4]),
    ]);

    await page.click(e2.selector, { force: true });
    await page.click(e4.selector, { force: true });
    await page.click(f7.selector, { force: true });
    await page.click(f5.selector, { force: true });
    await page.click(e4.selector, { force: true });
    await page.click(f5.selector, { force: true });
    await page.click(e7.selector, { force: true });
    await page.click(e5.selector, { force: true });
    await page.click(f5.selector, { force: true });
    await page.click(f6.selector, { force: true });
    await page.click(f8.selector, { force: true });
    await page.click(d6.selector, { force: true });
    await page.click(f6.selector, { force: true });
    await page.click(f7.selector, { force: true });
    await page.click(e8.selector, { force: true });
    await page.click(e7.selector, { force: true });
    await page.click(f7.selector, { force: true });
    await page.click(f8.selector, { force: true });
    await page.click(f7.selector, { force: true });

    const img = await f8.square.$("img");

    expect(img).not.toBeNull();
    expect(await img?.getAttribute("src")).toContain("R");
});
