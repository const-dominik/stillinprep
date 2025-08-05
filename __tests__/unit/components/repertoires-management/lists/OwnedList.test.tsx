import OwnedList from "@/components/repertoires-management/lists/OwnedList";
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

describe("OwnedList", () => {
    it("renders info if no repertoires passed", () => {
        render(<OwnedList ownedRepertoires={[]} />);
        const info = screen.getByText("You don't have any repertoires.");
        expect(info).toBeVisible();
    });
    it("doesn't render search if no repertoires passed", () => {
        render(<OwnedList ownedRepertoires={[]} />);
        const search = screen.queryByPlaceholderText("Find repertoire...");
        expect(search).not.toBeInTheDocument();
    });
    it("renders passed repertoires", () => {
        const repertoireList: DbRepertoires["owned"] = [
            {
                id: "1",
                name: "test1!",
                visibility: "private",
                hasAccess: [],
                source: "owned",
            },
            {
                id: "2",
                name: "test2!",
                visibility: "private",
                hasAccess: [],
                source: "owned",
            },
        ];
        render(<OwnedList ownedRepertoires={repertoireList} />);
        repertoireList.forEach(({ name }) => {
            const repertoireElement = screen.getByText(name);
            expect(repertoireElement).toBeInTheDocument();
        });
    });
    it("filters repertoires based on search bar", async () => {
        const repertoireList: DbRepertoires["owned"] = [
            {
                id: "1",
                name: "Sicilian",
                visibility: "private",
                hasAccess: [],
                source: "owned",
            },
            {
                id: "2",
                name: "French",
                visibility: "private",
                hasAccess: [],
                source: "owned",
            },
        ];
        render(<OwnedList ownedRepertoires={repertoireList} />);
        const searchInput = screen.getByPlaceholderText("Find repertoire...");
        expect(searchInput).toBeInTheDocument();
        await userEvent.type(searchInput, "sicilian");
        const sicilian = screen.queryByText("Sicilian");
        const french = screen.queryByText("French");
        expect(sicilian).toBeInTheDocument();
        expect(french).not.toBeInTheDocument();
    });
});
