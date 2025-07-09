import RegistrationForm from "@/components/auth-forms/RegistrationForm";
import { registerUser } from "@/lib/actions/register";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/actions/register", () => ({
    registerUser: jest.fn(),
}));

describe("Registration: ", () => {
    it("loads form with all fields", () => {
        render(<RegistrationForm />);

        expect(screen.getByLabelText("Nickname")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(
            screen.getByLabelText("Password", { exact: true })
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
        expect(screen.getByText("REGISTER")).toBeInTheDocument();
    });

    it("shows validation error on empty submission", async () => {
        render(<RegistrationForm />);
        fireEvent.click(screen.getByText("REGISTER"));

        await waitFor(() => {
            expect(
                screen.getByText("Nickname is required!")
            ).toBeInTheDocument();
            expect(screen.getByText("Email is required!")).toBeInTheDocument();
            expect(
                screen.getByText("Password is required!")
            ).toBeInTheDocument();
            expect(
                screen.getByText("You need to confirm your password!")
            ).toBeInTheDocument();
        });
    });

    it("shows error message if registration fails", async () => {
        (registerUser as jest.Mock).mockResolvedValue({
            success: false,
            error: "Email already exists",
        });

        render(<RegistrationForm />);

        fireEvent.change(screen.getByLabelText("Nickname"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
            target: { value: "StrongPass123!" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "StrongPass123!" },
        });

        fireEvent.click(screen.getByText("REGISTER"));

        await waitFor(() => {
            expect(
                screen.getByText("Email already exists")
            ).toBeInTheDocument();
        });
    });

    it("shows success message if registration succeeds", async () => {
        (registerUser as jest.Mock).mockResolvedValue({
            success: true,
            message: "Account created successfully",
        });

        render(<RegistrationForm />);

        fireEvent.change(screen.getByLabelText("Nickname"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "StrongPass123!" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "StrongPass123!" },
        });

        fireEvent.click(screen.getByText("REGISTER"));

        await waitFor(() => {
            expect(
                screen.getByText("Account created successfully")
            ).toBeInTheDocument();
        });
    });

    it("validates input", async () => {
        render(<RegistrationForm />);

        fireEvent.change(screen.getByLabelText("Nickname"), {
            target: { value: "test! user" },
        });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test" },
        });
        fireEvent.change(screen.getByLabelText("Password", { exact: true }), {
            target: { value: "password" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "different" },
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Nickname can consist only of numbers, letters and underscores."
                )
            ).toBeInTheDocument();

            expect(
                screen.getByText("It has to be an email!")
            ).toBeInTheDocument();

            expect(screen.getByText(/one uppercase/i)).toBeInTheDocument();
            expect(screen.getByText(/one number/i)).toBeInTheDocument();
            expect(
                screen.getByText(/one special character/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/don't match/i)).toBeInTheDocument();
        });
    });
});
