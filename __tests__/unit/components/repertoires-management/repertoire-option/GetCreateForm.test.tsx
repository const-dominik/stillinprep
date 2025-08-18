import GetCreateForm from "@/components/repertoires-management/repertoire-option/GetCreateForm";
import { createRepertoire } from "@/lib/actions/repertoire";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

jest.mock("@/lib/actions/repertoire", () => ({
    createRepertoire: jest.fn(),
}));

describe("GetCreateForm", () => {
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
                success: true,
                value: {
                    id: "mock-id",
                    name: "test repertoire",
                },
            });

            render(
                <GetCreateForm
                    search=""
                    setSearch={() => {}}
                    hasRepertoires={false}
                />
            );
            const input = screen.getByPlaceholderText(
                "Enter name of your new repertoire for white..."
            );
            await interact(input);

            expect(createRepertoire).toHaveBeenCalledWith(
                "test repertoire",
                "white"
            );
            expect(pushMock).toHaveBeenCalledWith(
                "/repertoire/mock-id?type=new&color=white"
            );
        }
    );

    it("renders repertoire search", async () => {
        const setSearch = jest.fn();

        render(
            <GetCreateForm
                search=""
                setSearch={setSearch}
                hasRepertoires={true}
            />
        );

        const input = screen.getByPlaceholderText("Find repertoire...");

        expect(input);

        await userEvent.type(input, "test");

        expect(setSearch).toHaveBeenCalledTimes(4);
    });

    it("doesn't try to create repertoire with empty/whitespace string name", async () => {
        render(
            <GetCreateForm
                search=""
                setSearch={jest.fn()}
                hasRepertoires={false}
            />
        );

        const input = screen.getByPlaceholderText(
            "Enter name of your new repertoire for white..."
        );

        await userEvent.click(input);
        await userEvent.keyboard("{enter}");

        expect(createRepertoire).not.toHaveBeenCalled();

        await userEvent.type(input, "     {enter}");
        expect(createRepertoire).not.toHaveBeenCalled();
    });

    it("blocks creating more repertoires when waiting for creation", async () => {
        render(
            <GetCreateForm
                search=""
                setSearch={jest.fn()}
                hasRepertoires={false}
            />
        );

        (createRepertoire as jest.Mock).mockResolvedValue(
            new Promise((res) => {
                const response = {
                    success: true,
                    value: {
                        id: "mock-id",
                        name: "test repertoire",
                    },
                };
                setTimeout(() => res(response), 2000);
            })
        );

        const input = screen.getByPlaceholderText(
            "Enter name of your new repertoire for white..."
        );

        await userEvent.type(input, "test");
        const button = screen.getByText("+");

        for (let i = 0; i < 10; i++) {
            await userEvent.click(button);
        }

        expect(createRepertoire).toHaveBeenCalledTimes(1);
    });
});
