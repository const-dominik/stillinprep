import { PiecePosition } from "@/app/types/types";
import { expect, Page, ElementHandle } from "@playwright/test";

export const getSquareSelector = (position: PiecePosition) =>
    `div[class*="board"] div:nth-child(${position[0] + 1}) > div:nth-child(${position[1] + 1})`;

export const getSquareBySelector = async (
    page: Page,
    position: PiecePosition
): Promise<{
    square: ElementHandle<SVGElement | HTMLElement>;
    selector: string;
}> => {
    const selector = getSquareSelector(position);
    const square = await page.$(selector);

    expect(square).not.toBeNull();
    if (!square) {
        throw new Error("what?");
    }
    return { square, selector };
};

export const getLocatorWithText = (
    classPart: string,
    text: string,
    page: Page
) => page.locator(`div[class*="${classPart}"] >> text=${text}`);
