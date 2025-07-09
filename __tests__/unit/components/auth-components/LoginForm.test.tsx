import LoginForm from "@/components/auth-forms/LoginForm";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
    redirect: jest.fn(),
}));

describe("LoginForm", () => {
    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => null,
        });
    });

    it("renders login form", () => {
        render(<LoginForm />);
        expect(screen.getByText("LOGIN")).toBeInTheDocument();
        expect(screen.getByLabelText("Nickname/Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByText("Continue with Google")).toBeInTheDocument();
        expect(screen.getByText("Continue with Github")).toBeInTheDocument();
    });

    it("shows validation errors on empty submit", async () => {
        render(<LoginForm />);
        fireEvent.click(screen.getByText("LOGIN"));

        await waitFor(() => {
            expect(
                screen.getByText("Nickname or email is required.")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Password is required!")
            ).toBeInTheDocument();
        });
    });

    it("shows error on failed login", async () => {
        (signIn as jest.Mock).mockResolvedValue({
            ok: false,
            error: "Credentials are invalid.",
            code: "invalidCredentials",
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText("Nickname/Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByText("LOGIN"));

        await waitFor(() => {
            expect(
                screen.getByText("Credentials are invalid.")
            ).toBeInTheDocument();
        });
    });

    it("calls redirect on successful login", async () => {
        const redirectMock = redirect as unknown as jest.Mock;

        (signIn as jest.Mock).mockResolvedValue({
            ok: true,
            error: null,
        });

        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText("Nickname/Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByText("LOGIN"));

        await waitFor(() => {
            expect(redirectMock).toHaveBeenCalledWith("/");
        });
    });
});
