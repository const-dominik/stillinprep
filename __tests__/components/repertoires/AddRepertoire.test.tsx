import "@testing-library/jest-dom";

import AddRepertoire from "@/app/_components/repertoires/AddRepertoire";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe("AddRepertoire", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ repertoire: { id: "123" } }),
            })
        ) as jest.Mock;

        pushMock.mockClear();
    });

    const interactions = [
        {
            label: "via Enter key",
            interact: async (input: HTMLElement) => {
                await userEvent.type(input, "test repertoire{enter}");
            },
        },
        {
            label: "via + button click",
            interact: async (input: HTMLElement) => {
                await userEvent.type(input, "test repertoire");
                const button = screen.getByText("+");
                await userEvent.click(button);
            },
        },
    ];

    test.each(interactions)(
        "adds a repertoire $label",
        async ({ interact }) => {
            render(<AddRepertoire />);

            const input = screen.getByPlaceholderText("New repertoire...");
            await interact(input);

            expect(global.fetch).toHaveBeenCalledWith(
                "/api/repertoire",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ name: "test repertoire" }),
                })
            );

            expect(pushMock).toHaveBeenCalledWith("/repertoire/123");
        }
    );
});
