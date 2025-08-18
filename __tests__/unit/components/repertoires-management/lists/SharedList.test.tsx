import SharedList from "@/components/repertoires-management/lists/SharedList";
import { DbRepertoires } from "@/lib/types/backend-types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
}));

describe("SharedList", () => {
    it("renders info if no repertoires passed", () => {
        render(<SharedList sharedRepertoires={[]} />);
        const info = screen.getByText("Nobody shared a repertoire with you.");
        expect(info).toBeVisible();
    });

    it("doesn't render search if no repertoires passed", () => {
        render(<SharedList sharedRepertoires={[]} />);
        const search = screen.queryByPlaceholderText("Find repertoire...");
        expect(search).not.toBeInTheDocument();
    });

    it("renders passed repertoires", () => {
        const repertoireList: DbRepertoires["shared"] = [
            {
                id: "1",
                name: "test1!",
                visibility: "private",
                source: "shared",
                accessMode: "edit",
                owner: { nickname: "Dominik", id: "user-1" },
                color: "white",
            },
            {
                id: "2",
                name: "test2!",
                visibility: "public",
                source: "shared",
                accessMode: "readonly",
                owner: { nickname: "Michał", id: "user-2" },
                color: "white",
            },
        ];
        render(<SharedList sharedRepertoires={repertoireList} />);

        repertoireList.forEach(({ name, owner, accessMode }) => {
            const repertoireElement = screen.getByText(name);
            const elementByName = screen.getByText(owner.nickname);
            const icon = screen.getByTestId(accessMode);

            expect(repertoireElement).toBeInTheDocument();
            expect(elementByName).toBeInTheDocument();
            expect(icon).toBeInTheDocument();
        });
    });

    it("filters repertoires based on search bar", async () => {
        const repertoireList: DbRepertoires["shared"] = [
            {
                id: "1",
                name: "Sicilian",
                visibility: "public",
                source: "shared",
                accessMode: "edit",
                color: "white",
                owner: { nickname: "Michał", id: "user-2" },
            },
            {
                id: "2",
                name: "French",
                visibility: "public",
                source: "shared",
                accessMode: "readonly",
                owner: { nickname: "Dominik", id: "user-1" },
                color: "white",
            },
        ];
        render(<SharedList sharedRepertoires={repertoireList} />);
        const searchInput = screen.getByPlaceholderText("Find repertoire...");
        expect(searchInput).toBeInTheDocument();
        await userEvent.type(searchInput, "sicilian");
        const sicilian = screen.queryByText("Sicilian");
        const french = screen.queryByText("French");
        expect(sicilian).toBeInTheDocument();
        expect(french).not.toBeInTheDocument();
    });
});
