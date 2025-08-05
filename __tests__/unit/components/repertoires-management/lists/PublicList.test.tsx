import PublicList from "@/components/repertoires-management/lists/PublicList";
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

describe("PublicList", () => {
    it("renders info if no repertoires passed", () => {
        render(<PublicList publicRepertoires={[]} />);
        const info = screen.getByText("There are no public repertoires.");
        expect(info).toBeVisible();
    });

    it("doesn't render search if no repertoires passed", () => {
        render(<PublicList publicRepertoires={[]} />);
        const search = screen.queryByPlaceholderText("Find repertoire...");
        expect(search).not.toBeInTheDocument();
    });

    it("renders passed repertoires", () => {
        const repertoireList: DbRepertoires["public"] = [
            {
                id: "1",
                name: "test1!",
                visibility: "public",
                source: "public",
                owner: { nickname: "Dominik", id: "user-1" },
            },
            {
                id: "2",
                name: "test2!",
                visibility: "public",
                source: "public",
                owner: { nickname: "Michał", id: "user-2" },
            },
        ];
        render(<PublicList publicRepertoires={repertoireList} />);

        repertoireList.forEach(({ name, owner }) => {
            const repertoireElement = screen.getByText(name);
            const elementByName = screen.getByText(owner.nickname);

            expect(repertoireElement).toBeInTheDocument();
            expect(elementByName).toBeInTheDocument();
        });
    });
    it("filters repertoires based on search bar", async () => {
        const repertoireList: DbRepertoires["public"] = [
            {
                id: "1",
                name: "Sicilian",
                visibility: "public",
                source: "public",
                owner: { nickname: "Michał", id: "user-2" },
            },
            {
                id: "2",
                name: "French",
                visibility: "public",
                source: "public",
                owner: { nickname: "Dominik", id: "user-1" },
            },
        ];
        render(<PublicList publicRepertoires={repertoireList} />);
        const searchInput = screen.getByPlaceholderText("Find repertoire...");
        expect(searchInput).toBeInTheDocument();
        await userEvent.type(searchInput, "sicilian");
        const sicilian = screen.queryByText("Sicilian");
        const french = screen.queryByText("French");
        expect(sicilian).toBeInTheDocument();
        expect(french).not.toBeInTheDocument();
    });
});
