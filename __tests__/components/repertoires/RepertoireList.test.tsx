import "@testing-library/jest-dom";

import RepertoireList from "@/app/_components/repertoires/RepertoireList";
import { render, screen } from "@testing-library/react";
import { Repertoire } from "@/app/types";
import userEvent from "@testing-library/user-event";

// in testing enviroment, there is no routing context, so useRouter fails - we need to mock it
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
}));

describe("RepertoireList", () => {
    it("renders info if no repertoires passed", () => {
        render(<RepertoireList repertoires={[]} />);

        const info = screen.getByText("You don't have any repertoires.");

        expect(info).toBeVisible();
    });

    it("doesn't render search if no repertoires passed", () => {
        render(<RepertoireList repertoires={[]} />);

        const search = screen.queryByPlaceholderText("Search repertoires...");

        expect(search).not.toBeInTheDocument();
    });

    it("renders passed repertoires", () => {
        const repertoireList: Repertoire[] = [
            { id: "1", name: "test1!" },
            { id: "2", name: "test2!" },
        ];
        render(<RepertoireList repertoires={repertoireList} />);

        repertoireList.forEach(({ name }) => {
            const repertoireElement = screen.getByText(name);

            expect(repertoireElement).toBeInTheDocument();
        });
    });

    it("filters repertoires based on search bar", async () => {
        const repertoireList: Repertoire[] = [
            { id: "1", name: "Sicilian" },
            { id: "2", name: "French" },
        ];
        render(<RepertoireList repertoires={repertoireList} />);

        const searchInput = screen.getByPlaceholderText("Find repertoire...");

        expect(searchInput).toBeInTheDocument;

        await userEvent.type(searchInput, "sicilian");

        const sicilian = screen.queryByText("Sicilian");
        const french = screen.queryByText("French");

        expect(sicilian).toBeInTheDocument();
        expect(french).not.toBeInTheDocument();
    });
});
