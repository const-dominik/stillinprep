import RepertoireEditMode from "@/components/repertoires-management/repertoire-option/RepertoireEditMode";
import { changeRepertoireSettings } from "@/lib/actions/repertoire";
import { Repertoire } from "@/lib/types/types";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestProviders } from "../../../../testing_utils";

// Mock the dependencies
jest.mock("@/lib/actions/repertoire");
jest.mock("next/navigation");

const mockChangeRepertoireSettings =
    changeRepertoireSettings as jest.MockedFunction<
        typeof changeRepertoireSettings
    >;
const mockRefresh = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}));

describe("RepertoireEditMode", () => {
    const mockRepertoire: Repertoire = {
        id: "test-id-123",
        name: "Test Repertoire",
        visibility: "private" as const,
        hasAccess: [
            { nickname: "user1", mode: "readonly" },
            { nickname: "user2", mode: "edit" },
        ],
    };

    const defaultProps = {
        editedSettingsData: mockRepertoire,
        setEditedSettingsId: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Component Rendering", () => {
        it("renders the component with correct structure", () => {
            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );

            expect(screen.getByText("Repertoire Settings")).toBeInTheDocument();
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
            expect(screen.getByLabelText("Visibility")).toBeInTheDocument();
            expect(
                screen.getByLabelText("Users with Access")
            ).toBeInTheDocument();
            expect(screen.getByText("DELETE")).toBeInTheDocument();
            expect(screen.getByText("Save")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
        });

        it("displays correct default values", async () => {
            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
            expect(nameInput.value).toBe(mockRepertoire.name);

            expect(screen.getByDisplayValue("private")).toBeInTheDocument();
            expect(screen.getByText("user1")).toBeInTheDocument();
            expect(screen.getByText("user2")).toBeInTheDocument();
        });
    });

    describe("Form Validation", () => {
        it("shows validation error when name is empty", async () => {
            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const nameInput = screen.getByLabelText("Name");

            await userEvent.clear(nameInput);

            expect(
                screen.getByText("Repertoire need to have a name.")
            ).toBeInTheDocument();
        });
    });

    describe("Form Submission", () => {
        it("calls changeRepertoireSettings with correct data on successful save", async () => {
            mockChangeRepertoireSettings.mockResolvedValue({ success: true });

            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const nameInput = screen.getByLabelText("Name");
            const saveButton = screen.getByText("Save");

            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, "Updated Name");
            await userEvent.click(saveButton);

            await waitFor(() => {
                expect(mockChangeRepertoireSettings).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: "Updated Name",
                    }),
                    "test-id-123"
                );
            });
        });

        it("refreshes router and closes edit mode on successful save", async () => {
            mockChangeRepertoireSettings.mockResolvedValue({ success: true });

            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const saveButton = screen.getByText("Save");
            await userEvent.click(saveButton);

            await waitFor(() => {
                expect(mockRefresh).toHaveBeenCalled();
                expect(defaultProps.setEditedSettingsId).toHaveBeenCalledWith(
                    ""
                );
            });
        });

        it("does not refresh or close on failed save", async () => {
            mockChangeRepertoireSettings.mockResolvedValue({
                success: false,
                error: "sth went wrong",
            });

            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const saveButton = screen.getByText("Save");
            await userEvent.click(saveButton);

            await waitFor(() => {
                expect(mockChangeRepertoireSettings).toHaveBeenCalled();
            });

            expect(mockRefresh).not.toHaveBeenCalled();
            expect(defaultProps.setEditedSettingsId).not.toHaveBeenCalled();
        });
    });

    describe("Cancel Functionality", () => {
        it("calls setEditedSettingsId with empty string when cancel is clicked", async () => {
            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );
            const cancelButton = screen.getByText("Cancel");
            await userEvent.click(cancelButton);

            expect(defaultProps.setEditedSettingsId).toHaveBeenCalledWith("");
        });

        it("does not call changeRepertoireSettings when cancel is clicked", async () => {
            render(
                <TestProviders>
                    <RepertoireEditMode {...defaultProps} />
                </TestProviders>
            );

            const cancelButton = screen.getByText("Cancel");
            await userEvent.click(cancelButton);

            expect(mockChangeRepertoireSettings).not.toHaveBeenCalled();
        });
    });

    describe("Props Handling", () => {
        it("handles repertoire with public visibility", () => {
            const publicRepertoire = {
                ...mockRepertoire,
                visibility: "public" as const,
            };

            render(
                <TestProviders>
                    <RepertoireEditMode
                        {...defaultProps}
                        editedSettingsData={publicRepertoire}
                    />
                </TestProviders>
            );

            expect(screen.getByDisplayValue("public")).toBeInTheDocument();
        });
    });
});
