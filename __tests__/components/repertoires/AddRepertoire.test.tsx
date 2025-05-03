import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddRepertoire from "@/app/_components/repertoires/AddRepertoire";
import { createRepertoire } from "@/app/actions/repertoire";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

jest.mock("@/app/actions/repertoire", () => ({
    createRepertoire: jest.fn(),
}));

describe("AddRepertoire", () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
            (createRepertoire as jest.Mock).mockResolvedValue({
                id: "mock-id",
                name: "test repertoire",
            });

            render(<AddRepertoire />);
            const input = screen.getByPlaceholderText("New repertoire...");
            await interact(input);

            expect(createRepertoire).toHaveBeenCalledWith("test repertoire");
            expect(pushMock).toHaveBeenCalledWith("/repertoire/mock-id");
        }
    );
});
