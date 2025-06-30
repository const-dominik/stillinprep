/**
 * @jest-environment jsdom
 */

import RepertoireEditMode from "@/components/repertoires-management/forms/RepertoireEditMode";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RepertoireEditMode", () => {
    const defaultProps = {
        currentName: "Test Repertoire",
        setCurrentName: jest.fn(),
        onSave: jest.fn(),
        onRemove: jest.fn(),
        onCancel: jest.fn(),
        hasChanges: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("updates name when typing in input", async () => {
        render(<RepertoireEditMode {...defaultProps} />);

        const input = screen.getByTestId("edit-input") as HTMLInputElement;
        expect(input.value).toBe(defaultProps.currentName);

        await userEvent.clear(input);
        await userEvent.type(input, "name");

        expect(defaultProps.setCurrentName).toHaveBeenCalledTimes(5); // 1 for backspace, 4 for name
    });

    it("calls methods when clicking icons", async () => {
        render(<RepertoireEditMode {...defaultProps} hasChanges={true} />);

        const checkIcon = screen.getByTestId("check");
        const trashIcon = screen.getByTestId("trashcan");
        const settingsIcon = screen.getByTestId("settings");

        await userEvent.click(checkIcon);
        await userEvent.click(trashIcon);
        await userEvent.click(settingsIcon);

        expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
        expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("shows check icon only when hasChanges is true", () => {
        const { rerender } = render(
            <RepertoireEditMode {...defaultProps} hasChanges={true} />
        );

        expect(screen.getByTestId("check")).toBeInTheDocument();

        rerender(<RepertoireEditMode {...defaultProps} hasChanges={false} />);

        expect(screen.queryByTestId("check")).not.toBeInTheDocument();
    });
});
