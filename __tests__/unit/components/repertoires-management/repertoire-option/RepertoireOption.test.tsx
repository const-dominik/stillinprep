import { TestProviders } from "@/../__tests__/testing_utils";
import RepertoireOption from "@/components/repertoires-management/repertoire-option/RepertoireOption";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/actions/repertoire", () => ({
    updateRepertoireField: jest.fn(),
    deleteRepertoire: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe("Singular repertoire element", () => {
    const defaultProps = {
        name: "Test Repertoire",
        id: "test-id-123",
        setEditedSettingsId: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("has option of editing", () => {
        render(<RepertoireOption {...defaultProps} />, {
            wrapper: TestProviders,
        });

        expect(screen.getByTestId("settings")).toBeInTheDocument();
    });

    it("changes to edit form on settings click", () => {
        render(<RepertoireOption {...defaultProps} />, {
            wrapper: TestProviders,
        });

        fireEvent.click(screen.getByTestId("settings"));
        expect(defaultProps.setEditedSettingsId).toHaveBeenCalledWith(
            "test-id-123"
        );
    });

    it("displays repertoire name", () => {
        render(<RepertoireOption {...defaultProps} />);

        expect(screen.getByText("Test Repertoire")).toBeInTheDocument();
    });

    it("navigates to repertoire when clicked", async () => {
        render(<RepertoireOption {...defaultProps} />);

        const repertoireElement = screen.getByText("Test Repertoire");
        await userEvent.click(repertoireElement);

        expect(pushMock).toHaveBeenCalledWith("repertoire/test-id-123");
    });

    it("calls onEdit when settings icon is clicked", async () => {
        render(<RepertoireOption {...defaultProps} />);

        const settingsIcon = screen.getByTestId("settings");
        await userEvent.click(settingsIcon);

        expect(defaultProps.setEditedSettingsId).toHaveBeenCalledTimes(1);
    });

    it("stops event propagation when settings icon is clicked", async () => {
        render(<RepertoireOption {...defaultProps} />);

        const settingsIcon = screen.getByTestId("settings");
        await userEvent.click(settingsIcon);

        expect(defaultProps.setEditedSettingsId).toHaveBeenCalledTimes(1);
        expect(pushMock).not.toHaveBeenCalled();
    });
});
