import RepertoireViewMode from "@/components/repertoires-management/repertoire-option/RepertoireViewMode";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

describe("RepertoireViewMode", () => {
    const defaultProps = {
        name: "Test Repertoire",
        id: "test-id-123",
        onEdit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("displays repertoire name", () => {
        render(<RepertoireViewMode {...defaultProps} />);

        expect(screen.getByText("Test Repertoire")).toBeInTheDocument();
    });

    it("navigates to repertoire when clicked", async () => {
        render(<RepertoireViewMode {...defaultProps} />);

        const repertoireElement = screen.getByText("Test Repertoire");
        await userEvent.click(repertoireElement);

        expect(redirect).toHaveBeenCalledWith("repertoire/test-id-123");
    });

    it("calls onEdit when settings icon is clicked", async () => {
        render(<RepertoireViewMode {...defaultProps} />);

        const settingsIcon = screen.getByTestId("settings");
        await userEvent.click(settingsIcon);

        expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it("stops event propagation when settings icon is clicked", async () => {
        render(<RepertoireViewMode {...defaultProps} />);

        const settingsIcon = screen.getByTestId("settings");
        await userEvent.click(settingsIcon);

        expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
        expect(redirect).not.toHaveBeenCalled();
    });
});
