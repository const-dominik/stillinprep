import { user } from "@/../__tests__/testing_utils";
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
        render(<OwnedList ownedRepertoires={[]} user={user} />);
        const info = screen.getByText("Create your first repertoire above.");
        expect(info).toBeVisible();
    });
    it("doesn't render search if no repertoires passed", () => {
        render(<OwnedList ownedRepertoires={[]} user={user} />);
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
                color: "white",
            },
            {
                id: "2",
                name: "test2!",
                visibility: "private",
                hasAccess: [],
                source: "owned",
                color: "white",
            },
        ];
        render(<OwnedList ownedRepertoires={repertoireList} user={user} />);
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
                color: "white",
            },
            {
                id: "2",
                name: "French",
                visibility: "private",
                hasAccess: [],
                source: "owned",
                color: "white",
            },
        ];
        render(<OwnedList ownedRepertoires={repertoireList} user={user} />);
        const searchInput = screen.getByPlaceholderText("Find repertoire...");
        expect(searchInput).toBeInTheDocument();
        await userEvent.type(searchInput, "sicilian");
        const sicilian = screen.queryByText("Sicilian");
        const french = screen.queryByText("French");
        expect(sicilian).toBeInTheDocument();
        expect(french).not.toBeInTheDocument();
    });
});
