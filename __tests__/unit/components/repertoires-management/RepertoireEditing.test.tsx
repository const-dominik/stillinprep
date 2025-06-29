/**
 * @jest-environment jsdom
 */

import RepertoireOption from "@/components/repertoires-management/repertoire-option/RepertoireOption";
import {
    deleteRepertoire,
    updateRepertoireField,
} from "@/lib/actions/repertoire";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestProviders } from "../../../testing_utils";

jest.mock("@/lib/actions/repertoire", () => ({
    updateRepertoireField: jest.fn(),
    deleteRepertoire: jest.fn(),
}));

describe("Singular repertoire element", () => {
    it("has option of editing", () => {
        render(
            <RepertoireOption
                id="1"
                name="test"
                key="1"
                setRemovedRepertoires={() => {}}
            />,
            { wrapper: TestProviders }
        );

        expect(screen.getByTestId("settings")).toBeInTheDocument();
    });

    it("changes to edit form on settings click", () => {
        render(
            <RepertoireOption
                id="1"
                name="test"
                key="1"
                setRemovedRepertoires={() => {}}
            />,
            { wrapper: TestProviders }
        );

        fireEvent.click(screen.getByTestId("settings"));

        expect(screen.getByTestId("settings")).toBeInTheDocument();
        expect(screen.getByTestId("trashcan")).toBeInTheDocument();
        expect(screen.queryByTestId("check")).toBeNull();

        fireEvent.click(screen.getByTestId("settings"));

        expect(screen.getByTestId("settings")).toBeInTheDocument();
        expect(screen.queryByTestId("trashcan")).toBeNull();
    });

    it("allows us to change repertoire name", async () => {
        render(
            <RepertoireOption
                id="1"
                name="test"
                key="1"
                setRemovedRepertoires={() => {}}
            />,
            { wrapper: TestProviders }
        );

        fireEvent.click(screen.getByTestId("settings"));

        const input = screen.getByTestId("edit-input") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toEqual("test");

        await userEvent.type(input, "test");
        expect(input.value).toEqual("testtest");

        const check = screen.getByTestId("check");
        expect(check).toBeInTheDocument();

        fireEvent.click(check);
        const mockUpdate = updateRepertoireField as jest.Mock;

        expect(mockUpdate).toHaveBeenCalledWith("1", "name", "testtest");
    });

    it("allows us to remove repertoire", async () => {
        const setRemovedMock = jest.fn();
        render(
            <RepertoireOption
                id="1"
                name="test"
                key="1"
                setRemovedRepertoires={setRemovedMock}
            />,
            { wrapper: TestProviders }
        );

        fireEvent.click(screen.getByTestId("settings"));
        fireEvent.click(screen.getByTestId("trashcan"));

        expect(
            await screen.findByText(
                "Are you sure? This is irreversible and will remove this repertoire."
            )
        ).toBeInTheDocument();

        const yes = await screen.findByText("Yes");
        fireEvent.click(yes);

        const mockRemove = deleteRepertoire as jest.Mock;

        await waitFor(() => {
            expect(mockRemove).toHaveBeenCalledWith("1");
            expect(setRemovedMock).toHaveBeenCalled();
        });
    });
});
