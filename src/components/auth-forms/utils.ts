import { CredentialsSignin } from "next-auth";

export const validatePassword = (password: string) => {
    const messages = [];
    if (password.length < 8)
        messages.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password))
        messages.push("At least one uppercase letter required");
    if (!/[a-z]/.test(password))
        messages.push("At least one lowercase letter required");
    if (!/\d/.test(password)) messages.push("At least one number required");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password))
        messages.push("At least one special character required");
    if (messages.length) {
        return messages.join("\n");
    }
    return true;
};

export class InvalidCredentials extends CredentialsSignin {
    code = "invalidCredentials";
}

export class SomethingWentWrong extends CredentialsSignin {
    code = "wrong";
    message = "Sorry. Something went wrong.";
}

export class BadCredentials extends CredentialsSignin {
    code = "400";
    message = "Both password and identifier must be passed.";
}

export const getErrorMessage = (code: string) => {
    if (code === "invalidCredentials") return "Credentials are invalid.";
    if (code === "400") return "Both password and identifier must be passed.";
    if (code === "OAuthAccountNotLinked")
        return "This account was registered with different method.";
    return "Sorry. Something went wrong.";
};
